import { createServer, type Server } from "node:http";
import type { JournalEvent } from "@elite-dangerous-sdk/journal";
import {
  getJournalDirectory,
  JournalWatcher,
} from "@elite-dangerous-sdk/journal";
import { WebSocket, WebSocketServer } from "ws";

export interface JournalWebSocketOptions {
  port?: number;
  host?: string;
  journalDir?: string;
  filter?: string[];
}

export class JournalWebSocketServer {
  private options: Required<JournalWebSocketOptions>;
  private wss: WebSocketServer | null = null;
  private httpServer: Server | null = null;
  private watcher: JournalWatcher | null = null;
  private clients: Set<WebSocket> = new Set();
  private running = false;
  private _actualPort = 0;

  constructor(options: JournalWebSocketOptions = {}) {
    this.options = {
      port: options.port ?? 8080,
      host: options.host ?? "127.0.0.1",
      journalDir: options.journalDir ?? getJournalDirectory(),
      filter: options.filter ?? [],
    };
  }

  get port(): number {
    return this._actualPort || this.options.port;
  }

  get clientCount(): number {
    return this.clients.size;
  }

  get isRunning(): boolean {
    return this.running;
  }

  async start(): Promise<void> {
    if (this.running) return;

    this.httpServer = createServer();
    this.wss = new WebSocketServer({ server: this.httpServer });

    this.wss.on("connection", (ws) => {
      this.clients.add(ws);
      ws.on("close", () => this.clients.delete(ws));
      ws.on("error", () => this.clients.delete(ws));
    });

    return new Promise((resolve) => {
      this.httpServer!.listen(this.options.port, this.options.host, () => {
        const addr = this.httpServer!.address();
        if (addr && typeof addr === "object") {
          this._actualPort = addr.port;
        }
        this.running = true;
        this.startWatching();
        resolve();
      });
    });
  }

  private startWatching(): void {
    const watcher = new JournalWatcher(this.options.journalDir);
    this.watcher = watcher;
    this.watchLoop(watcher);
  }

  private async watchLoop(watcher: JournalWatcher): Promise<void> {
    try {
      for await (const event of watcher.watchEvents()) {
        if (!this.running) break;
        if (this.shouldSend(event)) {
          this.broadcast(event);
        }
      }
    } catch {
      // watcher stopped
    }
  }

  private shouldSend(event: JournalEvent): boolean {
    if (this.options.filter.length === 0) return true;
    return this.options.filter.includes(event.event);
  }

  broadcast(data: object): void {
    const message = JSON.stringify(data);
    for (const ws of this.clients) {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(message);
      }
    }
  }

  stop(): void {
    this.running = false;
    this.watcher?.stop();
    this.watcher = null;
    this.wss?.close();
    this.httpServer?.close();
    this.clients.clear();
  }
}
