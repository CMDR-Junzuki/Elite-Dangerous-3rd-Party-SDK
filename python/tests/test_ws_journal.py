"""Tests for the WebSocket journal server."""

import asyncio
import json
import os
import tempfile
from pathlib import Path

import pytest

try:
    import websockets
    from elite_dangerous_sdk.ws_journal import JournalWebSocketServer

    HAS_WEBSOCKETS = True
except ImportError:
    HAS_WEBSOCKETS = False


@pytest.fixture
def journal_dir():
    with tempfile.TemporaryDirectory(suffix="-ed-journal") as tmp:
        yield Path(tmp)


@pytest.fixture
def journal_file(journal_dir):
    path = journal_dir / "Journal.2024-01-15T120000_01.log"
    path.write_text('{"event":"FileHeader","timestamp":"2024-01-15T12:00:00Z","part":1}\n')
    yield path


@pytest.mark.skipif(not HAS_WEBSOCKETS, reason="websockets not installed")
@pytest.mark.asyncio
async def test_start_stop(journal_dir):
    server = JournalWebSocketServer(port=0, host="127.0.0.1", journal_dir=journal_dir)
    await server.start()
    assert server.is_running
    assert server.port > 0
    await server.stop()
    assert not server.is_running


@pytest.mark.skipif(not HAS_WEBSOCKETS, reason="websockets not installed")
@pytest.mark.asyncio
async def test_client_connects_and_receives_events(journal_dir):
    # Write initial events
    log = journal_dir / "Journal.2024-01-15T120000_01.log"
    log.write_text(
        '{"event":"FileHeader","timestamp":"2024-01-15T12:00:00Z","part":1}\n'
        '{"event":"LoadGame","timestamp":"2024-01-15T12:00:01Z","Commander":"Test"}\n'
    )

    server = JournalWebSocketServer(port=0, host="127.0.0.1", journal_dir=journal_dir)
    await server.start()

    # Connect a client
    uri = f"ws://127.0.0.1:{server.port}"
    async with websockets.connect(uri) as ws:
        # Give the server time to poll and send events
        await asyncio.sleep(1.5)

        # Append a new event
        with open(log, "a") as f:
            f.write('{"event":"FSDJump","timestamp":"2024-01-15T12:00:02Z","StarSystem":"Sol"}\n')

        await asyncio.sleep(1.5)

        messages = []
        try:
            while True:
                msg = await asyncio.wait_for(ws.recv(), timeout=0.5)
                messages.append(json.loads(msg))
        except (asyncio.TimeoutError, websockets.ConnectionClosed):
            pass

        # Should have received some events
        assert len(messages) > 0
        # The last event should be FSDJump
        assert any(m.get("event") == "FSDJump" for m in messages)

    await server.stop()


@pytest.mark.skipif(not HAS_WEBSOCKETS, reason="websockets not installed")
@pytest.mark.asyncio
async def test_event_filter(journal_dir):
    log = journal_dir / "Journal.2024-01-15T120000_01.log"
    log.write_text(
        '{"event":"FileHeader","timestamp":"2024-01-15T12:00:00Z","part":1}\n'
        '{"event":"FSDJump","timestamp":"2024-01-15T12:00:01Z","StarSystem":"Sol"}\n'
    )

    server = JournalWebSocketServer(
        port=0, host="127.0.0.1", journal_dir=journal_dir, filter=["FSDJump"]
    )
    await server.start()

    uri = f"ws://127.0.0.1:{server.port}"
    async with websockets.connect(uri) as ws:
        await asyncio.sleep(1.5)

        # Write more events
        with open(log, "a") as f:
            f.write('{"event":"Docked","timestamp":"2024-01-15T12:00:02Z","StationName":"Test"}\n')
            f.write('{"event":"FSDJump","timestamp":"2024-01-15T12:00:03Z","StarSystem":"Proxima"}\n')

        await asyncio.sleep(1.5)

        messages = []
        try:
            while True:
                msg = await asyncio.wait_for(ws.recv(), timeout=0.5)
                messages.append(json.loads(msg))
        except (asyncio.TimeoutError, websockets.ConnectionClosed):
            pass

        # All received events should be FSDJump
        for m in messages:
            assert m.get("event") == "FSDJump", f"Got unexpected event: {m}"

    await server.stop()


@pytest.mark.skipif(not HAS_WEBSOCKETS, reason="websockets not installed")
@pytest.mark.asyncio
async def test_client_count(journal_dir):
    server = JournalWebSocketServer(port=0, host="127.0.0.1", journal_dir=journal_dir)
    await server.start()
    assert server.client_count == 0

    uri = f"ws://127.0.0.1:{server.port}"
    async with websockets.connect(uri) as ws:
        await asyncio.sleep(1)
        assert server.client_count >= 1

    await server.stop()
