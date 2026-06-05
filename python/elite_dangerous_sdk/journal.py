"""
Elite Dangerous Player Journal Reader

Location: %USERPROFILE%\\Saved Games\\Frontier Developments\\Elite Dangerous\\
Format: JSON Lines (one JSON object per line)
"""

import json
import os
import re
from dataclasses import dataclass
from pathlib import Path
from typing import Any, Iterator, Optional, Union

JOURNAL_RE = re.compile(r"^Journal\.\d{4}-\d{2}-\d{2}T\d{6}_\d{2}\.log$")

MAX_SAFE_INTEGER = 2**53 - 1


@dataclass
class JournalOptions:
    directory: Optional[str] = None
    position: Optional[Union[str, dict]] = None  # "start", "end", or {"file": str, "offset": int}


def get_default_journal_dir() -> Path:
    """Get the default journal directory path."""
    env_dir = os.environ.get("ED_JOURNAL_DIR")
    if env_dir:
        return Path(env_dir)

    if os.name == "nt":
        return Path.home() / "Saved Games" / "Frontier Developments" / "Elite Dangerous"
    # Linux/Steam Proton
    return (
        Path.home()
        / ".local/share/Steam/steamapps/compatdata/359320/pfx/drive_c/users/steamuser"
        / "Saved Games"
        / "Frontier Developments"
        / "Elite Dangerous"
    )


def _is_bigint_candidate(value: int) -> bool:
    return value > MAX_SAFE_INTEGER or value < -MAX_SAFE_INTEGER


def _convert_bigints(val: Any) -> Any:
    if isinstance(val, dict):
        return {k: _convert_bigints(v) for k, v in val.items()}
    elif isinstance(val, list):
        return [_convert_bigints(v) for v in val]
    elif isinstance(val, int) and _is_bigint_candidate(val):
        return str(val)
    return val


def parse_line(line: str) -> dict:
    return json.loads(line)


def parse_with_bigint(line: str) -> dict:
    event = json.loads(line)
    event["_bigint"] = True
    return event


def parse_with_lossy_integers(line: str) -> dict:
    return json.loads(line)


def stringify_event(event: dict) -> str:
    return json.dumps(event)


def stringify_bigint_json(event: dict) -> str:
    return json.dumps(_convert_bigints(event))


def is_event_type(event: dict, event_type: str) -> bool:
    return event.get("event") == event_type


def list_journal_files(directory: str | Path | None = None) -> list[Path]:
    """List all journal files sorted chronologically."""
    if directory is None:
        directory = get_default_journal_dir()
    directory = Path(directory)

    if not directory.exists():
        return []

    files = sorted(
        directory.glob("Journal.*.log"),
        key=lambda f: f.stat().st_mtime,
    )
    return [f for f in files if JOURNAL_RE.match(f.name)]


class JournalReader:
    """Read and iterate over Elite Dangerous journal events."""

    def __init__(self, options: Optional[Union[JournalOptions, str, Path]] = None):
        if isinstance(options, (str, Path)):
            options = JournalOptions(directory=str(options))
        elif options is None:
            options = JournalOptions()
        self.directory = Path(options.directory) if options.directory else get_default_journal_dir()
        self._position: dict | None = None
        if options.position == "start":
            self._position = {"file": "", "offset": 0}
        elif isinstance(options.position, dict):
            self._position = options.position

    def read_events(self) -> Iterator[dict[str, Any]]:
        files = list_journal_files(self.directory)

        if not files:
            return

        if self._position is None:
            latest = files[-1]
            self._position = {"file": str(latest), "offset": latest.stat().st_size}

        start_index = 0
        if self._position:
            for i, f in enumerate(files):
                if str(f) == self._position.get("file"):
                    start_index = i
                    break

        for file in files[start_index:]:
            with open(file, "r", encoding="utf-8") as f:
                if self._position and str(file) == self._position.get("file"):
                    f.seek(self._position.get("offset", 0))

                while True:
                    line = f.readline()
                    if not line:
                        break
                    line = line.strip()
                    if not line:
                        continue
                    try:
                        event = json.loads(line)
                        self._position = {
                            "file": str(file),
                            "offset": f.tell(),
                        }
                        yield event
                    except json.JSONDecodeError:
                        continue

    def read_status(self) -> dict[str, Any] | None:
        """Read the current Status.json file."""
        try:
            with open(self.directory / "Status.json", "r") as f:
                return json.load(f)
        except (FileNotFoundError, json.JSONDecodeError):
            return None

    def read_market(self) -> dict[str, Any] | None:
        """Read the current Market.json file."""
        try:
            with open(self.directory / "Market.json", "r") as f:
                return json.load(f)
        except (FileNotFoundError, json.JSONDecodeError):
            return None

    def read_outfitting(self) -> dict[str, Any] | None:
        """Read the current Outfitting.json file."""
        try:
            with open(self.directory / "Outfitting.json", "r") as f:
                return json.load(f)
        except (FileNotFoundError, json.JSONDecodeError):
            return None

    def read_shipyard(self) -> dict[str, Any] | None:
        """Read the current Shipyard.json file."""
        try:
            with open(self.directory / "Shipyard.json", "r") as f:
                return json.load(f)
        except (FileNotFoundError, json.JSONDecodeError):
            return None

    def read_cargo(self) -> dict[str, Any] | None:
        """Read the current Cargo.json file."""
        try:
            with open(self.directory / "Cargo.json", "r") as f:
                return json.load(f)
        except (FileNotFoundError, json.JSONDecodeError):
            return None

    @property
    def position(self) -> dict | None:
        return self._position

    @position.setter
    def position(self, pos: dict | None):
        self._position = pos
