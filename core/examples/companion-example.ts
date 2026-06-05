/**
 * Example: Frontier Companion API (CAPI)
 *
 * Prerequisites:
 * 1. Register an application at https://user.frontierstore.net/developer
 * 2. Get your Client ID and set up a redirect URI
 *
 * Flow:
 * 1. Generate PKCE challenge
 * 2. Open auth URL in browser for user to approve
 * 3. Exchange the auth code for tokens
 * 4. Make API requests
 *
 * Tokens are persisted to a JSON file so re-authorization is only needed
 * when the refresh token expires or is revoked.
 */

import {
  CompanionClient,
  FrontierAuth,
  generateCodeChallenge,
  generateCodeVerifier,
} from "@elite-dangerous-sdk/companion";
import * as fs from "node:fs";
import * as path from "node:path";

// === Token persistence ===
const TOKEN_FILE = path.join(
  process.env.XDG_CONFIG_HOME || path.join(process.env.HOME || process.env.USERPROFILE || ".", ".config"),
  "elite-dangerous-sdk",
  "companion-tokens.json",
);

function _saveTokens(tokens: { accessToken: string; refreshToken: string; expiresAt: number }) {
  const dir = path.dirname(TOKEN_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(TOKEN_FILE, JSON.stringify(tokens, null, 2), "utf-8");
  console.log(`Tokens saved to ${TOKEN_FILE}`);
}

function _loadTokens(): { accessToken: string; refreshToken: string; expiresAt: number } | null {
  try {
    const raw = fs.readFileSync(TOKEN_FILE, "utf-8");
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

// === Step 1: Configure auth ===
const CLIENT_ID = "your-client-id-here";
const REDIRECT_URI = "http://localhost:8080/callback";
const APP_NAME = "MyEliteTool";
const APP_VERSION = "1.0.0";

const auth = new FrontierAuth({
  clientId: CLIENT_ID,
  redirectUri: REDIRECT_URI,
  appName: APP_NAME,
  appVersion: APP_VERSION,
});

// Try to restore a previous session
const saved = _loadTokens();
if (saved) {
  auth.setTokens(saved);
  console.log("Restored saved session.");
}

// === Step 2: Generate PKCE and get auth URL ===
async function _startAuthFlow() {
  const codeVerifier = generateCodeVerifier();
  const codeChallenge = await generateCodeChallenge(codeVerifier);
  const state = crypto.randomUUID();

  const authUrl = auth.buildAuthUrl(codeChallenge, state);
  console.log("Visit this URL to authorize:");
  console.log(authUrl);

  // In a real app, you'd open the browser and wait for the redirect
  // The redirect will include ?code=AUTH_CODE&state=STATE
  return { codeVerifier, state };
}

// === Step 3: Exchange code for tokens ===
async function _handleCallback(
  authCode: string,
  codeVerifier: string,
  state: string,
  expectedState: string,
) {
  const tokens = await auth.exchangeCode(
    authCode,
    codeVerifier,
    state,
    expectedState,
  );
  console.log(
    `Access token expires at: ${new Date(tokens.expiresAt).toISOString()}`,
  );

  _saveTokens({ accessToken: tokens.accessToken, refreshToken: tokens.refreshToken, expiresAt: tokens.expiresAt });
}

// === Step 4: Use the API ===
async function _useApi() {
  const client = new CompanionClient({ auth });

  // Check if commander is docked before market reads
  const docked = await client.isDocked();
  console.log(`Docked: ${docked}`);

  if (docked) {
    // Get profile
    const profile = await client.getProfile();
    console.log(`Commander: ${profile.commander?.name}`);
    console.log(`Credits: ${profile.commander?.credits}`);

    // Get market data
    const market = await client.getMarket();
    console.log(`Station: ${market.lastStarport?.name}`);
    console.log(`Market items: ${market.market?.items?.length ?? 0}`);

    // Get shipyard
    const shipyard = await client.getShipyard();
    console.log(`Ships available: ${shipyard.ships?.length ?? 0}`);
    console.log(`Modules available: ${shipyard.modules?.length ?? 0}`);
  }

  // Get fleet carrier info
  const fc = await client.getFleetCarrier();
  if (fc.name) {
    console.log(`Fleet Carrier: ${fc.name}`);
    console.log(`Balance: ${fc.currentBalance}`);
    console.log(`Fuel: ${fc.fuelLevel}`);
  }

  // Get community goals
  const cgs = await client.getCommunityGoals();
  console.log(`Active goals: ${cgs.communitygoals?.length ?? 0}`);
}

// === Step 5: Handle token refresh (automatic) ===
async function _demonstrateRefresh() {
  // The SDK automatically refreshes when tokens are close to expiry
  // You can also manually check:
  console.log(`Authenticated: ${auth.isAuthenticated()}`);

  const stored = auth.getStoredTokens();
  if (stored) {
    console.log(
      `Current access token: ${stored.accessToken.substring(0, 20)}...`,
    );
    console.log(`Expires at: ${new Date(stored.expiresAt).toISOString()}`);
  }

  // Tokens are reloaded from file on next startup (see top of file)
}

// To clear auth and delete saved tokens:
// auth.clearTokens();
// fs.unlinkSync(TOKEN_FILE);
