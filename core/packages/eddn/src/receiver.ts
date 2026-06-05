/**
 * EDDN message receiver using ZeroMQ
 */
import { type EDDNMessage, RELAY_URL } from "./client.js";

export interface EDDNReceiverConfig {
  relayUrl?: string;
}

export class EDDNReceiver {
  private relayUrl: string;
  private running = false;

  constructor(config: EDDNReceiverConfig = {}) {
    this.relayUrl = config.relayUrl ?? RELAY_URL;
  }

  get isRunning(): boolean {
    return this.running;
  }

  async *receive(): AsyncIterableIterator<EDDNMessage> {
    let zmq: typeof import("zeromq");
    try {
      zmq = await import("zeromq");
    } catch {
      throw new Error(
        "zeromq is required for EDDN receiving. Install with: npm install zeromq",
      );
    }

    const sock = new zmq.Subscriber();
    this.running = true;

    try {
      sock.connect(this.relayUrl);
      sock.subscribe(""); // receive all messages

      for await (const [raw] of sock) {
        if (!this.running) break;

        try {
          // Decompress zlib
          const compressed = Buffer.from(raw as Buffer);
          const zlib = await import("node:zlib");
          const decompressed = zlib.inflateSync(compressed);
          const message = JSON.parse(
            decompressed.toString("utf-8"),
          ) as EDDNMessage;
          yield message;
        } catch {
          // skip malformed messages
        }
      }
    } finally {
      sock.close();
      this.running = false;
    }
  }

  stop(): void {
    this.running = false;
  }
}
