"""Tests for create_journal_stream."""

import asyncio
import json
import tempfile
from pathlib import Path

import pytest

from elite_dangerous_sdk.journal_stream import create_journal_stream


EVENT1 = '{"timestamp":"2024-01-01T00:00:00Z","event":"Docked","StationName":"A","MarketID":1}\n'
EVENT2 = '{"timestamp":"2024-01-01T00:01:00Z","event":"Location","System":"Sol","SystemAddress":1}\n'
EVENT3 = '{"timestamp":"2024-01-01T00:02:00Z","event":"Scan","BodyName":"Earth","BodyID":1}\n'


def _write_journal(dir_path: str, name: str, lines: list[str]) -> str:
    path = Path(dir_path) / name
    path.write_text("".join(lines), encoding="utf-8")
    return str(path)


@pytest.fixture
def temp_journal_dir():
    with tempfile.TemporaryDirectory() as tmp:
        yield tmp


@pytest.mark.asyncio
async def test_reads_existing_events_from_start(temp_journal_dir):
    _write_journal(temp_journal_dir, "Journal.2024-01-01T000000_01.log", [EVENT1, EVENT2])

    events = []
    gen = create_journal_stream(directory=temp_journal_dir, from_="start")
    count = 0
    async for event in gen:
        events.append(event)
        count += 1
        if count >= 2:
            break

    assert len(events) == 2
    assert events[0]["event"] == "Docked"
    assert events[1]["event"] == "Location"


@pytest.mark.asyncio
async def test_skips_existing_events_from_end(temp_journal_dir):
    _write_journal(temp_journal_dir, "Journal.2024-01-01T000000_01.log", [EVENT1, EVENT2])

    events = []
    gen = create_journal_stream(directory=temp_journal_dir, from_="end")
    # The stream will be in a live-polling loop; we can't easily break out
    # So just collect for a short timeout and verify
    async def collect():
        async for event in gen:
            events.append(event)

    task = asyncio.create_task(collect())
    await asyncio.sleep(0.1)
    task.cancel()
    try:
        await task
    except asyncio.CancelledError:
        pass

    assert len(events) == 0


@pytest.mark.asyncio
async def test_filters_events_by_type(temp_journal_dir):
    _write_journal(temp_journal_dir, "Journal.2024-01-01T000000_01.log", [
        EVENT1, EVENT2, EVENT3,
    ])

    events = []
    gen = create_journal_stream(
        directory=temp_journal_dir, from_="start",
        filter=["Docked", "Scan"],
    )
    count = 0
    async for event in gen:
        events.append(event)
        count += 1
        if count >= 2:
            break

    assert len(events) == 2
    assert events[0]["event"] == "Docked"
    assert events[1]["event"] == "Scan"


@pytest.mark.asyncio
async def test_reads_across_multiple_files(temp_journal_dir):
    _write_journal(temp_journal_dir, "Journal.2024-01-01T000000_01.log", [EVENT1])
    _write_journal(temp_journal_dir, "Journal.2024-01-01T010000_01.log", [EVENT2])

    events = []
    gen = create_journal_stream(directory=temp_journal_dir, from_="start")
    count = 0
    async for event in gen:
        events.append(event)
        count += 1
        if count >= 2:
            break

    assert len(events) == 2
