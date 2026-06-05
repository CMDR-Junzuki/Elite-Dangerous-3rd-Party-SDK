import asyncio
import json
import os
import tempfile

import pytest

from elite_dangerous_sdk.journal_replay import JournalReplay


def make_event(event: str, timestamp: str, **extra) -> dict:
    return {"timestamp": timestamp, "event": event, **extra}


EVENTS_1S_APART = [
    make_event("Fileheader", "2024-01-01T00:00:00Z", part=1),
    make_event("LoadGame", "2024-01-01T00:00:01Z", Commander="Test", Ship="SideWinder", ShipID=1),
    make_event("FSDJump", "2024-01-01T00:00:02Z", StarSystem="Sol", SystemAddress=1),
]

EVENTS_5M_APART = [
    make_event("Fileheader", "2024-01-01T00:00:00Z", part=1),
    make_event("LoadGame", "2024-01-01T00:05:00Z", Commander="Test", Ship="SideWinder", ShipID=1),
    make_event("FSDJump", "2024-01-01T00:10:00Z", StarSystem="Sol", SystemAddress=1),
]


class TestJournalReplay:
    def test_load_events(self):
        replay = JournalReplay()
        replay.load_events(EVENTS_1S_APART)
        assert replay.total_events == 3
        assert replay.state == "idle"

    def test_load_events_with_filter(self):
        replay = JournalReplay(filter=["FSDJump"])
        replay.load_events(EVENTS_1S_APART)
        assert replay.total_events == 1

    def test_defaults(self):
        replay = JournalReplay()
        assert replay.total_events == 0
        assert replay.current_index == 0
        assert replay.speed == 1.0

    @pytest.mark.asyncio
    async def test_play_all_events(self):
        replay = JournalReplay(speed=100)
        replay.load_events(EVENTS_1S_APART)

        events = []
        start_called = False
        end_called = False

        def on_event(e):
            events.append(e)

        def on_start():
            nonlocal start_called
            start_called = True

        def on_end():
            nonlocal end_called
            end_called = True

        replay.on("event", on_event)
        replay.on("start", on_start)
        replay.on("end", on_end)

        await replay.play()

        assert len(events) == 3
        assert events[0]["event"] == "Fileheader"
        assert events[1]["event"] == "LoadGame"
        assert events[2]["event"] == "FSDJump"
        assert start_called
        assert end_called
        assert replay.state == "ended"

    @pytest.mark.asyncio
    async def test_play_no_events(self):
        replay = JournalReplay()
        end_called = False

        def on_end():
            nonlocal end_called
            end_called = True

        replay.on("end", on_end)
        await replay.play()
        assert not end_called

    @pytest.mark.asyncio
    async def test_pause_and_resume(self):
        replay = JournalReplay()
        replay.load_events(EVENTS_5M_APART)

        events = []
        pause_called = False
        resume_called = False

        def on_event(e):
            events.append(e)

        def on_pause():
            nonlocal pause_called
            pause_called = True

        def on_resume():
            nonlocal resume_called
            resume_called = True

        replay.on("event", on_event)
        replay.on("pause", on_pause)
        replay.on("resume", on_resume)

        play_task = asyncio.create_task(replay.play())
        await asyncio.sleep(0.05)

        assert len(events) == 1
        assert replay.state == "playing"

        replay.pause()
        assert replay.state == "paused"
        assert pause_called

        count_after_pause = len(events)
        await asyncio.sleep(0.1)
        assert len(events) == count_after_pause

        replay.speed = 100
        replay.resume()
        assert replay.state == "playing"
        assert resume_called

        await play_task
        assert len(events) == 3

    @pytest.mark.asyncio
    async def test_stop(self):
        replay = JournalReplay()
        replay.load_events(EVENTS_5M_APART)

        stop_called = False

        def on_stop():
            nonlocal stop_called
            stop_called = True

        replay.on("stop", on_stop)

        play_task = asyncio.create_task(replay.play())
        await asyncio.sleep(0.05)
        replay.stop()

        assert replay.state == "idle"
        assert replay.current_index == 0
        assert stop_called
        await play_task

    def test_seek(self):
        replay = JournalReplay()
        replay.load_events(EVENTS_1S_APART)

        seek_called = False

        def on_seek(idx):
            nonlocal seek_called
            seek_called = True
            assert idx == 1

        replay.on("seek", on_seek)
        replay.seek(1)
        assert replay.current_index == 1
        assert seek_called

    def test_seek_clamps(self):
        replay = JournalReplay()
        replay.load_events(EVENTS_1S_APART)

        replay.seek(-5)
        assert replay.current_index == 0

        replay.seek(999)
        assert replay.current_index == 2

    def test_speed_property(self):
        replay = JournalReplay(speed=10)
        assert replay.speed == 10

        replay.speed = -5
        assert replay.speed == 0.1

    @pytest.mark.asyncio
    async def test_filter_on_load(self):
        replay = JournalReplay(filter=["FSDJump", "LoadGame"])
        replay.load_events(EVENTS_1S_APART)
        assert replay.total_events == 2

    @pytest.mark.asyncio
    async def test_load_from_file(self):
        replay = JournalReplay()

        with tempfile.NamedTemporaryFile(
            mode="w", suffix=".log", delete=False, encoding="utf-8"
        ) as f:
            f.write('{"timestamp":"2024-01-01T00:00:00Z","event":"Fileheader","part":1}\n')
            f.write('{"timestamp":"2024-01-01T00:00:01Z","event":"LoadGame","Commander":"Test","Ship":"SideWinder","ShipID":1}\n')
            f.write('{"timestamp":"2024-01-01T00:00:02Z","event":"FSDJump","StarSystem":"Sol","SystemAddress":1}\n')
            fname = f.name

        try:
            await replay.load(fname)
            assert replay.total_events == 3
        finally:
            os.unlink(fname)

    @pytest.mark.asyncio
    async def test_load_from_directory(self):
        replay = JournalReplay()
        tmpdir = tempfile.mkdtemp()

        try:
            file1 = os.path.join(tmpdir, "Journal.2024-01-01T000000_01.log")
            with open(file1, "w", encoding="utf-8") as f:
                f.write('{"timestamp":"2024-01-01T00:00:00Z","event":"Fileheader","part":1}\n')

            file2 = os.path.join(tmpdir, "Journal.2024-01-01T010000_01.log")
            with open(file2, "w", encoding="utf-8") as f:
                f.write('{"timestamp":"2024-01-01T01:00:00Z","event":"LoadGame","Commander":"Test","Ship":"SideWinder","ShipID":1}\n')

            await replay.load(tmpdir)
            assert replay.total_events == 2
        finally:
            import shutil
            shutil.rmtree(tmpdir, ignore_errors=True)

    @pytest.mark.asyncio
    async def test_same_timestamp_events(self):
        events = [
            make_event("Fileheader", "2024-01-01T00:00:00Z", part=1),
            make_event("Docked", "2024-01-01T00:00:00Z", StationName="TEST"),
        ]

        replay = JournalReplay(speed=100)
        replay.load_events(events)

        emitted = []
        replay.on("event", lambda e: emitted.append(e))

        await replay.play()
        assert len(emitted) == 2
