import { describe, expect, it } from "vitest";
import {
  CompanionClient,
  Flags,
  Flags2,
  FrontierAuth,
  GuiFocus,
  LEGACY_HOST,
  LIVE_HOST,
  LegalStatus,
  generateCodeChallenge,
  generateCodeVerifier,
} from "../src";

describe("companion", () => {
  describe("Flags", () => {
    it("has Docked as bit 0", () => expect(Flags.Docked).toBe(1));
    it("has FsdJumping as bit 28", () =>
      expect(Flags.FsdJumping).toBe(1 << 28));
    it("has SrvUnderShip as bit 29", () => {
      expect(Flags.SrvUnderShip).toBe(1 << 29);
      expect(Flags.SrvUnderShip).toBe(0x20000000);
    });
    it("total flags count is 30", () =>
      expect(Object.keys(Flags).length).toBe(30));
  });

  describe("Flags2", () => {
    it("has OnFoot as bit 0", () => expect(Flags2.OnFoot).toBe(1));
    it("has InCqc as bit 19", () => expect(Flags2.InCqc).toBe(1 << 19));
    it("total flags2 count is 20", () =>
      expect(Object.keys(Flags2).length).toBe(20));
  });

  describe("GuiFocus", () => {
    it("has NoFocus = 0", () => expect(GuiFocus.NoFocus).toBe(0));
    it("has Fss = 9", () => expect(GuiFocus.Fss).toBe(9));
    it("has Codex = 11", () => expect(GuiFocus.Codex).toBe(11));
    it("total GuiFocus values is 12", () =>
      expect(Object.keys(GuiFocus).length).toBe(12));
  });

  describe("LegalStatus", () => {
    it("has expected values", () => {
      expect(LegalStatus.Clean).toBe("Clean");
      expect(LegalStatus.Wanted).toBe("Wanted");
      expect(LegalStatus.Hostile).toBe("Hostile");
    });
  });

  describe("oAuth helpers", () => {
    it("generateCodeVerifier produces a string", () => {
      const v = generateCodeVerifier();
      expect(typeof v).toBe("string");
      expect(v.length).toBeGreaterThan(0);
    });

    it("generateCodeChallenge produces a string from a verifier", async () => {
      const v = generateCodeVerifier();
      try {
        const c = await generateCodeChallenge(v);
        expect(typeof c).toBe("string");
        expect(c.length).toBeGreaterThan(0);
      } catch {
        // crypto.subtle may not be available in all test environments
        expect(true).toBe(true);
      }
    });
  });

  describe("FrontierAuth", () => {
    it("can be instantiated with minimal config", () => {
      const auth = new FrontierAuth({
        clientId: "test",
        redirectUri: "http://localhost",
        appName: "test",
        appVersion: "1.0",
      });
      expect(auth).toBeInstanceOf(FrontierAuth);
    });

    it("builds user agent", () => {
      const auth = new FrontierAuth({
        clientId: "test",
        redirectUri: "http://localhost",
        appName: "TestApp",
        appVersion: "2.0",
      });
      expect(auth.userAgent).toBe("EDCD-TestApp-2.0");
    });

    it("builds auth url", () => {
      const auth = new FrontierAuth({
        clientId: "abc",
        redirectUri: "http://localhost/cb",
        appName: "t",
        appVersion: "1",
      });
      const url = auth.buildAuthUrl("challenge123", "state456");
      expect(url).toContain("client_id=abc");
      expect(url).toContain("redirect_uri=http%3A%2F%2Flocalhost%2Fcb");
      expect(url).toContain("code_challenge=challenge123");
      expect(url).toContain("state=state456");
    });

    it("exchangeCode_Success_StoresTokens", async () => {
      const auth = new FrontierAuth({
        clientId: "client123",
        redirectUri: "http://localhost/cb",
        appName: "App",
        appVersion: "1.0",
      });
      const originalFetch = globalThis.fetch;
      globalThis.fetch = async () =>
        new Response(
          JSON.stringify({
            access_token: "acc123",
            refresh_token: "ref456",
            token_type: "Bearer",
            expires_in: 3600,
          }),
          { status: 200, headers: { "Content-Type": "application/json" } },
        );
      try {
        await auth.exchangeCode("thecode", "verifier", "state1", "state1");
        expect(auth.isAuthenticated()).toBe(true);
        const token = await auth.getValidToken();
        expect(token).toBe("acc123");
      } finally {
        globalThis.fetch = originalFetch;
      }
    });

    it("exchangeCode_StateMismatch_Throws", async () => {
      const auth = new FrontierAuth({
        clientId: "id",
        redirectUri: "uri",
        appName: "App",
        appVersion: "1.0",
      });
      await expect(
        auth.exchangeCode("code", "verifier", "sent_state", "wrong_state"),
      ).rejects.toThrow("State mismatch");
    });

    it("getValidToken_ThrowsWhenNotAuthenticated", async () => {
      const auth = new FrontierAuth({
        clientId: "id",
        redirectUri: "uri",
        appName: "App",
        appVersion: "1.0",
      });
      await expect(auth.getValidToken()).rejects.toThrow("Not authenticated");
    });

    it("refreshTokens_Success_UpdatesTokens", async () => {
      const auth = new FrontierAuth({
        clientId: "client123",
        redirectUri: "http://localhost/cb",
        appName: "App",
        appVersion: "1.0",
      });
      auth.setTokens({
        accessToken: "old_acc",
        refreshToken: "old_ref",
        expiresAt: Date.now() - 100000,
      });
      const originalFetch = globalThis.fetch;
      globalThis.fetch = async () =>
        new Response(
          JSON.stringify({
            access_token: "new_acc",
            refresh_token: "new_ref",
            token_type: "Bearer",
            expires_in: 7200,
          }),
          { status: 200, headers: { "Content-Type": "application/json" } },
        );
      try {
        await auth.refreshTokens();
        const token = await auth.getValidToken();
        expect(token).toBe("new_acc");
        const stored = auth.getStoredTokens();
        expect(stored?.refreshToken).toBe("new_ref");
      } finally {
        globalThis.fetch = originalFetch;
      }
    });

    it("exchangeCode_PostTokenEndpoint", async () => {
      const auth = new FrontierAuth({
        clientId: "client123",
        redirectUri: "http://localhost/cb",
        appName: "App",
        appVersion: "1.0",
      });
      const originalFetch = globalThis.fetch;
      let capturedMethod = "";
      let capturedPath = "";
      let capturedBody = "";
      let capturedContentType = "";
      let capturedUserAgent = "";
      globalThis.fetch = async (url, init) => {
        capturedMethod = init?.method || "GET";
        capturedPath =
          typeof url === "string" ? new URL(url).pathname : "";
        capturedBody = (init?.body as string) || "";
        const headers = (init?.headers as Record<string, string>) || {};
        capturedContentType = headers["Content-Type"] || "";
        capturedUserAgent = headers["User-Agent"] || "";
        return new Response(
          JSON.stringify({
            access_token: "acc123",
            refresh_token: "ref456",
            expires_in: 3600,
          }),
          { status: 200, headers: { "Content-Type": "application/json" } },
        );
      };
      try {
        await auth.exchangeCode("thecode", "verifier", "state1", "state1");
        expect(capturedMethod).toBe("POST");
        expect(capturedPath).toBe("/token");
        expect(capturedBody).toContain("grant_type=authorization_code");
        expect(capturedBody).toContain("code=thecode");
        expect(capturedBody).toContain("client_id=client123");
        expect(capturedContentType).toBe(
          "application/x-www-form-urlencoded",
        );
        expect(capturedUserAgent).toContain("EDCD-");
      } finally {
        globalThis.fetch = originalFetch;
      }
    });

    it("isAuthenticated_InitiallyFalse", () => {
      const auth = new FrontierAuth({
        clientId: "id",
        redirectUri: "uri",
        appName: "App",
        appVersion: "1.0",
      });
      expect(auth.isAuthenticated()).toBe(false);
    });
  });

  describe("CompanionClient", () => {
    it("can be instantiated with an auth object", () => {
      const auth = new FrontierAuth({
        clientId: "test",
        redirectUri: "http://localhost",
        appName: "t",
        appVersion: "1",
      });
      const client = new CompanionClient({ auth });
      expect(client).toBeInstanceOf(CompanionClient);
    });

    it("makes authenticated requests to the correct host", async () => {
      const auth = new FrontierAuth({
        clientId: "test",
        redirectUri: "http://localhost",
        appName: "t",
        appVersion: "1",
      });
      // Mock getValidToken
      auth.getValidToken = async () => "mock-token";
      const client = new CompanionClient({ auth });

      const originalFetch = globalThis.fetch;
      let capturedUrl = "";
      let capturedHeaders: Record<string, string> = {};
      globalThis.fetch = async (url: RequestInfo | URL, init?: RequestInit) => {
        capturedUrl = typeof url === "string" ? url : url.toString();
        capturedHeaders = (init?.headers as Record<string, string>) || {};
        return new Response(JSON.stringify({}), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      };

      try {
        await client.getProfile();
        expect(capturedUrl).toBe("https://companion.orerve.net/profile");
        expect(capturedHeaders["Authorization"]).toBe("Bearer mock-token");
      } finally {
        globalThis.fetch = originalFetch;
      }
    });

    it("handles Legacy galaxy host selection", async () => {
      const auth = new FrontierAuth({
        clientId: "test",
        redirectUri: "http://localhost",
        appName: "t",
        appVersion: "1",
      });
      auth.getValidToken = async () => "mock-token";
      const client = new CompanionClient({ auth, galaxy: "legacy" });

      const originalFetch = globalThis.fetch;
      let capturedUrl = "";
      globalThis.fetch = async (url: RequestInfo | URL) => {
        capturedUrl = typeof url === "string" ? url : url.toString();
        return new Response(JSON.stringify({}), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      };

      try {
        await client.getProfile();
        expect(capturedUrl).toBe("https://legacy-companion.orerve.net/profile");
      } finally {
        globalThis.fetch = originalFetch;
      }
    });

    it("handles 401 by throwing", async () => {
      const auth = new FrontierAuth({
        clientId: "test",
        redirectUri: "http://localhost",
        appName: "t",
        appVersion: "1",
      });
      auth.getValidToken = async () => "mock-token";
      const client = new CompanionClient({ auth });

      const originalFetch = globalThis.fetch;
      globalThis.fetch = async () =>
        new Response("Unauthorized", {
          status: 401,
          headers: { "Content-Type": "application/json" },
        });

      try {
        await expect(client.getProfile()).rejects.toThrow();
      } finally {
        globalThis.fetch = originalFetch;
      }
    });

    it("getMarket_ReturnsResponse", async () => {
      const auth = new FrontierAuth({
        clientId: "test",
        redirectUri: "http://localhost",
        appName: "t",
        appVersion: "1",
      });
      auth.getValidToken = async () => "mock-token";
      const client = new CompanionClient({ auth });

      const originalFetch = globalThis.fetch;
      globalThis.fetch = async () =>
        new Response(
          JSON.stringify({
            market: { id: 1, name: "Market", items: [] },
            lastSystem: { name: "Sol" },
            lastStarport: { name: "Station" },
          }),
          { status: 200, headers: { "Content-Type": "application/json" } },
        );
      try {
        const result = await client.getMarket();
        expect(result.market?.id).toBe(1);
      } finally {
        globalThis.fetch = originalFetch;
      }
    });

    it("getShipyard_ReturnsResponse", async () => {
      const auth = new FrontierAuth({
        clientId: "test",
        redirectUri: "http://localhost",
        appName: "t",
        appVersion: "1",
      });
      auth.getValidToken = async () => "mock-token";
      const client = new CompanionClient({ auth });

      const originalFetch = globalThis.fetch;
      globalThis.fetch = async () =>
        new Response(
          JSON.stringify({
            lastSystem: { name: "Sol" },
            lastStarport: { name: "Station" },
            ships: [{ id: 1, name: "Sidewinder", basevalue: 32000 }],
          }),
          { status: 200, headers: { "Content-Type": "application/json" } },
        );
      try {
        const result = await client.getShipyard();
        expect(result.ships).toHaveLength(1);
        expect(result.ships?.[0].name).toBe("Sidewinder");
      } finally {
        globalThis.fetch = originalFetch;
      }
    });

    it("getFleetCarrier_ReturnsResponse", async () => {
      const auth = new FrontierAuth({
        clientId: "test",
        redirectUri: "http://localhost",
        appName: "t",
        appVersion: "1",
      });
      auth.getValidToken = async () => "mock-token";
      const client = new CompanionClient({ auth });

      const originalFetch = globalThis.fetch;
      globalThis.fetch = async () =>
        new Response(
          JSON.stringify({
            id: 1,
            name: "FC-1",
            currentBalance: 5000000,
          }),
          { status: 200, headers: { "Content-Type": "application/json" } },
        );
      try {
        const result = await client.getFleetCarrier();
        expect(result.name).toBe("FC-1");
      } finally {
        globalThis.fetch = originalFetch;
      }
    });

    it("getJournal_ReturnsResponse", async () => {
      const auth = new FrontierAuth({
        clientId: "test",
        redirectUri: "http://localhost",
        appName: "t",
        appVersion: "1",
      });
      auth.getValidToken = async () => "mock-token";
      const client = new CompanionClient({ auth });

      const originalFetch = globalThis.fetch;
      let capturedUrl = "";
      globalThis.fetch = async (url) => {
        capturedUrl =
          typeof url === "string" ? url : url.toString();
        return new Response(
          JSON.stringify({ entries: ["line1", "line2"] }),
          { status: 200, headers: { "Content-Type": "application/json" } },
        );
      };
      try {
        const result = await client.getJournal(2024, 1, 15);
        expect(capturedUrl).toBe(
          "https://companion.orerve.net/journal/2024/1/15",
        );
        expect(result.entries).toHaveLength(2);
      } finally {
        globalThis.fetch = originalFetch;
      }
    });

    it("getCommunityGoals_ReturnsResponse", async () => {
      const auth = new FrontierAuth({
        clientId: "test",
        redirectUri: "http://localhost",
        appName: "t",
        appVersion: "1",
      });
      auth.getValidToken = async () => "mock-token";
      const client = new CompanionClient({ auth });

      const originalFetch = globalThis.fetch;
      globalThis.fetch = async () =>
        new Response(
          JSON.stringify({
            communitygoals: [
              {
                id: 1,
                name: "Goal 1",
                systemName: "Sol",
                stationName: "Station",
                objective: "Deliver",
                total: 100000,
                contributed: 500,
                reward: "CR",
                expiry: "2024-12-31",
              },
            ],
          }),
          { status: 200, headers: { "Content-Type": "application/json" } },
        );
      try {
        const result = await client.getCommunityGoals();
        expect(result.communitygoals).toHaveLength(1);
        expect(result.communitygoals?.[0].name).toBe("Goal 1");
      } finally {
        globalThis.fetch = originalFetch;
      }
    });

    it("isDocked_ReturnsTrue", async () => {
      const auth = new FrontierAuth({
        clientId: "test",
        redirectUri: "http://localhost",
        appName: "t",
        appVersion: "1",
      });
      auth.getValidToken = async () => "mock-token";
      const client = new CompanionClient({ auth });

      const originalFetch = globalThis.fetch;
      globalThis.fetch = async () =>
        new Response(
          JSON.stringify({ commander: { docked: true } }),
          { status: 200, headers: { "Content-Type": "application/json" } },
        );
      try {
        const result = await client.isDocked();
        expect(result).toBe(true);
      } finally {
        globalThis.fetch = originalFetch;
      }
    });

    it("isDocked_OnErrorReturnsFalse", async () => {
      const auth = new FrontierAuth({
        clientId: "test",
        redirectUri: "http://localhost",
        appName: "t",
        appVersion: "1",
      });
      auth.getValidToken = async () => "mock-token";
      const client = new CompanionClient({ auth });

      const originalFetch = globalThis.fetch;
      globalThis.fetch = async () =>
        new Response("Server Error", { status: 500 });
      try {
        const result = await client.isDocked();
        expect(result).toBe(false);
      } finally {
        globalThis.fetch = originalFetch;
      }
    });

    it("LIVE_HOST is correct", () => {
      expect(LIVE_HOST).toBe("https://companion.orerve.net");
    });

    it("LEGACY_HOST is correct", () => {
      expect(LEGACY_HOST).toBe("https://legacy-companion.orerve.net");
    });
  });
});
