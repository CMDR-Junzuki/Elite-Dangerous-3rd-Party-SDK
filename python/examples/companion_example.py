"""
Example: Frontier Companion API (CAPI)

Prerequisites:
1. Register an application at https://user.frontierstore.net/developer
2. Get your Client ID and set up a redirect URI

Flow:
1. Generate PKCE challenge
2. Open auth URL in browser for user to approve
3. Exchange the auth code for tokens
4. Make API requests

Tokens are persisted to a JSON file so re-authorization is only needed
when the refresh token expires or is revoked.
"""

import json
import os
import secrets
from pathlib import Path

from elite_dangerous_sdk.companion import (
    CompanionClient,
    FrontierAuth,
    generate_code_challenge,
    generate_code_verifier,
)

# === Token persistence ===
CONFIG_DIR = Path(os.environ.get("XDG_CONFIG_HOME", Path.home() / ".config"))
TOKEN_FILE = CONFIG_DIR / "elite-dangerous-sdk" / "companion-tokens.json"


def _save_tokens(tokens):
    TOKEN_FILE.parent.mkdir(parents=True, exist_ok=True)
    with open(TOKEN_FILE, "w") as f:
        json.dump({
            "access_token": tokens.access_token,
            "refresh_token": tokens.refresh_token,
            "expires_at": tokens.expires_at,
        }, f, indent=2)
    print(f"Tokens saved to {TOKEN_FILE}")


def _load_tokens():
    try:
        with open(TOKEN_FILE) as f:
            return json.load(f)
    except (FileNotFoundError, json.JSONDecodeError):
        return None


# === Step 1: Configure auth ===
CLIENT_ID = "your-client-id-here"
REDIRECT_URI = "http://localhost:8080/callback"
APP_NAME = "MyEliteTool"
APP_VERSION = "1.0.0"

auth = FrontierAuth(
    client_id=CLIENT_ID,
    redirect_uri=REDIRECT_URI,
    app_name=APP_NAME,
    app_version=APP_VERSION,
)

# Try to restore a previous session
saved = _load_tokens()
if saved:
    from elite_dangerous_sdk.companion import FrontierTokens
    auth.tokens = FrontierTokens(
        access_token=saved["access_token"],
        refresh_token=saved["refresh_token"],
        expires_at=saved["expires_at"],
    )
    print("Restored saved session.")


# === Step 2: Generate PKCE and get auth URL ===
def start_auth_flow():
    code_verifier = generate_code_verifier()
    code_challenge = generate_code_challenge(code_verifier)
    state = secrets.token_urlsafe(16)

    auth_url = auth.build_auth_url(code_challenge, state)
    print("Visit this URL to authorize:")
    print(auth_url)

    return code_verifier, state


# === Step 3: Exchange code for tokens ===
def handle_callback(auth_code, code_verifier, state, expected_state):
    tokens = auth.exchange_code(auth_code, code_verifier, state, expected_state)
    print(f"Access token expires at: {tokens.expires_at}")

    _save_tokens(tokens)


# === Step 4: Use the API ===
def use_api():
    client = CompanionClient(auth)

    # Check if commander is docked before market reads
    docked = client.is_docked()
    print(f"Docked: {docked}")

    if docked:
        profile = client.get_profile()
        print(f"Commander: {profile.get('commander', {}).get('name')}")
        print(f"Credits: {profile.get('commander', {}).get('credits')}")

        market = client.get_market()
        station = market.get("lastStarport", {})
        print(f"Station: {station.get('name')}")
        items = market.get("market", {}).get("items", [])
        print(f"Market items: {len(items)}")

        shipyard = client.get_shipyard()
        ships = shipyard.get("ships", []) or shipyard.get("shipyard", {}).get("ships", [])
        print(f"Ships available: {len(ships)}")

    fc = client.get_fleet_carrier()
    if fc.get("name"):
        print(f"Fleet Carrier: {fc['name']}")
        print(f"Balance: {fc.get('currentBalance')}")
        print(f"Fuel: {fc.get('fuelLevel')}")

    cgs = client.get_community_goals()
    goals = cgs.get("communitygoals", [])
    print(f"Active goals: {len(goals)}")


# === Step 5: Handle token refresh (automatic) ===
def demonstrate_refresh():
    print(f"Authenticated: {auth.tokens is not None}")
    if auth.tokens:
        print(f"Current access token: {auth.tokens.access_token[:20]}...")
        print(f"Expires at: {auth.tokens.expires_at}")


# To clear auth and delete saved tokens:
# auth.tokens = None
# TOKEN_FILE.unlink()
