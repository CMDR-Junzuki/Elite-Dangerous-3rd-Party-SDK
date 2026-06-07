#nullable enable
using System;
using System.Collections.Generic;
using System.Linq;

namespace EliteDangerousSdk.Journal;

public record MaterialEntry(string Name, int Count);

public record MissionState(
    int MissionID,
    string Name,
    string Faction,
    string Expiry,
    int Reward,
    string DestinationSystem,
    string DestinationStation,
    bool PassengerMission,
    bool Wing,
    bool Failed
);

public record ShipModuleState(
    string Slot,
    string Item,
    int Priority,
    double Health,
    int Value,
    ModuleEngineeringState? Engineering
);

public record ModuleEngineeringState(
    string Engineer,
    string BlueprintName,
    int Level,
    double Quality,
    string ExperimentalEffect
);

public record FleetEntry(string Ship, int ShipID, string ShipName, string ShipIdent);

public record NavRouteEntry(string StarSystem, long SystemAddress, double[] StarPos);

public record CarrierState(
    string Id,
    string Callsign,
    string Name,
    double FuelLevel,
    double JumpRangeCurr,
    double JumpRangeMax,
    string DockingAccess
);

public record Ranks(
    int Combat, int Trade, int Explore, int Cqc, int Empire, int Federation, int Soldier, int Exobiologist
);

public record ProgressValues(
    double Combat, double Trade, double Explore, double Cqc, double Empire, double Federation, double Soldier, double Exobiologist
);

public record CommanderInfo(
    string Name, string Fid, long Credits, long Loan, Ranks Ranks, ProgressValues Progress
);

public record LocationState(
    string System, long SystemAddress, double[] StarPos, string Body, string BodyType, long BodyID,
    string Station, string StationType, long MarketID, bool Docked,
    double Latitude, double Longitude, double Altitude, double Heading, double PlanetRadius,
    bool OnPlanet, bool InSupercruise, bool Jumping,
    string SystemAllegiance, string SystemEconomy, string SystemGovernment, string SystemSecurity,
    long Population, string PowerplayState, string[] Powers,
    List<FactionStateInfo> Factions, List<ConflictInfo> Conflicts
);

public record ShipState(
    string Current, int ShipID, string Name, string Ident,
    double FuelLevel, double FuelCapacity, double HullHealth, double UnladenMass, double MaxJumpRange,
    List<ShipModuleState> Modules
);

public record MaterialLists(
    List<MaterialEntry> Raw, List<MaterialEntry> Manufactured, List<MaterialEntry> Encoded,
    List<MaterialEntry> Items, List<MaterialEntry> Components, List<MaterialEntry> Consumables, List<MaterialEntry> Data
);

public record FactionStateInfo(
    string Name,
    string FactionState,
    double Influence,
    string Allegiance,
    string Government,
    string? Happiness,
    double? MyReputation,
    bool? SquadronFaction,
    List<Dictionary<string, object?>>? ActiveStates,
    List<Dictionary<string, object?>>? PendingStates,
    List<Dictionary<string, object?>>? RecoveringStates
);

public record ConflictFactionInfo(string Name, string Stake, int WonDays);

public record ConflictInfo(
    string WarType,
    string Status,
    ConflictFactionInfo Faction1,
    ConflictFactionInfo Faction2
);

public record SquadronState(
    string Name,
    string Rank,
    string AlignedPower,
    string HomeSystem,
    string FactionName,
    string PowerplayState,
    long Id,
    int CurrentRating,
    List<Dictionary<string, object?>> Ratings
);

public record FlagsState(bool Odyssey, bool Horizons, string GameMode, string Group);

public record CommanderState(
    CommanderInfo Commander,
    LocationState Location,
    ShipState Ship,
    List<FleetEntry> Fleet,
    MaterialLists Materials,
    List<MissionState> Missions,
    CarrierState? Carrier,
    List<NavRouteEntry> NavRoute,
    FlagsState Flags,
    SquadronState Squadron
);

public class CommanderStateEngine
{
    private CommanderState _state = EmptyState();

    private static CommanderState EmptyState()
    {
        return new CommanderState(
            new CommanderInfo("", "", 0, 0,
                new Ranks(0, 0, 0, 0, 0, 0, 0, 0),
                new ProgressValues(0, 0, 0, 0, 0, 0, 0, 0)),
            new LocationState("", 0, new double[] { 0, 0, 0 }, "", "", 0, "", "", 0, false,
                0, 0, 0, 0, 0, false, false, false, "", "", "", "", 0, "", Array.Empty<string>(),
                new List<FactionStateInfo>(), new List<ConflictInfo>()),
            new ShipState("", 0, "", "", 0, 0, 100, 0, 0, new List<ShipModuleState>()),
            new List<FleetEntry>(),
            new MaterialLists(
                new List<MaterialEntry>(), new List<MaterialEntry>(), new List<MaterialEntry>(),
                new List<MaterialEntry>(), new List<MaterialEntry>(), new List<MaterialEntry>(), new List<MaterialEntry>()),
            new List<MissionState>(),
            null,
            new List<NavRouteEntry>(),
            new FlagsState(false, false, "", ""),
            new SquadronState("", "", "", "", "", "", 0, 0, new List<Dictionary<string, object?>>())
        );
    }

    public CommanderState GetState() => _state;

    public void Reset()
    {
        _state = EmptyState();
    }

    public CommanderState Export()
    {
        return _state with
        {
            Location = _state.Location with
            {
                Factions = new List<FactionStateInfo>(_state.Location.Factions),
                Conflicts = new List<ConflictInfo>(_state.Location.Conflicts),
            },
            Fleet = new List<FleetEntry>(_state.Fleet),
            Materials = _state.Materials with
            {
                Raw = new List<MaterialEntry>(_state.Materials.Raw),
                Manufactured = new List<MaterialEntry>(_state.Materials.Manufactured),
                Encoded = new List<MaterialEntry>(_state.Materials.Encoded),
                Items = new List<MaterialEntry>(_state.Materials.Items),
                Components = new List<MaterialEntry>(_state.Materials.Components),
                Consumables = new List<MaterialEntry>(_state.Materials.Consumables),
                Data = new List<MaterialEntry>(_state.Materials.Data),
            },
            Missions = new List<MissionState>(_state.Missions),
            Ship = _state.Ship with { Modules = new List<ShipModuleState>(_state.Ship.Modules) },
            NavRoute = new List<NavRouteEntry>(_state.NavRoute),
            Squadron = _state.Squadron with { Ratings = new List<Dictionary<string, object?>>(_state.Squadron.Ratings) },
        };
    }

    public void Import(CommanderState state)
    {
        _state = state;
    }

    public CommanderState Update(dynamic? eventObj)
    {
        if (eventObj == null) return _state;
        string eventType = eventObj.@event;
        switch (eventType)
        {
            case "LoadGame": return HandleLoadGame(eventObj);
            case "Location": return HandleLocation(eventObj);
            case "FSDJump": return HandleFsdJump(eventObj);
            case "Docked": return HandleDocked(eventObj);
            case "Undocked": return HandleUndocked(eventObj);
            case "StartJump": return HandleStartJump(eventObj);
            case "SupercruiseEntry": return HandleSupercruiseEntry(eventObj);
            case "SupercruiseExit": return HandleSupercruiseExit(eventObj);
            case "ApproachBody": return HandleApproachBody(eventObj);
            case "LeaveBody": return HandleLeaveBody();
            case "Touchdown": return HandleTouchdown(eventObj);
            case "Liftoff": return HandleLiftoff(eventObj);
            case "Promotion": return HandlePromotion(eventObj);
            case "Progress": return HandleProgress(eventObj);
            case "Rank": return HandleRank(eventObj);
            case "MaterialCollected": return HandleMaterialCollected(eventObj);
            case "MaterialDiscarded": return HandleMaterialDiscarded(eventObj);
            case "MaterialTrade": return HandleMaterialTrade(eventObj);
            case "Synthesis": return HandleSynthesis(eventObj);
            case "EngineerCraft": return HandleEngineerCraft(eventObj);
            case "ModuleInfo": return HandleModuleInfo(eventObj);
            case "NavRoute": return HandleNavRoute(eventObj);
            case "NavRouteClear": return HandleNavRouteClear();
            case "MissionAccepted": return HandleMissionAccepted(eventObj);
            case "MissionCompleted": return HandleMissionCompleted(eventObj);
            case "MissionFailed": return HandleMissionFailed(eventObj);
            case "MissionAbandoned": return HandleMissionAbandoned(eventObj);
            case "MissionRedirected": return HandleMissionRedirected(eventObj);
            case "ShipLocker": return HandleShipLocker(eventObj);
            case "ShipLockerMaterials": return HandleShipLocker(eventObj);
            case "Materials": return HandleMaterials(eventObj);
            case "CarrierJump": return HandleCarrierJump(eventObj);
            case "CarrierBuy": return HandleCarrierBuy(eventObj);
            case "CarrierStats": return HandleCarrierStats(eventObj);
            case "CarrierNameChange": return HandleCarrierNameChange(eventObj);
            case "CarrierFinance": return HandleCarrierFinance(eventObj);
            case "SquadronStartup": return HandleSquadronStartup(eventObj);
            case "JoinedSquadron": return HandleJoinedSquadron(eventObj);
            case "LeftSquadron":
            case "DisbandedSquadron":
            case "KickedFromSquadron": return HandleLeftSquadron();
            case "SquadronCreated": return HandleSquadronCreated(eventObj);
            case "SquadronDemotion": return HandleSquadronDemotion(eventObj);
            case "SquadronPromotion": return HandleSquadronPromotion(eventObj);
            default: return _state;
        }
    }

    private static long ToLong(dynamic val) => val is long l ? l : (long)(double)val;

    private static IDictionary<string, object?> Dict(object obj) => (IDictionary<string, object?>)obj;

    private static string PropStr(object obj, string key, string fallback = "")
    {
        try { var d = Dict(obj); if (d.TryGetValue(key, out object? v) && v is string) return (string)v; return fallback; }
        catch { return fallback; }
    }

    private static long PropLong(object obj, string key, long fallback = 0)
    {
        try { var d = Dict(obj); if (d.TryGetValue(key, out object? v)) return System.Convert.ToInt64(v); return fallback; }
        catch { return fallback; }
    }

    private static int PropInt(object obj, string key, int fallback = 0)
    {
        try { var d = Dict(obj); if (d.TryGetValue(key, out object? v)) return System.Convert.ToInt32(v); return fallback; }
        catch { return fallback; }
    }

    private static double PropDouble(object obj, string key, double fallback = 0)
    {
        try { var d = Dict(obj); if (d.TryGetValue(key, out object? v)) return System.Convert.ToDouble(v); return fallback; }
        catch { return fallback; }
    }

    private static bool PropBool(object obj, string key, bool fallback = false)
    {
        try { var d = Dict(obj); if (d.TryGetValue(key, out object? v)) return (bool)v; return fallback; }
        catch { return fallback; }
    }

    private static double[] PropPos(object obj, string key)
    {
        try
        {
            var d = Dict(obj);
            if (d.TryGetValue(key, out object? arr) && arr is IEnumerable<object>)
            {
                var items = (IEnumerable<object>)arr;
                return new double[] { (double)(items.ElementAt(0)), (double)(items.ElementAt(1)), (double)(items.ElementAt(2)) };
            }
            return new double[] { 0, 0, 0 };
        }
        catch { return new double[] { 0, 0, 0 }; }
    }

    private static string[] PropStrArray(object obj, string key)
    {
        try
        {
            var d = Dict(obj);
            if (!d.TryGetValue(key, out object? arr)) return Array.Empty<string>();
            if (arr is not IEnumerable<object> items) return Array.Empty<string>();
            var result = new List<string>();
            foreach (var item in items) result.Add((string)item);
            return result.ToArray();
        }
        catch { return Array.Empty<string>(); }
    }

    private static List<Dictionary<string, object?>>? PropStateList(object obj, string key)
    {
        try
        {
            var d = Dict(obj);
            if (!d.TryGetValue(key, out object? arr) || arr is not IEnumerable<object> items)
                return null;
            var result = new List<Dictionary<string, object?>>();
            foreach (var item in items)
            {
                if (item is IDictionary<string, object?> itemDict)
                    result.Add(new Dictionary<string, object?>(itemDict));
            }
            return result;
        }
        catch { return null; }
    }

    private List<FactionStateInfo> ExtractFactions(object e)
    {
        var result = new List<FactionStateInfo>();
        var d = Dict(e);
        if (!d.TryGetValue("Factions", out object? factionsArr) || factionsArr is not System.Collections.IEnumerable factions)
            return result;
        foreach (var f in factions)
        {
            var fd = Dict(f);
            string? happiness = null;
            var h = PropStr(f, "Happiness");
            if (h != "") happiness = h;
            double? myRep = null;
            var repVal = PropDouble(f, "MyReputation", -1);
            if (repVal >= 0) myRep = repVal;
            result.Add(new FactionStateInfo(
                PropStr(f, "Name"),
                PropStr(f, "FactionState"),
                PropDouble(f, "Influence"),
                PropStr(f, "Allegiance"),
                PropStr(f, "Government"),
                happiness,
                myRep,
                fd.TryGetValue("SquadronFaction", out object? sf) ? (bool?)sf : null,
                PropStateList(f, "ActiveStates"),
                PropStateList(f, "PendingStates"),
                PropStateList(f, "RecoveringStates")
            ));
        }
        return result;
    }

    private List<ConflictInfo> ExtractConflicts(object e)
    {
        var result = new List<ConflictInfo>();
        var d = Dict(e);
        if (!d.TryGetValue("Conflicts", out object? conflictsArr) || conflictsArr is not System.Collections.IEnumerable conflicts)
            return result;
        foreach (var c in conflicts)
        {
            var cd = Dict(c);
            result.Add(new ConflictInfo(
                PropStr(c, "WarType"),
                PropStr(c, "Status"),
                new ConflictFactionInfo(
                    PropStr(cd["Faction1"]!, "Name"),
                    PropStr(cd["Faction1"]!, "Stake"),
                    PropInt(cd["Faction1"]!, "WonDays")
                ),
                new ConflictFactionInfo(
                    PropStr(cd["Faction2"]!, "Name"),
                    PropStr(cd["Faction2"]!, "Stake"),
                    PropInt(cd["Faction2"]!, "WonDays")
                )
            ));
        }
        return result;
    }

    private void SetLocationFields(dynamic e)
    {
        _state = _state with
        {
            Location = _state.Location with
            {
                System = PropStr(e, "StarSystem"),
                SystemAddress = PropLong(e, "SystemAddress"),
                StarPos = PropPos(e, "StarPos"),
                Body = PropStr(e, "Body"),
                BodyID = PropLong(e, "BodyID"),
                BodyType = PropStr(e, "BodyType"),
                SystemAllegiance = PropStr(e, "SystemAllegiance"),
                SystemEconomy = PropStr(e, "SystemEconomy"),
                SystemGovernment = PropStr(e, "SystemGovernment"),
                SystemSecurity = PropStr(e, "SystemSecurity"),
                Population = PropLong(e, "Population"),
                PowerplayState = PropStr(e, "PowerplayState"),
                Powers = PropStrArray(e, "Powers"),
                InSupercruise = false,
                Jumping = false,
                Factions = ExtractFactions(e),
                Conflicts = ExtractConflicts(e),
            }
        };
    }

    private CommanderState HandleLoadGame(dynamic e)
    {
        var r = _state.Commander.Ranks;
        var p = _state.Commander.Progress;
        _state = _state with
        {
            Commander = _state.Commander with
            {
                Name = PropStr(e, "Commander"),
                Fid = PropStr(e, "FID"),
                Credits = PropLong(e, "Credits"),
                Loan = PropLong(e, "Loan"),
            },
            Ship = _state.Ship with
            {
                Current = PropStr(e, "Ship"),
                ShipID = PropInt(e, "ShipID"),
                Name = PropStr(e, "ShipName"),
                Ident = PropStr(e, "ShipIdent"),
                FuelLevel = PropDouble(e, "FuelLevel"),
                FuelCapacity = PropDouble(e, "FuelCapacity"),
            },
            Flags = _state.Flags with
            {
                Odyssey = PropBool(e, "Odyssey"),
                Horizons = PropBool(e, "Horizons"),
                GameMode = PropStr(e, "GameMode"),
                Group = PropStr(e, "Group"),
            }
        };
        return _state;
    }

    private CommanderState HandleLocation(dynamic e)
    {
        SetLocationFields(e);
        _state = _state with
        {
            Location = _state.Location with
            {
                Docked = PropBool(e, "Docked"),
                Station = PropStr(e, "StationName"),
                StationType = PropStr(e, "StationType"),
                MarketID = PropLong(e, "MarketID"),
            }
        };
        return _state;
    }

    private CommanderState HandleFsdJump(dynamic e)
    {
        SetLocationFields(e);
        var fuel = PropDouble(e, "FuelLevel", -1);
        if (fuel >= 0)
            _state = _state with { Ship = _state.Ship with { FuelLevel = fuel } };
        return _state;
    }

    private CommanderState HandleDocked(dynamic e)
    {
        SetLocationFields(e);
        _state = _state with
        {
            Location = _state.Location with
            {
                Docked = true,
                Station = PropStr(e, "StationName"),
                StationType = PropStr(e, "StationType"),
                MarketID = PropLong(e, "MarketID"),
                OnPlanet = false,
            }
        };
        return _state;
    }

    private CommanderState HandleUndocked(dynamic e)
    {
        _state = _state with
        {
            Location = _state.Location with { Docked = false, Station = "", StationType = "" }
        };
        return _state;
    }

    private CommanderState HandleStartJump(dynamic e)
    {
        _state = _state with { Location = _state.Location with { Jumping = true } };
        if (PropStr(e, "JumpType") == "Supercruise")
            _state = _state with { Location = _state.Location with { InSupercruise = true } };
        return _state;
    }

    private CommanderState HandleSupercruiseEntry(dynamic e)
    {
        _state = _state with { Location = _state.Location with { InSupercruise = true, Jumping = false } };
        return _state;
    }

    private CommanderState HandleSupercruiseExit(dynamic e)
    {
        _state = _state with
        {
            Location = _state.Location with
            {
                InSupercruise = false,
                Jumping = false,
                Body = PropStr(e, "Body"),
                BodyID = PropLong(e, "BodyID"),
                BodyType = PropStr(e, "BodyType"),
            }
        };
        return _state;
    }

    private CommanderState HandleApproachBody(dynamic e)
    {
        _state = _state with
        {
            Location = _state.Location with
            {
                Body = PropStr(e, "Body"),
                BodyID = PropLong(e, "BodyID"),
            }
        };
        return _state;
    }

    private CommanderState HandleLeaveBody()
    {
        _state = _state with
        {
            Location = _state.Location with { Body = "", BodyID = 0, BodyType = "" }
        };
        return _state;
    }

    private CommanderState HandleTouchdown(dynamic e)
    {
        _state = _state with
        {
            Location = _state.Location with
            {
                OnPlanet = true,
                Body = PropStr(e, "Body", _state.Location.Body),
                Latitude = PropDouble(e, "Latitude"),
                Longitude = PropDouble(e, "Longitude"),
            }
        };
        return _state;
    }

    private CommanderState HandleLiftoff(dynamic e)
    {
        _state = _state with
        {
            Location = _state.Location with
            {
                OnPlanet = false,
                Latitude = PropDouble(e, "Latitude"),
                Longitude = PropDouble(e, "Longitude"),
            }
        };
        return _state;
    }

    private static Ranks UpdateRanks(Ranks r, dynamic e)
    {
        var c = r.Combat; var t = r.Trade; var ex = r.Explore; var cq = r.Cqc;
        var em = r.Empire; var f = r.Federation; var s = r.Soldier; var eb = r.Exobiologist;
        try { c = (int)(double)e.Combat; } catch { }
        try { t = (int)(double)e.Trade; } catch { }
        try { ex = (int)(double)e.Explore; } catch { }
        try { cq = (int)(double)e.CQC; } catch { }
        try { em = (int)(double)e.Empire; } catch { }
        try { f = (int)(double)e.Federation; } catch { }
        try { s = (int)(double)e.Soldier; } catch { }
        try { eb = (int)(double)e.Exobiologist; } catch { }
        return new Ranks(c, t, ex, cq, em, f, s, eb);
    }

    private static ProgressValues UpdateProgress(ProgressValues p, dynamic e)
    {
        var c = p.Combat; var t = p.Trade; var ex = p.Explore; var cq = p.Cqc;
        var em = p.Empire; var f = p.Federation; var s = p.Soldier; var eb = p.Exobiologist;
        try { c = (double)e.Combat; } catch { }
        try { t = (double)e.Trade; } catch { }
        try { ex = (double)e.Explore; } catch { }
        try { cq = (double)e.CQC; } catch { }
        try { em = (double)e.Empire; } catch { }
        try { f = (double)e.Federation; } catch { }
        try { s = (double)e.Soldier; } catch { }
        try { eb = (double)e.Exobiologist; } catch { }
        return new ProgressValues(c, t, ex, cq, em, f, s, eb);
    }

    private CommanderState HandlePromotion(dynamic e)
    {
        _state = _state with
        {
            Commander = _state.Commander with
            {
                Ranks = UpdateRanks(_state.Commander.Ranks, e)
            }
        };
        return _state;
    }

    private CommanderState HandleProgress(dynamic e)
    {
        _state = _state with
        {
            Commander = _state.Commander with
            {
                Progress = UpdateProgress(_state.Commander.Progress, e)
            }
        };
        return _state;
    }

    private CommanderState HandleRank(dynamic e) => HandlePromotion(e);

    private static string MaterialCategory(string cat)
    {
        var lc = cat.ToLowerInvariant();
        return lc is "raw" or "manufactured" or "encoded" ? lc : "raw";
    }

    private static void UpsertMaterial(List<MaterialEntry> list, string name, int delta)
    {
        var idx = list.FindIndex(e => e.Name == name);
        if (idx >= 0)
        {
            var next = list[idx].Count + delta;
            if (next <= 0)
                list.RemoveAt(idx);
            else
                list[idx] = new MaterialEntry(name, next);
        }
        else if (delta > 0)
        {
            list.Add(new MaterialEntry(name, delta));
        }
    }

    private List<MaterialEntry> GetMatList(string cat)
    {
        var m = _state.Materials;
        return cat switch
        {
            "raw" => m.Raw,
            "manufactured" => m.Manufactured,
            "encoded" => m.Encoded,
            _ => m.Raw,
        };
    }

    private CommanderState HandleMaterialCollected(dynamic e)
    {
        var cat = MaterialCategory(PropStr(e, "Category"));
        var name = PropStr(e, "Name");
        var count = PropInt(e, "Count", 1);
        var list = GetMatList(cat);
        UpsertMaterial(list, name, count);
        return _state;
    }

    private CommanderState HandleMaterialDiscarded(dynamic e)
    {
        var cat = MaterialCategory(PropStr(e, "Category"));
        var name = PropStr(e, "Name");
        var count = PropInt(e, "Count", 1);
        var list = GetMatList(cat);
        UpsertMaterial(list, name, -count);
        return _state;
    }

    private CommanderState HandleMaterialTrade(dynamic e)
    {
        try
        {
            var traded = e.Traded;
            var received = e.Received;
            var fromCat = MaterialCategory(PropStr(traded, "Category"));
            var toCat = MaterialCategory(PropStr(received, "Category"));
            var fromList = GetMatList(fromCat);
            var toList = GetMatList(toCat);
            UpsertMaterial(fromList, PropStr(traded, "Material"), -PropInt(traded, "Quantity"));
            UpsertMaterial(toList, PropStr(received, "Material"), PropInt(received, "Quantity"));
        }
        catch { }
        return _state;
    }

    private CommanderState HandleSynthesis(dynamic e)
    {
        try
        {
            foreach (var ing in e.Materials)
            {
                var cat = MaterialCategory(PropStr(ing, "Category", "Manufactured"));
                var list = GetMatList(cat);
                UpsertMaterial(list, PropStr(ing, "Name"), -PropInt(ing, "Count"));
            }
        }
        catch { }
        return _state;
    }

    private CommanderState HandleEngineerCraft(dynamic e)
    {
        try
        {
            foreach (var ing in e.Ingredients)
            {
                var cat = MaterialCategory(PropStr(ing, "Category", "Raw"));
                var list = GetMatList(cat);
                UpsertMaterial(list, PropStr(ing, "Name"), -PropInt(ing, "Quantity"));
            }
        }
        catch { }
        return _state;
    }

    private CommanderState HandleModuleInfo(dynamic e)
    {
        try
        {
            var modules = new List<ShipModuleState>();
            foreach (var m in e.Modules)
            {
                ModuleEngineeringState? eng = null;
                try
                {
                    var em = m.Engineering;
                    if (em != null)
                        eng = new ModuleEngineeringState(
                            (string)em.Engineer, (string)em.BlueprintName,
                            (int)(double)em.Level, (double)em.Quality,
                            PropStr(em, "ExperimentalEffect"));
                }
                catch { }
                modules.Add(new ShipModuleState(
                    (string)m.Slot, (string)m.Item, (int)(double)m.Priority,
                    PropDouble(m, "Health", 100), PropInt(m, "Value"), eng));
            }
            _state = _state with { Ship = _state.Ship with { Modules = modules } };
        }
        catch { }
        return _state;
    }

    private CommanderState HandleNavRoute(dynamic e)
    {
        try
        {
            var route = new List<NavRouteEntry>();
            foreach (var r in e.Route)
            {
                var pos = new double[] { 0, 0, 0 };
                try { var arr = r.StarPos; pos = new double[] { (double)arr[0], (double)arr[1], (double)arr[2] }; } catch { }
                route.Add(new NavRouteEntry(
                    (string)r.StarSystem, PropLong(r, "SystemAddress"), pos));
            }
            _state = _state with { NavRoute = route };
        }
        catch { }
        return _state;
    }

    private CommanderState HandleNavRouteClear()
    {
        _state = _state with { NavRoute = new List<NavRouteEntry>() };
        return _state;
    }

    private static MissionState MissionFromAccepted(dynamic e)
    {
        return new MissionState(
            PropInt(e, "MissionID"), PropStr(e, "Name"), PropStr(e, "Faction"),
            PropStr(e, "Expiry"), PropInt(e, "Reward"),
            PropStr(e, "DestinationSystem"), PropStr(e, "DestinationStation"),
            PropBool(e, "PassengerMission"), PropBool(e, "Wing"), false);
    }

    private CommanderState HandleMissionAccepted(dynamic e)
    {
        var mission = MissionFromAccepted(e);
        var idx = _state.Missions.FindIndex(m => m.MissionID == mission.MissionID);
        var missions = new List<MissionState>(_state.Missions);
        if (idx >= 0)
            missions[idx] = mission;
        else
            missions.Add(mission);
        _state = _state with { Missions = missions };
        return _state;
    }

    private CommanderState HandleMissionCompleted(dynamic e)
    {
        var mid = PropInt(e, "MissionID");
        _state = _state with { Missions = _state.Missions.Where(m => m.MissionID != mid).ToList() };
        return _state;
    }

    private CommanderState HandleMissionFailed(dynamic e)
    {
        var mid = PropInt(e, "MissionID");
        var missions = new List<MissionState>(_state.Missions);
        var idx = missions.FindIndex(m => m.MissionID == mid);
        if (idx >= 0)
            missions[idx] = missions[idx] with { Failed = true };
        _state = _state with { Missions = missions };
        return _state;
    }

    private CommanderState HandleMissionAbandoned(dynamic e)
    {
        var mid = PropInt(e, "MissionID");
        _state = _state with { Missions = _state.Missions.Where(m => m.MissionID != mid).ToList() };
        return _state;
    }

    private CommanderState HandleMissionRedirected(dynamic e)
    {
        var mid = PropInt(e, "MissionID");
        var missions = new List<MissionState>(_state.Missions);
        var idx = missions.FindIndex(m => m.MissionID == mid);
        if (idx >= 0)
        {
            var m = missions[idx];
            var newDestSys = PropStr(e, "NewDestinationSystem");
            var newDestSta = PropStr(e, "NewDestinationStation");
            if (!string.IsNullOrEmpty(newDestSys)) m = m with { DestinationSystem = newDestSys };
            if (!string.IsNullOrEmpty(newDestSta)) m = m with { DestinationStation = newDestSta };
            missions[idx] = m;
        }
        _state = _state with { Missions = missions };
        return _state;
    }

    private static List<MaterialEntry> ParseMatList(dynamic arr)
    {
        var result = new List<MaterialEntry>();
        try
        {
            foreach (var item in arr)
            {
                var name = PropStr(item, "Name");
                if (!string.IsNullOrEmpty(name))
                    result.Add(new MaterialEntry(name, PropInt(item, "Count")));
            }
        }
        catch { }
        return result;
    }

    private CommanderState HandleShipLocker(dynamic e)
    {
        var m = _state.Materials;
        try { m = m with { Items = ParseMatList(e.Items) }; } catch { }
        try { m = m with { Components = ParseMatList(e.Components) }; } catch { }
        try { m = m with { Consumables = ParseMatList(e.Consumables) }; } catch { }
        try { m = m with { Data = ParseMatList(e.Data) }; } catch { }
        _state = _state with { Materials = m };
        return _state;
    }

    private CommanderState HandleMaterials(dynamic e)
    {
        var m = _state.Materials;
        try { m = m with { Raw = ParseMatList(e.Raw) }; } catch { }
        try { m = m with { Manufactured = ParseMatList(e.Manufactured) }; } catch { }
        try { m = m with { Encoded = ParseMatList(e.Encoded) }; } catch { }
        _state = _state with { Materials = m };
        return _state;
    }

    private CommanderState HandleCarrierJump(dynamic e)
    {
        _state = _state with
        {
            Location = _state.Location with
            {
                System = PropStr(e, "StarSystem", _state.Location.System),
                SystemAddress = PropLong(e, "SystemAddress"),
                Body = PropStr(e, "Body"),
                BodyID = PropLong(e, "BodyID"),
            }
        };
        return _state;
    }

    private CommanderState HandleCarrierBuy(dynamic e)
    {
        _state = _state with
        {
            Carrier = new CarrierState(
                PropLong(e, "CarrierID").ToString(), PropStr(e, "Callsign"),
                "", 0, 0, 0, "")
        };
        return _state;
    }

    private CommanderState HandleCarrierStats(dynamic e)
    {
        var existing = _state.Carrier ?? new CarrierState(
            PropLong(e, "CarrierID").ToString(), "", "", 0, 0, 0, "");
        _state = _state with
        {
            Carrier = existing with
            {
                Callsign = PropStr(e, "Callsign"),
                Name = PropStr(e, "Name"),
                FuelLevel = PropDouble(e, "FuelLevel"),
                JumpRangeCurr = PropDouble(e, "JumpRangeCurr"),
                JumpRangeMax = PropDouble(e, "JumpRangeMax"),
                DockingAccess = PropStr(e, "DockingAccess"),
            }
        };
        return _state;
    }

    private CommanderState HandleCarrierNameChange(dynamic e)
    {
        if (_state.Carrier != null)
        {
            _state = _state with
            {
                Carrier = _state.Carrier with
                {
                    Name = PropStr(e, "Name"),
                    Callsign = PropStr(e, "Callsign", _state.Carrier.Callsign),
                }
            };
        }
        return _state;
    }

    private CommanderState HandleCarrierFinance(dynamic e)
    {
        if (_state.Carrier == null)
        {
            _state = _state with
            {
                Carrier = new CarrierState(
                    PropLong(e, "CarrierID").ToString(), "", "", 0, 0, 0, "")
            };
        }
        return _state;
    }

    private static List<Dictionary<string, object?>> ExtractRatingList(dynamic e)
    {
        var result = new List<Dictionary<string, object?>>();
        try
        {
            var ratings = e.Rating;
            if (ratings is IEnumerable<object> items)
            {
                foreach (var item in items)
                {
                    if (item is IDictionary<string, object?> d)
                        result.Add(new Dictionary<string, object?>(d));
                }
            }
        }
        catch { }
        return result;
    }

    private CommanderState HandleSquadronStartup(dynamic e)
    {
        _state = _state with
        {
            Squadron = new SquadronState(
                PropStr(e, "SquadronName"),
                PropStr(e, "SquadronRank"),
                PropStr(e, "SquadronAlignedPower"),
                PropStr(e, "SquadronHomeSystem"),
                PropStr(e, "SquadronFaction"),
                PropStr(e, "SquadronPowerplayState"),
                PropLong(e, "SquadronID"),
                PropInt(e, "CurrentRating"),
                ExtractRatingList(e)
            )
        };
        return _state;
    }

    private CommanderState HandleJoinedSquadron(dynamic e)
    {
        _state = _state with
        {
            Squadron = _state.Squadron with { Name = PropStr(e, "SquadronName") }
        };
        return _state;
    }

    private CommanderState HandleLeftSquadron()
    {
        _state = _state with
        {
            Squadron = new SquadronState("", "", "", "", "", "", 0, 0, new List<Dictionary<string, object?>>())
        };
        return _state;
    }

    private CommanderState HandleSquadronCreated(dynamic e)
    {
        _state = _state with
        {
            Squadron = _state.Squadron with { Name = PropStr(e, "SquadronName") }
        };
        return _state;
    }

    private CommanderState HandleSquadronDemotion(dynamic e)
    {
        _state = _state with
        {
            Squadron = _state.Squadron with { Rank = PropInt(e, "NewRank").ToString() }
        };
        return _state;
    }

    private CommanderState HandleSquadronPromotion(dynamic e)
    {
        _state = _state with
        {
            Squadron = _state.Squadron with { Rank = PropInt(e, "NewRank").ToString() }
        };
        return _state;
    }
}
