namespace EliteDangerousSdk.Inara;

using System.Net.Http.Json;
using System.Text.Json;

public class InaraClient
{
    private readonly HttpClient _http;
    private readonly Dictionary<string, object> _header;
    private DateTime _lastRequest = DateTime.MinValue;

    public InaraClient(string appName, string appVersion, string apiKey,
        string? commanderName = null, string? commanderFrontierId = null,
        bool isDeveloping = false)
    {
        _http = new HttpClient { BaseAddress = new Uri("https://inara.cz") };
        _header = new()
        {
            ["appName"] = appName,
            ["appVersion"] = appVersion,
            ["isBeingDeveloped"] = isDeveloping,
            ["APIkey"] = apiKey,
        };
        if (commanderName != null) _header["commanderName"] = commanderName;
        if (commanderFrontierId != null) _header["commanderFrontierID"] = commanderFrontierId;
    }

    public async Task<InaraResponse> SendEventsAsync(List<Dictionary<string, object>> events)
    {
        var elapsed = (DateTime.UtcNow - _lastRequest).TotalSeconds;
        if (elapsed < 30) await Task.Delay((int)((30 - elapsed) * 1000));

        var payload = new Dictionary<string, object>
        {
            ["header"] = _header,
            ["events"] = events,
        };

        var resp = await _http.PostAsJsonAsync("/inapi/v1/", payload);
        resp.EnsureSuccessStatusCode();
        _lastRequest = DateTime.UtcNow;
        var data = (await resp.Content.ReadFromJsonAsync<InaraResponse>())!;
        if (data.Header.EventStatus != 200)
            throw new InvalidOperationException(
                data.Header.EventStatusText ?? $"Inara API error: {data.Header.EventStatus}");
        return data;
    }

    // === Event Builders ===

    public Dictionary<string, object> AddCommander(string commanderName, string? frontierId = null) => new()
    {
        ["eventName"] = "addCommander",
        ["eventData"] = new Dictionary<string, object?>
        {
            ["commanderName"] = commanderName,
            ["commanderFrontierID"] = frontierId,
            ["isMainCommander"] = true,
        },
    };

    public Dictionary<string, object> GetCommanderProfile() => new()
    {
        ["eventName"] = "getCommanderProfile",
    };

    public Dictionary<string, object> SetCommanderShip(string shipType, int shipGameId,
        string? shipName = null, string? shipIdent = null, string? shipRole = null) => new()
    {
        ["eventName"] = "setCommanderShip",
        ["eventData"] = new Dictionary<string, object?>
        {
            ["shipType"] = shipType,
            ["shipGameID"] = shipGameId,
            ["shipName"] = shipName,
            ["shipIdent"] = shipIdent,
            ["shipRole"] = shipRole ?? "Multi-purpose",
        },
    };

    public Dictionary<string, object> SetCommanderShipLoadout(int shipId,
        List<Dictionary<string, object>> modules) => new()
    {
        ["eventName"] = "setCommanderShipLoadout",
        ["eventData"] = new Dictionary<string, object>
        {
            ["shipGameID"] = shipId,
            ["modules"] = modules,
        },
    };

    public Dictionary<string, object> AddCommanderTravelFsdJump(string systemName,
        double[]? systemCoords = null, string? date = null)
    {
        var data = new Dictionary<string, object?> { ["starSystemName"] = systemName };
        if (systemCoords != null && systemCoords.Length == 3)
        {
            data["starSystemX"] = systemCoords[0];
            data["starSystemY"] = systemCoords[1];
            data["starSystemZ"] = systemCoords[2];
        }
        var evt = new Dictionary<string, object> { ["eventName"] = "addCommanderTravelFSDJump" };
        if (date != null) evt["eventTimestamp"] = date;
        evt["eventData"] = data!;
        return evt;
    }

    public Dictionary<string, object> AddCommanderTravelDock(string stationName,
        string systemName, string? date = null)
    {
        var evt = new Dictionary<string, object> { ["eventName"] = "addCommanderTravelDock" };
        if (date != null) evt["eventTimestamp"] = date;
        evt["eventData"] = new Dictionary<string, object?>
        {
            ["starSystemName"] = systemName,
            ["stationName"] = stationName,
        };
        return evt;
    }

    public Dictionary<string, object> AddCommanderTravelCarrierJump(string systemName,
        double[]? systemCoords = null, string? date = null)
    {
        var data = new Dictionary<string, object?> { ["starSystemName"] = systemName };
        if (systemCoords != null && systemCoords.Length == 3)
        {
            data["starSystemX"] = systemCoords[0];
            data["starSystemY"] = systemCoords[1];
            data["starSystemZ"] = systemCoords[2];
        }
        var evt = new Dictionary<string, object> { ["eventName"] = "addCommanderTravelCarrierJump" };
        if (date != null) evt["eventTimestamp"] = date;
        evt["eventData"] = data!;
        return evt;
    }

    public Dictionary<string, object> SetCommanderTravelLocation(string systemName,
        double[]? systemCoords = null, string? date = null)
    {
        var data = new Dictionary<string, object?> { ["starSystemName"] = systemName };
        if (systemCoords != null && systemCoords.Length == 3)
        {
            data["starSystemX"] = systemCoords[0];
            data["starSystemY"] = systemCoords[1];
            data["starSystemZ"] = systemCoords[2];
        }
        var evt = new Dictionary<string, object> { ["eventName"] = "setCommanderTravelLocation" };
        if (date != null) evt["eventTimestamp"] = date;
        evt["eventData"] = data!;
        return evt;
    }

    public Dictionary<string, object> SetCommanderRank(int? combat = null, int? trade = null,
        int? explore = null, int? cqc = null, int? federation = null,
        int? empire = null, int? power = null)
    {
        var data = new Dictionary<string, object>();
        if (combat.HasValue) data["combat"] = combat.Value;
        if (trade.HasValue) data["trade"] = trade.Value;
        if (explore.HasValue) data["explore"] = explore.Value;
        if (cqc.HasValue) data["cqc"] = cqc.Value;
        if (federation.HasValue) data["federation"] = federation.Value;
        if (empire.HasValue) data["empire"] = empire.Value;
        if (power.HasValue) data["power"] = power.Value;
        return new Dictionary<string, object>
        {
            ["eventName"] = "setCommanderRank",
            ["eventData"] = data,
        };
    }

    public Dictionary<string, object> SetCommanderCredits(long credits, long? loan = null, long? assets = null)
    {
        var data = new Dictionary<string, object> { ["commanderCredits"] = credits };
        if (loan.HasValue) data["commanderLoan"] = loan.Value;
        if (assets.HasValue) data["commanderAssets"] = assets.Value;
        return new Dictionary<string, object>
        {
            ["eventName"] = "setCommanderCredits",
            ["eventData"] = data,
        };
    }

    public Dictionary<string, object> SetCommanderInventory(
        List<Dictionary<string, object>>? cargo = null,
        List<Dictionary<string, object>>? materials = null,
        List<Dictionary<string, object>>? components = null,
        List<Dictionary<string, object>>? data_ = null)
    {
        var evtData = new Dictionary<string, object>();
        if (cargo != null) evtData["cargo"] = cargo;
        if (materials != null) evtData["materials"] = materials;
        if (components != null) evtData["components"] = components;
        if (data_ != null) evtData["data"] = data_;
        return new Dictionary<string, object>
        {
            ["eventName"] = "setCommanderInventory",
            ["eventData"] = evtData,
        };
    }

    public Dictionary<string, object> SetCommanderCommunityGoalProgress(int goalId,
        int contribution, double? percentile = null)
    {
        var data = new Dictionary<string, object>
        {
            ["communitygoalGameID"] = goalId,
            ["contribution"] = contribution,
        };
        if (percentile.HasValue) data["percentile"] = percentile.Value;
        return new Dictionary<string, object>
        {
            ["eventName"] = "setCommanderCommunityGoalProgress",
            ["eventData"] = data,
        };
    }

    public Dictionary<string, object> SetCommunityGoal(string name, string systemName,
        string stationName, string goalObjective, string goalExpiry,
        int? totalContributions = null)
    {
        var data = new Dictionary<string, object?>
        {
            ["communitygoalName"] = name,
            ["starSystemName"] = systemName,
            ["stationName"] = stationName,
            ["communitygoalObjective"] = goalObjective,
            ["communitygoalExpiry"] = goalExpiry,
            ["communitygoalTotalContributions"] = totalContributions,
        };
        return new Dictionary<string, object>
        {
            ["eventName"] = "setCommunityGoal",
            ["eventData"] = data,
        };
    }

    public Dictionary<string, object> AddCommanderFriend(string commanderName, string? gamePlatform = null)
    {
        var data = new Dictionary<string, object> { ["commanderName"] = commanderName };
        if (gamePlatform != null) data["gamePlatform"] = gamePlatform;
        return new Dictionary<string, object>
        {
            ["eventName"] = "addCommanderFriend",
            ["eventData"] = data,
        };
    }

    public Dictionary<string, object> DelCommanderFriend(string commanderName, string? gamePlatform = null)
    {
        var data = new Dictionary<string, object> { ["commanderName"] = commanderName };
        if (gamePlatform != null) data["gamePlatform"] = gamePlatform;
        return new Dictionary<string, object>
        {
            ["eventName"] = "delCommanderFriend",
            ["eventData"] = data,
        };
    }

    public Dictionary<string, object> AddCommanderPermit(string starsystemName) => new()
    {
        ["eventName"] = "addCommanderPermit",
        ["eventData"] = new Dictionary<string, object>
        {
            ["starSystemName"] = starsystemName,
        },
    };

    public Dictionary<string, object> SetCommanderGameStatistics(Dictionary<string, object> statistics) => new()
    {
        ["eventName"] = "setCommanderGameStatistics",
        ["eventData"] = statistics,
    };

    public Dictionary<string, object> SetCommanderRankEngineer(List<Dictionary<string, object>> entries) => new()
    {
        ["eventName"] = "setCommanderRankEngineer",
        ["eventData"] = new Dictionary<string, object>
        {
            ["engineers"] = entries,
        },
    };

    public Dictionary<string, object> SetCommanderRankEngineer(string engineerName, int rankValue)
        => SetCommanderRankEngineer(new List<Dictionary<string, object>>
        {
            new() { ["engineerName"] = engineerName, ["rankValue"] = rankValue },
        });

    public Dictionary<string, object> SetCommanderRankPilot(string rankName, int rankValue) => new()
    {
        ["eventName"] = "setCommanderRankPilot",
        ["eventData"] = new Dictionary<string, object>
        {
            ["rankName"] = rankName,
            ["rankValue"] = rankValue,
        },
    };

    public Dictionary<string, object> SetCommanderRankPilot(List<Dictionary<string, object>> entries) => new()
    {
        ["eventName"] = "setCommanderRankPilot",
        ["eventData"] = entries,
    };

    public Dictionary<string, object> SetCommanderRankPower(string powerName, int rankValue, int? meritsValue = null)
    {
        var data = new Dictionary<string, object>
        {
            ["powerName"] = powerName,
            ["rankValue"] = rankValue,
        };
        if (meritsValue.HasValue) data["meritsValue"] = meritsValue.Value;
        return new Dictionary<string, object>
        {
            ["eventName"] = "setCommanderRankPower",
            ["eventData"] = data,
        };
    }

    public Dictionary<string, object> SetCommanderReputationMajorFaction(string majorfactionName, double majorfactionReputation) => new()
    {
        ["eventName"] = "setCommanderReputationMajorFaction",
        ["eventData"] = new Dictionary<string, object>
        {
            ["majorfactionName"] = majorfactionName,
            ["majorfactionReputation"] = majorfactionReputation,
        },
    };

    public Dictionary<string, object> SetCommanderReputationMajorFaction(List<Dictionary<string, object>> entries) => new()
    {
        ["eventName"] = "setCommanderReputationMajorFaction",
        ["eventData"] = entries,
    };

    public Dictionary<string, object> SetCommanderReputationMinorFaction(string minorfactionName, double minorfactionReputation) => new()
    {
        ["eventName"] = "setCommanderReputationMinorFaction",
        ["eventData"] = new Dictionary<string, object>
        {
            ["minorfactionName"] = minorfactionName,
            ["minorfactionReputation"] = minorfactionReputation,
        },
    };

    public Dictionary<string, object> SetCommanderReputationMinorFaction(List<Dictionary<string, object>> entries) => new()
    {
        ["eventName"] = "setCommanderReputationMinorFaction",
        ["eventData"] = entries,
    };

    public Dictionary<string, object> AddCommanderInventoryItem(string itemName, int itemCount, string itemType, string? itemLocation = null)
    {
        var data = new Dictionary<string, object>
        {
            ["itemName"] = itemName,
            ["itemCount"] = itemCount,
            ["itemType"] = itemType,
        };
        if (itemLocation != null) data["itemLocation"] = itemLocation;
        return new Dictionary<string, object>
        {
            ["eventName"] = "addCommanderInventoryItem",
            ["eventData"] = data,
        };
    }

    public Dictionary<string, object> DelCommanderInventoryItem(string itemName, int itemCount, string itemType, string? itemLocation = null)
    {
        var data = new Dictionary<string, object>
        {
            ["itemName"] = itemName,
            ["itemCount"] = itemCount,
            ["itemType"] = itemType,
        };
        if (itemLocation != null) data["itemLocation"] = itemLocation;
        return new Dictionary<string, object>
        {
            ["eventName"] = "delCommanderInventoryItem",
            ["eventData"] = data,
        };
    }

    public Dictionary<string, object> ResetCommanderInventory(string itemType, string? itemLocation = null)
    {
        var data = new Dictionary<string, object> { ["itemType"] = itemType };
        if (itemLocation != null) data["itemLocation"] = itemLocation;
        return new Dictionary<string, object>
        {
            ["eventName"] = "resetCommanderInventory",
            ["eventData"] = data,
        };
    }

    public Dictionary<string, object> SetCommanderInventoryItem(string itemName, int itemCount, string itemType, string? itemLocation = null)
    {
        var data = new Dictionary<string, object>
        {
            ["itemName"] = itemName,
            ["itemCount"] = itemCount,
            ["itemType"] = itemType,
        };
        if (itemLocation != null) data["itemLocation"] = itemLocation;
        return new Dictionary<string, object>
        {
            ["eventName"] = "setCommanderInventoryItem",
            ["eventData"] = data,
        };
    }

    public Dictionary<string, object> AddCommanderInventoryCargoItem(string itemName, int itemCount, bool? isStolen = null, int? missionGameID = null)
    {
        var data = new Dictionary<string, object>
        {
            ["itemName"] = itemName,
            ["itemCount"] = itemCount,
        };
        if (isStolen.HasValue) data["isStolen"] = isStolen.Value;
        if (missionGameID.HasValue) data["missionGameID"] = missionGameID.Value;
        return new Dictionary<string, object>
        {
            ["eventName"] = "addCommanderInventoryCargoItem",
            ["eventData"] = data,
        };
    }

    public Dictionary<string, object> AddCommanderInventoryMaterialsItem(string itemName, int itemCount) => new()
    {
        ["eventName"] = "addCommanderInventoryMaterialsItem",
        ["eventData"] = new Dictionary<string, object>
        {
            ["itemName"] = itemName,
            ["itemCount"] = itemCount,
        },
    };

    public Dictionary<string, object> DelCommanderInventoryCargoItem(string itemName, int itemCount, bool? isStolen = null, int? missionGameID = null)
    {
        var data = new Dictionary<string, object>
        {
            ["itemName"] = itemName,
            ["itemCount"] = itemCount,
        };
        if (isStolen.HasValue) data["isStolen"] = isStolen.Value;
        if (missionGameID.HasValue) data["missionGameID"] = missionGameID.Value;
        return new Dictionary<string, object>
        {
            ["eventName"] = "delCommanderInventoryCargoItem",
            ["eventData"] = data,
        };
    }

    public Dictionary<string, object> DelCommanderInventoryMaterialsItem(string itemName, int itemCount) => new()
    {
        ["eventName"] = "delCommanderInventoryMaterialsItem",
        ["eventData"] = new Dictionary<string, object>
        {
            ["itemName"] = itemName,
            ["itemCount"] = itemCount,
        },
    };

    public Dictionary<string, object> SetCommanderInventoryCargo(List<Dictionary<string, object>> items) => new()
    {
        ["eventName"] = "setCommanderInventoryCargo",
        ["eventData"] = items,
    };

    public Dictionary<string, object> SetCommanderInventoryCargoItem(string itemName, int itemCount, bool? isStolen = null, int? missionGameID = null)
    {
        var data = new Dictionary<string, object>
        {
            ["itemName"] = itemName,
            ["itemCount"] = itemCount,
        };
        if (isStolen.HasValue) data["isStolen"] = isStolen.Value;
        if (missionGameID.HasValue) data["missionGameID"] = missionGameID.Value;
        return new Dictionary<string, object>
        {
            ["eventName"] = "setCommanderInventoryCargoItem",
            ["eventData"] = data,
        };
    }

    public Dictionary<string, object> SetCommanderInventoryMaterials(List<Dictionary<string, object>> items) => new()
    {
        ["eventName"] = "setCommanderInventoryMaterials",
        ["eventData"] = items,
    };

    public Dictionary<string, object> SetCommanderInventoryMaterialsItem(string itemName, int itemCount) => new()
    {
        ["eventName"] = "setCommanderInventoryMaterialsItem",
        ["eventData"] = new Dictionary<string, object>
        {
            ["itemName"] = itemName,
            ["itemCount"] = itemCount,
        },
    };

    public Dictionary<string, object> SetCommanderStorageModules(List<Dictionary<string, object>> modules) => new()
    {
        ["eventName"] = "setCommanderStorageModules",
        ["eventData"] = modules,
    };

    public Dictionary<string, object> AddCommanderShip(string shipType, int shipGameID) => new()
    {
        ["eventName"] = "addCommanderShip",
        ["eventData"] = new Dictionary<string, object>
        {
            ["shipType"] = shipType,
            ["shipGameID"] = shipGameID,
        },
    };

    public Dictionary<string, object> DelCommanderShip(string shipType, int shipGameID) => new()
    {
        ["eventName"] = "delCommanderShip",
        ["eventData"] = new Dictionary<string, object>
        {
            ["shipType"] = shipType,
            ["shipGameID"] = shipGameID,
        },
    };

    public Dictionary<string, object> SetCommanderShip(string shipType, int shipGameID, string starsystemName, string stationName, string? shipName = null, string? shipIdent = null)
    {
        var data = new Dictionary<string, object>
        {
            ["shipType"] = shipType,
            ["shipGameID"] = shipGameID,
            ["starSystemName"] = starsystemName,
            ["stationName"] = stationName,
        };
        if (shipName != null) data["shipName"] = shipName;
        if (shipIdent != null) data["shipIdent"] = shipIdent;
        return new Dictionary<string, object>
        {
            ["eventName"] = "setCommanderShip",
            ["eventData"] = data,
        };
    }

    public Dictionary<string, object> SetCommanderShipTransfer(string shipType, int shipGameID, string starsystemName, string stationName, long? marketID = null, int? transferTime = null)
    {
        var data = new Dictionary<string, object>
        {
            ["shipType"] = shipType,
            ["shipGameID"] = shipGameID,
            ["starSystemName"] = starsystemName,
            ["stationName"] = stationName,
        };
        if (marketID.HasValue) data["marketID"] = marketID.Value;
        if (transferTime.HasValue) data["transferTime"] = transferTime.Value;
        return new Dictionary<string, object>
        {
            ["eventName"] = "setCommanderShipTransfer",
            ["eventData"] = data,
        };
    }

    public Dictionary<string, object> DelCommanderSuitLoadout(long loadoutGameID) => new()
    {
        ["eventName"] = "delCommanderSuitLoadout",
        ["eventData"] = new Dictionary<string, object> { ["loadoutGameID"] = loadoutGameID },
    };

    public Dictionary<string, object> SetCommanderSuitLoadout(Dictionary<string, object> data) => new()
    {
        ["eventName"] = "setCommanderSuitLoadout",
        ["eventData"] = data,
    };

    public Dictionary<string, object> UpdateCommanderSuitLoadout(Dictionary<string, object> data) => new()
    {
        ["eventName"] = "updateCommanderSuitLoadout",
        ["eventData"] = data,
    };

    public Dictionary<string, object> AddCommanderTravelLand(string starsystemName, string bodyName) => new()
    {
        ["eventName"] = "addCommanderTravelLand",
        ["eventData"] = new Dictionary<string, object>
        {
            ["starsystemName"] = starsystemName,
            ["starsystemBodyName"] = bodyName,
        },
    };

    public Dictionary<string, object> AddCommanderMission(string missionName, int missionGameID, string? starsystemName = null, string? stationName = null, string? minorFactionName = null, int? influenceValue = null, string? reputationValue = null, long? reward = null)
    {
        var data = new Dictionary<string, object>
        {
            ["missionName"] = missionName,
            ["missionGameID"] = missionGameID,
        };
        if (starsystemName != null) data["starSystemName"] = starsystemName;
        if (stationName != null) data["stationName"] = stationName;
        if (minorFactionName != null) data["minorFactionName"] = minorFactionName;
        if (influenceValue.HasValue) data["influenceValue"] = influenceValue.Value;
        if (reputationValue != null) data["reputationValue"] = reputationValue;
        if (reward.HasValue) data["reward"] = reward.Value;
        return new Dictionary<string, object>
        {
            ["eventName"] = "addCommanderMission",
            ["eventData"] = data,
        };
    }

    public Dictionary<string, object> SetCommanderMissionAbandoned(int missionGameID) => new()
    {
        ["eventName"] = "setCommanderMissionAbandoned",
        ["eventData"] = new Dictionary<string, object>
        {
            ["missionGameID"] = missionGameID,
        },
    };

    public Dictionary<string, object> SetCommanderMissionCompleted(int missionGameID) => new()
    {
        ["eventName"] = "setCommanderMissionCompleted",
        ["eventData"] = new Dictionary<string, object>
        {
            ["missionGameID"] = missionGameID,
        },
    };

    public Dictionary<string, object> SetCommanderMissionFailed(int missionGameID) => new()
    {
        ["eventName"] = "setCommanderMissionFailed",
        ["eventData"] = new Dictionary<string, object>
        {
            ["missionGameID"] = missionGameID,
        },
    };

    public Dictionary<string, object> AddCommanderCombatDeath(string starsystemName, string? opponentName = null, string? opponentShipType = null, bool? isPlayer = null)
    {
        var data = new Dictionary<string, object> { ["starSystemName"] = starsystemName };
        if (opponentName != null) data["opponentName"] = opponentName;
        if (opponentShipType != null) data["opponentShipType"] = opponentShipType;
        if (isPlayer.HasValue) data["isPlayer"] = isPlayer.Value;
        return new Dictionary<string, object>
        {
            ["eventName"] = "addCommanderCombatDeath",
            ["eventData"] = data,
        };
    }

    public Dictionary<string, object> AddCommanderCombatInterdicted(string starsystemName, string opponentName, bool isPlayer, string? combatResult = null)
    {
        var data = new Dictionary<string, object>
        {
            ["starSystemName"] = starsystemName,
            ["opponentName"] = opponentName,
            ["isPlayer"] = isPlayer,
        };
        if (combatResult != null) data["combatResult"] = combatResult;
        return new Dictionary<string, object>
        {
            ["eventName"] = "addCommanderCombatInterdicted",
            ["eventData"] = data,
        };
    }

    public Dictionary<string, object> AddCommanderCombatInterdiction(string starsystemName, string opponentName, bool isPlayer, string? combatResult = null)
    {
        var data = new Dictionary<string, object>
        {
            ["starSystemName"] = starsystemName,
            ["opponentName"] = opponentName,
            ["isPlayer"] = isPlayer,
        };
        if (combatResult != null) data["combatResult"] = combatResult;
        return new Dictionary<string, object>
        {
            ["eventName"] = "addCommanderCombatInterdiction",
            ["eventData"] = data,
        };
    }

    public Dictionary<string, object> AddCommanderCombatInterdictionEscape(string starsystemName, string opponentName, bool isPlayer) => new()
    {
        ["eventName"] = "addCommanderCombatInterdictionEscape",
        ["eventData"] = new Dictionary<string, object>
        {
            ["starSystemName"] = starsystemName,
            ["opponentName"] = opponentName,
            ["isPlayer"] = isPlayer,
        },
    };

    public Dictionary<string, object> AddCommanderCombatKill(string starsystemName, string? opponentName = null, string? opponentShipType = null, bool? isPlayer = null)
    {
        var data = new Dictionary<string, object> { ["starSystemName"] = starsystemName };
        if (opponentName != null) data["opponentName"] = opponentName;
        if (opponentShipType != null) data["opponentShipType"] = opponentShipType;
        if (isPlayer.HasValue) data["isPlayer"] = isPlayer.Value;
        return new Dictionary<string, object>
        {
            ["eventName"] = "addCommanderCombatKill",
            ["eventData"] = data,
        };
    }

    public Dictionary<string, object> GetCommunityGoalsRecent(string? starsystemName = null)
    {
        var evt = new Dictionary<string, object> { ["eventName"] = "getCommunityGoalsRecent" };
        if (starsystemName != null)
        {
            evt["eventData"] = new Dictionary<string, object>
            {
                ["starSystemName"] = starsystemName,
            };
        }
        return evt;
    }
}
