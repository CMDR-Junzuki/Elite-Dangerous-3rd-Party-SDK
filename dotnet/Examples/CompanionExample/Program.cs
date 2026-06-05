// Example: Frontier Companion API (CAPI)
//
// Prerequisites:
// 1. Register an application at https://user.frontierstore.net/developer
// 2. Get your Client ID and set up a redirect URI
//
// Flow:
// 1. Generate PKCE challenge
// 2. Open auth URL in browser for user to approve
// 3. Exchange the auth code for tokens
// 4. Make API requests

using System.Text.Json;
using EliteDangerousSdk.Companion;

const string ClientId = "your-client-id-here";
const string RedirectUri = "http://localhost:8080/callback";
const string AppName = "MyEliteTool";
const string AppVersion = "1.0.0";

var auth = new FrontierAuth(ClientId, RedirectUri, AppName, AppVersion);
var client = new CompanionClient(auth);

// === Step 1: Generate PKCE and get auth URL ===
var codeVerifier = FrontierAuth.GenerateCodeVerifier();
var codeChallenge = FrontierAuth.GenerateCodeChallenge(codeVerifier);
var state = Guid.NewGuid().ToString("N");

var authUrl = auth.BuildAuthUrl(codeChallenge, state);
Console.WriteLine("Visit this URL to authorize:");
Console.WriteLine(authUrl);

// In a real app, you'd open the browser and wait for the redirect
// The redirect will include ?code=AUTH_CODE&state=STATE

// === Step 2: Exchange code for tokens (call from callback handler) ===
// await auth.ExchangeCodeAsync(authCode, codeVerifier, state, expectedState);

// === Step 3: Use the API ===
async Task UseApiAsync()
{
    var docked = await client.IsDockedAsync();
    Console.WriteLine($"Docked: {docked}");

    if (docked)
    {
        var profile = await client.GetProfileAsync();
        Console.WriteLine($"Commander: {profile.Commander?.Name}");
        Console.WriteLine($"Credits: {profile.Commander?.Credits}");

        var market = await client.GetMarketAsync();
        Console.WriteLine($"Station: {market.LastStarport?.Name}");
        Console.WriteLine($"Market items: {market.Market?.Items?.Count ?? 0}");

        var shipyard = await client.GetShipyardAsync();
        Console.WriteLine($"Ships available: {shipyard.Ships?.Count ?? 0}");
        Console.WriteLine($"Modules available: {shipyard.Modules?.Count ?? 0}");
    }

    var fc = await client.GetFleetCarrierAsync();
    if (!string.IsNullOrEmpty(fc.Name))
    {
        Console.WriteLine($"Fleet Carrier: {fc.Name}");
        Console.WriteLine($"Balance: {fc.CurrentBalance}");
        Console.WriteLine($"Fuel: {fc.FuelLevel}");
    }

    var cgs = await client.GetCommunityGoalsAsync();
    var goals = cgs.GetProperty("communitygoals");
    Console.WriteLine($"Active goals: {goals.GetArrayLength()}");
}

// === Step 4: Handle token refresh (automatic) ===
Console.WriteLine($"Authenticated: {auth.IsAuthenticated}");

if (auth.IsAuthenticated)
{
    Console.WriteLine($"Access token: {auth.AccessToken?[..20]}...");
    Console.WriteLine($"Expires at: {auth.ExpiresAt}");
}

// To clear auth:
// auth.AccessToken = null;
// auth.RefreshToken = null;
