import { EventEmitter } from "node:events";
import { createReadStream, existsSync } from "node:fs";
import { resolve } from "node:path";
import { createInterface } from "node:readline";

import { listJournalFiles } from "./Journal.js";
import { parseLine } from "./parser.js";
import type { JournalEvent } from "./types.js";

export interface JournalReplayOptions {
  speed?: number;
  filter?: string[];
}

export type ReplayState = "idle" | "playing" | "paused" | "ended";

export class JournalReplay extends EventEmitter {
  private _events: JournalEvent[] = [];
  private _currentIndex = 0;
  private _speed: number;
  private _filter: string[] | null = null;
  private _state: ReplayState = "idle";
  private _timer: ReturnType<typeof setTimeout> | null = null;
  private _resolvePlay: (() => void) | null = null;

  constructor(options: JournalReplayOptions = {}) {
    super();
    this._speed = options.speed ?? 1;
    this._filter = options.filter ?? null;
  }

  get speed(): number {
    return this._speed;
  }

  set speed(n: number) {
    this._speed = Math.max(0.1, n);
  }

  get currentIndex(): number {
    return this._currentIndex;
  }

  get totalEvents(): number {
    return this._events.length;
  }

  get state(): ReplayState {
    return this._state;
  }

  filter(types: string[]): this {
    this._filter = types;
    return this;
  }

  async load(fileOrDir: string): Promise<void> {
    const resolved = resolve(fileOrDir);

    if (existsSync(resolved) && !resolved.toLowerCase().endsWith(".log")) {
      const files = listJournalFiles(resolved);
      this._events = [];
      for (const file of files) {
        await this._loadFile(file);
      }
    } else {
      await this._loadFile(resolved);
    }
  }

  loadEvents(events: JournalEvent[]): void {
    this._events = this._filter
      ? events.filter((e) => this._filter!.includes(e.event))
      : [...events];
  }

  private _loadFile(file: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const stream = createReadStream(file, { encoding: "utf-8" });
      const rl = createInterface({ input: stream, crlfDelay: Infinity });

      rl.on("line", (line: string) => {
        const trimmed = line.trim();
        if (!trimmed) return;
        try {
          const event = parseLine(trimmed);
          if (!this._filter || this._filter.includes(event.event)) {
            this._events.push(event);
          }
        } catch {
          // skip malformed lines
        }
      });

      rl.on("close", () => resolve());
      rl.on("error", (err) => reject(err));
    });
  }

  async play(): Promise<void> {
    if (this._events.length === 0) return;
    if (this._state === "paused") {
      this.resume();
      return;
    }

    this._state = "playing";
    this._currentIndex = 0;
    this.emit("start");

    return new Promise<void>((resolve) => {
      this._resolvePlay = resolve;
      this._playNext();
    });
  }

  private _playNext(): void {
    if (this._state !== "playing") return;

    if (this._currentIndex >= this._events.length) {
      this._finalize();
      return;
    }

    const event = this._events[this._currentIndex];
    this.emit("event", event);
    this._currentIndex++;

    if (this._currentIndex >= this._events.length) {
      this._finalize();
      return;
    }

    const delay = this._getDelay();
    this._timer = setTimeout(() => this._playNext(), delay);
  }

  private _finalize(): void {
    this._state = "ended";
    this.emit("end");
    this._resolvePlay?.();
    this._resolvePlay = null;
  }

  private _getDelay(): number {
    const from = this._events[this._currentIndex - 1];
    const to = this._events[this._currentIndex];
    const fromTime = new Date(from.timestamp).getTime();
    const toTime = new Date(to.timestamp).getTime();

    if (isNaN(fromTime) || isNaN(toTime) || toTime <= fromTime) {
      return 100;
    }

    const delta = toTime - fromTime;
    return Math.max(10, Math.min(10000, delta / this._speed));
  }

  pause(): void {
    if (this._state !== "playing") return;
    this._state = "paused";
    if (this._timer) {
      clearTimeout(this._timer);
      this._timer = null;
    }
    this.emit("pause");
  }

  resume(): void {
    if (this._state !== "paused") return;
    this._state = "playing";
    this.emit("resume");
    this._playNext();
  }

  stop(): void {
    if (this._timer) {
      clearTimeout(this._timer);
      this._timer = null;
    }
    if (this._state === "playing" || this._state === "paused") {
      this._state = "idle";
      this._currentIndex = 0;
      this._resolvePlay?.();
      this._resolvePlay = null;
      this.emit("stop");
    }
  }

  seek(index: number): void {
    if (this._events.length === 0) return;
    if (index < 0) index = 0;
    if (index >= this._events.length) index = this._events.length - 1;
    this._currentIndex = index;
    if (this._timer) {
      clearTimeout(this._timer);
      this._timer = null;
      if (this._state === "playing") {
        this._playNext();
      }
    }
    this.emit("seek", index);
  }
}
