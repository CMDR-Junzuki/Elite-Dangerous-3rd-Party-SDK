"""Journal Replay - replay journal events at configurable speed."""

import asyncio
import json
import os
import re
from dataclasses import dataclass, field
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Callable, Optional

from .journal import list_journal_files

JOURNAL_RE = re.compile(r"^Journal\.\d{4}-\d{2}-\d{2}T\d{6}_\d{2}\.log$")

ReplayState = str  # "idle" | "playing" | "paused" | "ended"

EventCallback = Callable[..., None]


class JournalReplay:
    """Replay journal events with configurable speed, pause/resume/seek."""

    def __init__(
        self,
        speed: float = 1.0,
        filter: Optional[list[str]] = None,
    ):
        self._events: list[dict[str, Any]] = []
        self._current_index = 0
        self._speed = max(0.1, speed)
        self._filter = filter
        self._state: ReplayState = "idle"
        self._timer: Optional[asyncio.TimerHandle] = None
        self._loop: Optional[asyncio.AbstractEventLoop] = None
        self._play_future: Optional[asyncio.Future] = None
        self._paused = asyncio.Event()
        self._paused.set()

        self._on_event: Optional[EventCallback] = None
        self._on_start: Optional[EventCallback] = None
        self._on_end: Optional[EventCallback] = None
        self._on_pause: Optional[EventCallback] = None
        self._on_resume: Optional[EventCallback] = None
        self._on_stop: Optional[EventCallback] = None
        self._on_seek: Optional[EventCallback] = None

    @property
    def speed(self) -> float:
        return self._speed

    @speed.setter
    def speed(self, n: float):
        self._speed = max(0.1, n)

    @property
    def current_index(self) -> int:
        return self._current_index

    @property
    def total_events(self) -> int:
        return len(self._events)

    @property
    def state(self) -> ReplayState:
        return self._state

    def on(self, event_type: str, callback: EventCallback):
        if event_type == "event":
            self._on_event = callback
        elif event_type == "start":
            self._on_start = callback
        elif event_type == "end":
            self._on_end = callback
        elif event_type == "pause":
            self._on_pause = callback
        elif event_type == "resume":
            self._on_resume = callback
        elif event_type == "stop":
            self._on_stop = callback
        elif event_type == "seek":
            self._on_seek = callback

    def load_events(self, events: list[dict[str, Any]]):
        if self._filter:
            self._events = [e for e in events if e.get("event") in self._filter]
        else:
            self._events = list(events)

    async def load(self, file_or_dir: str | Path):
        resolved = Path(file_or_dir).resolve()
        self._events = []

        if resolved.is_dir():
            files = list_journal_files(resolved)
            for f in files:
                await self._load_file(f)
        elif resolved.is_file():
            await self._load_file(resolved)

    async def _load_file(self, path: Path):
        loop = asyncio.get_running_loop()

        def _read():
            events: list[dict[str, Any]] = []
            with open(path, "r", encoding="utf-8") as f:
                for line in f:
                    line = line.strip()
                    if not line:
                        continue
                    try:
                        event = json.loads(line)
                        if not self._filter or event.get("event") in self._filter:
                            events.append(event)
                    except json.JSONDecodeError:
                        continue
            return events

        events = await loop.run_in_executor(None, _read)
        self._events.extend(events)

    async def play(self):
        if not self._events:
            return
        if self._state == "paused":
            self.resume()
            return

        self._state = "playing"
        self._current_index = 0
        self._loop = asyncio.get_running_loop()
        self._paused.set()

        if self._on_start:
            self._on_start()

        self._play_future = asyncio.get_running_loop().create_future()

        self._schedule_next()

        try:
            await self._play_future
        except asyncio.CancelledError:
            pass

    def _schedule_next(self):
        if self._state != "playing":
            return

        if self._current_index >= len(self._events):
            self._finalize()
            return

        event = self._events[self._current_index]
        if self._on_event:
            self._on_event(event)
        self._current_index += 1

        if self._current_index >= len(self._events):
            self._finalize()
            return

        delay = self._get_delay()
        if self._loop:
            self._timer = self._loop.call_later(delay, self._schedule_next)

    def _get_delay(self) -> float:
        from_ev = self._events[self._current_index - 1]
        to_ev = self._events[self._current_index]

        def _parse_ts(ts: str) -> Optional[datetime]:
            try:
                if ts.endswith("Z"):
                    return datetime.fromisoformat(ts[:-1]).replace(tzinfo=timezone.utc)
                return datetime.fromisoformat(ts)
            except (ValueError, TypeError):
                return None

        from_time = _parse_ts(from_ev.get("timestamp", ""))
        to_time = _parse_ts(to_ev.get("timestamp", ""))

        if from_time is None or to_time is None or to_time <= from_time:
            return 0.1

        delta = (to_time - from_time).total_seconds()
        return max(0.01, min(10.0, delta / self._speed))

    def _finalize(self):
        self._state = "ended"
        if self._on_end:
            self._on_end()
        if self._play_future and not self._play_future.done():
            self._play_future.set_result(None)

    def pause(self):
        if self._state != "playing":
            return
        self._state = "paused"
        if self._timer:
            self._timer.cancel()
            self._timer = None
        if self._on_pause:
            self._on_pause()

    def resume(self):
        if self._state != "paused":
            return
        self._state = "playing"
        if self._on_resume:
            self._on_resume()
        self._schedule_next()

    def stop(self):
        if self._timer:
            self._timer.cancel()
            self._timer = None
        if self._state in ("playing", "paused"):
            self._state = "idle"
            self._current_index = 0
            if self._on_stop:
                self._on_stop()
            if self._play_future and not self._play_future.done():
                self._play_future.set_result(None)

    def seek(self, index: int):
        if not self._events:
            return
        if index < 0:
            index = 0
        if index >= len(self._events):
            index = len(self._events) - 1
        self._current_index = index
        if self._timer:
            self._timer.cancel()
            self._timer = None
            if self._state == "playing":
                self._schedule_next()
        if self._on_seek:
            self._on_seek(index)
