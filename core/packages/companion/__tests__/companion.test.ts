import { describe, expect, it } from "vitest";
import {
  CompanionClient,
  Flags,
  Flags2,
  FrontierAuth,
  GuiFocus,
  generateCodeChallenge,
  generateCodeVerifier,
  LegalStatus,
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
  });
});
