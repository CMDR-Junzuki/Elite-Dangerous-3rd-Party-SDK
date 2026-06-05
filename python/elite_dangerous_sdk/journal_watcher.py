import json
import time
from pathlib import Path
from typing import Generator


class JournalWatcher:
    def __init__(self, directory: str):
        self.directory = directory
        self._running = False
        self._positions: dict[str, int] = {}

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
                                    yield json.loads(line)
                                except json.JSONDecodeError:
                                    continue
                    self._positions[fname] = current_size
            time.sleep(0.5)

    def stop(self):
        self._running = False
