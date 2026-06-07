import asyncio
import json
from pathlib import Path
from typing import AsyncIterator, Optional

from .journal import list_journal_files


async def create_journal_stream(
    directory: Optional[str] = None,
    from_: str = "end",
    filter: Optional[list[str]] = None,
    poll_interval: float = 0.5,
) -> AsyncIterator[dict]:
    """Create a live stream of journal events.

    First catches up on existing events (if from_ != 'end'),
    then streams new events in real-time via polling.

    Args:
        directory: Journal directory path (auto-detected if None)
        from_: 'start' to replay all past events, 'end' for live only
        filter: Optional list of event type strings to include
        poll_interval: Seconds between polls (default: 0.5)
    """
    journal_dir = str(get_default_journal_dir() if directory is None else Path(directory))
    filter_set = set(filter) if filter else None
    tracked_sizes: dict[str, int] = {}

    files = list_journal_files(journal_dir)

    if from_ != "end":
        for file in files:
            size = file.stat().st_size
            tracked_sizes[file.name] = size
            if size <= 0:
                continue
            with open(file, "r", encoding="utf-8") as f:
                for line in f:
                    line = line.strip()
                    if not line:
                        continue
                    try:
                        event = json.loads(line)
                        if not filter_set or event.get("event") in filter_set:
                            yield event
                    except json.JSONDecodeError:
                        continue
    else:
        for file in files:
            try:
                tracked_sizes[file.name] = file.stat().st_size
            except OSError:
                pass

    while True:
        current_files = sorted(
            Path(journal_dir).glob("Journal.*.log"),
            key=lambda p: p.stat().st_mtime,
        )
        for file in current_files:
            prev_size = tracked_sizes.get(file.name, 0)
            try:
                current_size = file.stat().st_size
            except OSError:
                continue

            if current_size > prev_size:
                with open(file, "r", encoding="utf-8") as f:
                    f.seek(prev_size)
                    for line in f:
                        line = line.strip()
                        if not line:
                            continue
                        try:
                            event = json.loads(line)
                            if not filter_set or event.get("event") in filter_set:
                                yield event
                        except json.JSONDecodeError:
                            continue
                tracked_sizes[file.name] = current_size
            elif current_size < prev_size:
                tracked_sizes[file.name] = current_size

        await asyncio.sleep(poll_interval)
