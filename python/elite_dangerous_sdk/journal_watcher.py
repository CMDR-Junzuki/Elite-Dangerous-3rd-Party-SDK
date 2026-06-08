import json
import time
from pathlib import Path
from typing import Generator

from .journal import parse_line

_SCHEMA_EVENTS: set[str] | None = None


def _load_known_events() -> set[str]:
    global _SCHEMA_EVENTS
    if _SCHEMA_EVENTS is not None:
        return _SCHEMA_EVENTS
    events_dir = Path(__file__).resolve().parent.parent.parent / "specs" / "journal" / "events"
    if not events_dir.exists():
        _SCHEMA_EVENTS = set()
        return _SCHEMA_EVENTS
    _SCHEMA_EVENTS = {f.stem for f in events_dir.iterdir() if f.suffix == ".json"}
    return _SCHEMA_EVENTS


def _warn_if_unknown(event: dict, warn_on_unknown: bool) -> None:
    if not warn_on_unknown:
        return
    known = _load_known_events()
    if not known:
        return
    event_name = event.get("event", "")
    if event_name and event_name not in known:
        import warnings
        warnings.warn(f"[JournalWatcher] Unknown event type: \"{event_name}\"")


class JournalWatcher:
    def __init__(self, directory: str, warn_on_unknown: bool = False):
        self.directory = directory
        self._running = False
        self._positions: dict[str, int] = {}
        self._warn_on_unknown = warn_on_unknown

    def watch_events(self) -> Generator[dict, None, None]:
        self._running = True
        while self._running:
            files = sorted(
                Path(self.directory).glob("Journal.*.log"),
                key=lambda p: p.stat().st_mtime,
            )
            for file in files:
                fname = file.name
                current_size = file.stat().st_size
                last_pos = self._positions.get(fname, 0)
                if current_size > last_pos:
                    with open(file, "r", encoding="utf-8") as f:
                        f.seek(last_pos)
                        for line in f:
                            line = line.strip()
                            if line:
                                try:
                                    ev = json.loads(line)
                                    _warn_if_unknown(ev, self._warn_on_unknown)
                                    yield ev
                                except json.JSONDecodeError:
                                    continue
                    self._positions[fname] = current_size
            time.sleep(0.5)

    def stop(self):
        self._running = False
