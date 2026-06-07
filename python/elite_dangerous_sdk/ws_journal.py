"""
WebSocket server that streams Elite Dangerous journal events to connected clients.

Usage:
    from elite_dangerous_sdk.ws_journal import JournalWebSocketServer

    server = JournalWebSocketServer(port=8080)
    await server.start()
    # ... clients connect and receive events ...
    await server.stop()
"""

import asyncio
import json
import time
from pathlib import Path
from typing import Any

try:
    import websockets
    from websockets.asyncio.server import ServerConnection, serve
except ImportError:
    websockets = None  # type: ignore
    serve = None  # type: ignore

from .journal import JournalReader, list_journal_files


class JournalWebSocketServer:
    """WebSocket server that broadcasts journal events to all connected clients."""

    def __init__(
        self,
        port: int = 8080,
        host: str = "127.0.0.1",
        journal_dir: str | Path | None = None,
        filter: list[str] | None = None,
    ):
        if websockets is None:
            raise ImportError(
                "The 'websockets' library is required. Install with: pip install elite-dangerous-sdk[ws-journal]"
            )

        self._port = port
        self._host = host
        self._journal_dir = Path(journal_dir) if journal_dir else None
        self._filter = filter or []
        self._server = None
        self._clients: set[ServerConnection] = set()
        self._event_buffer: list[dict[str, Any]] = []
        self._running = False
        self._actual_port = 0
        self._watch_task: asyncio.Task | None = None

    @property
    def port(self) -> int:
        return self._actual_port or self._port

    @property
    def client_count(self) -> int:
        return len(self._clients)

    @property
    def is_running(self) -> bool:
        return self._running

    async def start(self) -> None:
        """Start the WebSocket server and begin watching journal files."""
        if self._running:
            return

        self._server = await serve(
            self._handle_connection,
            self._host,
            self._port,
        )
        self._actual_port = self._server.sockets[0].getsockname()[1]
        self._running = True
        self._watch_task = asyncio.create_task(self._watch_loop())

    async def stop(self) -> None:
        """Stop the server and disconnect all clients."""
        self._running = False
        if self._watch_task:
            self._watch_task.cancel()
            try:
                await self._watch_task
            except asyncio.CancelledError:
                pass
            self._watch_task = None
        if self._server:
            self._server.close()
            await self._server.wait_closed()
            self._server = None
        self._clients.clear()
        self._event_buffer.clear()

    async def _handle_connection(self, websocket: ServerConnection) -> None:
        self._clients.add(websocket)
        # Flush buffered events to the newly connected client
        for data in self._event_buffer:
            try:
                await websocket.send(json.dumps(data))
            except Exception:
                pass
        self._event_buffer.clear()
        try:
            async for _ in websocket:
                pass  # we only send, never receive
        except Exception:
            pass
        finally:
            self._clients.discard(websocket)

    def broadcast(self, data: dict[str, Any]) -> None:
        """Send a JSON event to all connected clients."""
        if not self._clients:
            if len(self._event_buffer) < 100:
                self._event_buffer.append(data)
            return
        message = json.dumps(data)
        closed: list[ServerConnection] = []
        for ws in self._clients:
            try:
                coro = ws.send(message)
                asyncio.ensure_future(self._safe_send(coro, ws))
            except Exception:
                closed.append(ws)
        for ws in closed:
            self._clients.discard(ws)

    async def _safe_send(self, coro: Any, ws: ServerConnection) -> None:
        try:
            await coro
        except Exception:
            self._clients.discard(ws)

    def _should_send(self, event: dict[str, Any]) -> bool:
        if not self._filter:
            return True
        return event.get("event") in self._filter

    async def _watch_loop(self) -> None:
        """Poll for new journal events and broadcast them."""
        try:
            reader = JournalReader(self._journal_dir)
            seen_bytes: dict[str, int] = {}
            initial_files = list_journal_files(self._journal_dir)
            for f in initial_files:
                try:
                    seen_bytes[str(f)] = f.stat().st_size
                except OSError:
                    pass

            while self._running:
                files = list_journal_files(self._journal_dir)
                for file in files:
                    fstr = str(file)
                    prev_size = seen_bytes.get(fstr, 0)
                    try:
                        current_size = file.stat().st_size
                    except OSError:
                        continue
                    if current_size > prev_size:
                        with open(file, "r", encoding="utf-8") as fh:
                            fh.seek(prev_size)
                            while True:
                                line = fh.readline()
                                if not line:
                                    break
                                line = line.strip()
                                if not line:
                                    continue
                                try:
                                    event = json.loads(line)
                                    seen_bytes[fstr] = fh.tell()
                                    if self._should_send(event):
                                        self.broadcast(event)
                                except json.JSONDecodeError:
                                    continue
                    elif current_size < prev_size:
                        seen_bytes[fstr] = current_size

                await asyncio.sleep(0.5)
        except asyncio.CancelledError:
            pass
