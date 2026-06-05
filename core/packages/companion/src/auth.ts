/**
 * Frontier Developments oAuth2 PKCE authentication for CAPI.
 *
 * Flow:
 * 1. Generate code_verifier + code_challenge (S256)
 * 2. Open auth URL for user to authorize
 * 3. Receive auth code via redirect URI
 * 4. Exchange code for access_token + refresh_token
 * 5. Use access_token for CAPI requests
 * 6. Refresh token when it expires
 *
 * API docs: https://user.frontierstore.net/developer/docs
 * Community notes: https://github.com/EDCD/FDevIDs/blob/master/Frontier%20API/FrontierDevelopments-oAuth2-notes.md
 */

const AUTH_BASE = "https://auth.frontierstore.net";
const TOKEN_URL = `${AUTH_BASE}/token`;
const AUTH_URL = `${AUTH_BASE}/auth`;
const _DECODE_URL = `${AUTH_BASE}/decode`;
const _ME_URL = `${AUTH_BASE}/me`;

/**
 * Required User-Agent format per Frontier: EDCD-<AppName>-<version>
 */
function makeUserAgent(appName: string, version: string): string {
  return `EDCD-${appName}-${version}`;
}

function base64URLEncode(buffer: ArrayBuffer): string {
  return btoa(String.fromCharCode(...new Uint8Array(buffer)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

async function sha256(plain: string): Promise<ArrayBuffer> {
  const encoder = new TextEncoder();
  return crypto.subtle.digest("SHA-256", encoder.encode(plain));
}

export function generateCodeVerifier(): string {
  const buffer = new Uint8Array(64);
  crypto.getRandomValues(buffer);
  return base64URLEncode(buffer.buffer);
}

export async function generateCodeChallenge(verifier: string): Promise<string> {
  const hash = await sha256(verifier);
  return base64URLEncode(hash);
}

export interface FrontierTokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
}

export interface FrontierAuthConfig {
  clientId: string;
  redirectUri: string;
  appName: string;
  appVersion: string;
  scope?: string;
  audience?: string;
}

export interface StoredTokens {
  accessToken: string;
  refreshToken: string;
  expiresAt: number; // epoch ms
}

export class FrontierAuth {
  private config: FrontierAuthConfig;
  private tokens: StoredTokens | null = null;

  constructor(config: FrontierAuthConfig) {
    this.config = config;
  }

  get userAgent(): string {
    return makeUserAgent(this.config.appName, this.config.appVersion);
  }

  buildAuthUrl(codeChallenge: string, state: string): string {
    const scope = encodeURIComponent(this.config.scope ?? "auth capi");
    const audience = this.config.audience ?? "frontier";
    const redirectUri = encodeURIComponent(this.config.redirectUri);
    return (
      `${AUTH_URL}?audience=${audience}&scope=${scope}` +
      `&response_type=code&client_id=${this.config.clientId}` +
      `&code_challenge=${codeChallenge}&code_challenge_method=S256` +
      `&state=${state}&redirect_uri=${redirectUri}`
    );
  }

  async exchangeCode(
    code: string,
    codeVerifier: string,
    state: string,
    expectedState: string,
  ): Promise<StoredTokens> {
    if (state !== expectedState) {
      throw new Error("State mismatch - possible CSRF attack");
    }

    const body = new URLSearchParams({
      redirect_uri: this.config.redirectUri,
      code,
      grant_type: "authorization_code",
      code_verifier: codeVerifier,
      client_id: this.config.clientId,
    });

    const resp = await fetch(TOKEN_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "User-Agent": this.userAgent,
      },
      body: body.toString(),
    });

    if (!resp.ok) {
      const text = await resp.text();
      throw new Error(`Token exchange failed: ${resp.status} ${text}`);
    }

    const data = (await resp.json()) as FrontierTokenResponse;
    this.tokens = {
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      expiresAt: Date.now() + data.expires_in * 1000,
    };
    return this.tokens;
  }

  async refreshTokens(): Promise<StoredTokens> {
    if (!this.tokens) {
      throw new Error("No tokens to refresh");
    }

    const body = new URLSearchParams({
      grant_type: "refresh_token",
      client_id: this.config.clientId,
      refresh_token: this.tokens.refreshToken,
    });

    const resp = await fetch(TOKEN_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "User-Agent": this.userAgent,
      },
      body: body.toString(),
    });

    if (!resp.ok) {
      this.tokens = null;
      const text = await resp.text();
      throw new Error(`Token refresh failed: ${resp.status} ${text}`);
    }

    const data = (await resp.json()) as FrontierTokenResponse;
    this.tokens = {
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      expiresAt: Date.now() + data.expires_in * 1000,
    };
    return this.tokens;
  }

  async getValidToken(): Promise<string> {
    if (!this.tokens) {
      throw new Error("Not authenticated. Call exchangeCode() first.");
    }

    // Refresh if expired or within 5 minutes of expiry
    if (Date.now() > this.tokens.expiresAt - 300_000) {
      await this.refreshTokens();
    }

    return this.tokens.accessToken;
  }

  setTokens(tokens: StoredTokens): void {
    this.tokens = tokens;
  }

  getStoredTokens(): StoredTokens | null {
    return this.tokens;
  }

  isAuthenticated(): boolean {
    return this.tokens !== null;
  }

  clearTokens(): void {
    this.tokens = null;
  }
}
