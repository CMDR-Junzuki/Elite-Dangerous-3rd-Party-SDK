param(
  [string]$OutputDir = "G:\Projects\Elite 3rd PArty SDK\specs\journal\events"
)

$ErrorActionPrevention = "Stop"

# Property type helpers
function Str { @{ type = "string" } }
function StrE { param($e) @{ type = "string"; enum = @($e) } }
function Num { @{ type = "number" } }
function Int { @{ type = "integer" } }
function Bool { @{ type = "boolean" } }
function StrArr { @{ type = "array"; items = @{ type = "string" } } }
function Obj { param($p) @{ type = "object"; properties = $p } }
function IntOrStr { @{ oneOf = @(@{ type = "integer" }, @{ type = "string" }) } }

# Define all events and their properties
$events = @(
  @{
    name = "SupercruiseEntry"
    desc = "Ship entered supercruise"
    props = @{
      System = Str
      SystemAddress = Int
    }
  }
  @{
    name = "SupercruiseExit"
    desc = "Ship exited supercruise into normal space"
    props = @{
      System = Str
      SystemAddress = Int
      Body = Str
      BodyID = Int
      BodyType = Str
    }
  }
  @{
    name = "Touchdown"
    desc = "Ship touched down on a planet surface"
    props = @{
      System = Str
      SystemAddress = Int
      Body = Str
      BodyID = Int
      OnPlanet = Bool
      OnStation = Bool
      Latitude = Num
      Longitude = Num
      PlayerControlled = Bool
    }
  }
  @{
    name = "Liftoff"
    desc = "Ship lifted off from a planet surface"
    props = @{
      System = Str
      SystemAddress = Int
      Body = Str
      BodyID = Int
      OnPlanet = Bool
      OnStation = Bool
      Latitude = Num
      Longitude = Num
      PlayerControlled = Bool
    }
  }
  @{
    name = "Undocked"
    desc = "Ship undocked from a station"
    props = @{
      StationName = Str
      StationType = Str
      MarketID = Int
    }
  }
  @{
    name = "Undocking"
    desc = "Ship requested undocking (startup)"
    props = @{
      StationName = Str
      MarketID = Int
    }
  }
  @{
    name = "StartJump"
    desc = "Ship started a hyperspace or supercruise jump"
    props = @{
      JumpType = StrE @("Hyperspace", "Supercruise")
      StarSystem = Str
      SystemAddress = Int
      Body = Str
      BodyID = Int
    }
  }
  @{
    name = "FuelScoop"
    desc = "Fuel scooped from a star"
    props = @{
      Scooped = Num
      Total = Num
    }
  }
  @{
    name = "MaterialCollected"
    desc = "Material collected during gameplay"
    props = @{
      Category = StrE @("Raw", "Manufactured", "Encoded")
      Name = Str
      Name_Localised = Str
      Count = Int
    }
  }
  @{
    name = "MaterialDiscarded"
    desc = "Material discarded from inventory"
    props = @{
      Category = StrE @("Raw", "Manufactured", "Encoded")
      Name = Str
      Name_Localised = Str
      Count = Int
    }
  }
  @{
    name = "MaterialDiscovered"
    desc = "New material discovered"
    props = @{
      Category = StrE @("Raw", "Manufactured", "Encoded")
      Name = Str
      Name_Localised = Str
      DiscoveryNumber = Int
    }
  }
  @{
    name = "MaterialTrade"
    desc = "Material traded at a material trader"
    props = @{
      MarketID = Int
      TraderType = Str
      Traded = (Obj @{
        Material = Str; Material_Localised = Str
        Category = Str; Category_Localised = Str
        Quantity = Int
      })
      Received = (Obj @{
        Material = Str; Material_Localised = Str
        Category = Str; Category_Localised = Str
        Quantity = Int
      })
    }
  }
  @{
    name = "EngineerCraft"
    desc = "Module modification crafted by an engineer"
    props = @{
      Engineer = Str
      EngineerID = Int
      Blueprint = Str
      BlueprintID = Int
      Level = Int
      Quality = Num
      ExperimentalEffect = Str
      ExperimentalEffect_Localised = Str
      Ingredients = @{
        type = "array"
        items = (Obj @{ Name = Str; Name_Localised = Str; Quantity = Int })
      }
      Modifiers = @{
        type = "array"
        items = (Obj @{
          Label = Str; Value = Num; OriginalValue = Num
          LessIsGood = Bool; ValueStr = Str
        })
      }
    }
  }
  @{
    name = "EngineerApply"
    desc = "Experimental effect applied by an engineer"
    props = @{
      Engineer = Str
      Blueprint = Str
      BlueprintID = Int
      Level = Int
    }
  }
  @{
    name = "EngineerProgress"
    desc = "Engineer progress/rank information"
    props = @{
      Engineers = @{
        type = "array"
        items = (Obj @{
          Engineer = Str; EngineerID = Int
          Progress = StrE @("Unlocked", "Invited", "Known", "AlreadyKnown")
          RankProgress = Int; Rank = Int
        })
      }
    }
  }
  @{
    name = "Synthesis"
    desc = "Synthesis performed"
    props = @{
      Name = Str
      Name_Localised = Str
      Materials = @{
        type = "array"
        items = (Obj @{ Name = Str; Name_Localised = Str; Count = Int })
      }
    }
  }
  @{
    name = "Bounty"
    desc = "Bounty awarded for a kill"
    props = @{
      Target = Str
      Target_Localised = Str
      TotalReward = Int
      VictimFaction = Str
      SharedWithOthers = Int
      Faction = Str
      Rewards = @{
        type = "array"
        items = (Obj @{
          Faction = Str; Reward = Int
          VictimFaction = Str
          Legacy = Int
        })
      }
    }
  }
  @{
    name = "Promotion"
    desc = "Player received a rank promotion"
    props = @{
      Combat = Int
      Trade = Int
      Explore = Int
      CQC = Int
      Empire = Int
      Federation = Int
      Soldier = Int
      Exobiologist = Int
    }
  }
  @{
    name = "Progress"
    desc = "Progress toward next rank"
    props = @{
      Combat = Num
      Trade = Num
      Explore = Num
      CQC = Num
      Empire = Num
      Federation = Num
      Soldier = Num
      Exobiologist = Num
    }
  }
  @{
    name = "Rank"
    desc = "Player's current rank values"
    props = @{
      Combat = Int
      Trade = Int
      Explore = Int
      CQC = Int
      Empire = Int
      Federation = Int
      Soldier = Int
      Exobiologist = Int
    }
  }
  @{
    name = "CommitCrime"
    desc = "Crime committed by the player"
    props = @{
      CrimeType = Str
      Faction = Str
      Fine = Int
      Bounty = Int
      Victim = Str
      Victim_Localised = Str
    }
  }
  @{
    name = "RedeemVoucher"
    desc = "Voucher redeemed at a station"
    props = @{
      Type = StrE @("bounty", "combatbond", "settlement", "scannable", "codewh")
      Amount = Int
      Factions = @{
        type = "array"
        items = (Obj @{ Faction = Str; Amount = Int })
      }
    }
  }
  @{
    name = "MissionAccepted"
    desc = "Mission accepted by the player"
    props = @{
      MissionID = Int
      Name = Str
      Name_Localised = Str
      PassengerMission = Bool
      Expiry = Str
      Influence = Str
      Reputation = Str
      Reward = Int
      Commodity = Str
      Commodity_Localised = Str
      Count = Int
      TargetFaction = Str
      DestinationSystem = Str
      DestinationStation = Str
      Target = Str
      Target_Localised = Str
      TargetType = Str
      TargetType_Localised = Str
      KillCount = Int
      Faction = Str
      Wing = Bool
      Donation = Str
      Donated = Int
      LocalisedName = Str
      TargetCommodity = Str
      TargetCommodity_Localised = Str
      MinJumps = Int
      PassengerCount = Int
      PassengerVIPs = Bool
      PassengerWanted = Bool
      PassengerType = Str
      InfluenceGain = Str
      ReputationGain = Str
      MaterialsRequired = @{
        type = "array"
        items = (Obj @{
          Name = Str; Name_Localised = Str
          Category = Str; Category_Localised = Str
          Count = Int
        })
      }
      CommodityReward = @{
        type = "array"
        items = (Obj @{ Name = Str; Name_Localised = Str; Count = Int })
      }
    }
  }
  @{
    name = "MissionCompleted"
    desc = "Mission completed by the player"
    props = @{
      MissionID = Int
      Name = Str
      Name_Localised = Str
      Faction = Str
      Commodity = Str
      Commodity_Localised = Str
      Count = Int
      TargetFaction = Str
      Reward = Int
      Donation = Str
      Donated = Int
      PermitsAwarded = @{ type = "array"; items = (Obj @{ Permit = Str }) }
      CommodityReward = @{
        type = "array"
        items = (Obj @{ Name = Str; Name_Localised = Str; Count = Int })
      }
      MaterialsReward = @{
        type = "array"
        items = (Obj @{
          Name = Str; Name_Localised = Str
          Category = Str; Category_Localised = Str
          Count = Int
        })
      }
      FactionEffect = @{
        type = "array"
        items = (Obj @{
          Faction = Str
          Effects = @{
            type = "array"
            items = (Obj @{ Effect = Str; Effect_Localised = Str; Trend = Str })
          }
          Influence = (Obj @{
            SystemAddress = Int; Trend = Str; Influence = Str
          })
          Reputation = Str
          ReputationTrend = Str
        })
      }
      DestinationSystem = Str
      DestinationStation = Str
      KillCount = Int
      RewardDetail = Str
      RewardDetail_Localised = Str
    }
  }
  @{
    name = "MissionFailed"
    desc = "Mission failed"
    props = @{
      MissionID = Int
      Name = Str
      Name_Localised = Str
      Faction = Str
      Fine = Int
    }
  }
  @{
    name = "MissionAbandoned"
    desc = "Mission abandoned by the player"
    props = @{
      MissionID = Int
      Name = Str
      Name_Localised = Str
      Fine = Int
    }
  }
  @{
    name = "MissionRedirected"
    desc = "Mission destination changed"
    props = @{
      MissionID = Int
      Name = Str
      Name_Localised = Str
      NewDestinationStation = Str
      NewDestinationSystem = Str
      OldDestinationStation = Str
      OldDestinationSystem = Str
    }
  }
  @{
    name = "CommunityGoal"
    desc = "List of active community goals"
    props = @{
      CurrentGoals = @{
        type = "array"
        items = (Obj @{
          CGID = Int; Title = Str; Title_Localised = Str
          SystemName = Str; MarketName = Str
          Expiry = Str; IsComplete = Bool
          CurrentTotal = Int; PlayerContribution = Int
          NumContributors = Int; TopRankSize = Int
          TopTier = (Obj @{ Name = Str; Name_Localised = Str; Bonus = Str; Bonus_Localised = Str })
          TierReached = Str; PlayerPercentileBand = Int
          Bonus = Int
        })
      }
    }
  }
  @{
    name = "CommunityGoalJoin"
    desc = "Player joined a community goal"
    props = @{
      CGID = Int
      Name = Str
      Name_Localised = Str
      SystemName = Str
      MarketName = Str
    }
  }
  @{
    name = "CommunityGoalReward"
    desc = "Reward collected from a community goal"
    props = @{
      CGID = Int
      Name = Str
      Name_Localised = Str
      SystemName = Str
      MarketName = Str
      Reward = Int
      DetailReward = Int
    }
  }
  @{
    name = "CommunityGoalDiscard"
    desc = "Community goal discarded"
    props = @{
      CGID = Int
      Name = Str
      Name_Localised = Str
      SystemName = Str
      MarketName = Str
    }
  }
  @{
    name = "Screenshot"
    desc = "Screenshot taken"
    props = @{
      Filename = Str
      Width = Int
      Height = Int
      System = Str
      SystemAddress = Int
      Body = Str
      BodyID = Int
      Latitude = Num
      Longitude = Num
      Heading = Num
      Altitude = Num
    }
  }
  @{
    name = "Music"
    desc = "Music track change"
    props = @{
      MusicTrack = Str
    }
  }
  @{
    name = "SendText"
    desc = "Player sent a text message"
    props = @{
      To = Str
      To_Localised = Str
      Message = Str
      Sent = Bool
    }
  }
  @{
    name = "ReceiveText"
    desc = "Player received a text message"
    props = @{
      From = Str
      From_Localised = Str
      Message = Str
      Message_Localised = Str
      Channel = Str
    }
  }
  @{
    name = "LaunchFighter"
    desc = "Fighter launched"
    props = @{
      Loadout = Str
      Loadout_Localised = Str
      PlayerControlled = Bool
    }
  }
  @{
    name = "LaunchSRV"
    desc = "SRV launched"
    props = @{
      Loadout = Str
      Loadout_Localised = Str
      PlayerControlled = Bool
      ID = Int
    }
  }
  @{
    name = "DockFighter"
    desc = "Fighter docked"
    props = @{
      ID = Int
    }
  }
  @{
    name = "DockSRV"
    desc = "SRV docked"
    props = @{
      ID = Int
    }
  }
  @{
    name = "FighterDestroyed"
    desc = "Fighter destroyed"
    props = @{ ID = Int }
  }
  @{
    name = "SRVDestroyed"
    desc = "SRV destroyed"
    props = @{ ID = Int }
  }
  @{
    name = "HullDamage"
    desc = "Ship hull damage taken"
    props = @{
      Health = Num
      PlayerPilot = Bool
      Fighter = Bool
    }
  }
  @{
    name = "ShieldState"
    desc = "Shield state change"
    props = @{
      ShieldsUp = Bool
    }
  }
  @{
    name = "HeatWarning"
    desc = "Ship heat warning triggered"
    props = @{}
  }
  @{
    name = "HeatDamage"
    desc = "Ship heat damage taken"
    props = @{}
  }
  @{
    name = "FuelStatus"
    desc = "Fuel status information"
    props = @{
      FuelMain = Num
      FuelReservoir = Num
    }
  }
  @{
    name = "SelfDestruct"
    desc = "Self-destruct sequence initiated"
    props = @{}
  }
  @{
    name = "Died"
    desc = "Player died"
    props = @{
      KillerName = Str
      KillerName_Localised = Str
      KillerShip = Str
      KillerRank = Str
      Killers = @{
        type = "array"
        items = (Obj @{ Name = Str; Name_Localised = Str; Ship = Str; Rank = Str })
      }
    }
  }
  @{
    name = "Resurrect"
    desc = "Player resurrected after death"
    props = @{
      Option = Str
      Cost = Int
      Bankrupt = Bool
    }
  }
  @{
    name = "ApproachBody"
    desc = "Approaching a celestial body"
    props = @{
      System = Str
      SystemAddress = Int
      Body = Str
      BodyID = Int
    }
  }
  @{
    name = "LeaveBody"
    desc = "Leaving a celestial body's vicinity"
    props = @{
      System = Str
      SystemAddress = Int
      Body = Str
      BodyID = Int
    }
  }
  @{
    name = "NavBeaconScan"
    desc = "Navigation beacon scan completed"
    props = @{
      SystemAddress = Int
      NumBodies = Int
    }
  }
  @{
    name = "FSSSignalDiscovered"
    desc = "Signal source discovered via FSS"
    props = @{
      SystemAddress = Int
      SignalName = Str
      SignalName_Localised = Str
      USSType = Str
      USSType_Localised = Str
      SpawningState = Str
      SpawningFaction = Str
      ThargoidWar = Str
    }
  }
  @{
    name = "FSSBodySignals"
    desc = "Body signal info from FSS scan"
    props = @{
      SystemAddress = Int
      BodyName = Str
      BodyID = Int
      Signals = @{
        type = "array"
        items = (Obj @{ Type = Str; Type_Localised = Str; Count = Int })
      }
    }
  }
  @{
    name = "SAASignalsFound"
    desc = "Signals found after detailed surface scan"
    props = @{
      SystemAddress = Int
      BodyName = Str
      BodyID = Int
      Signals = @{
        type = "array"
        items = (Obj @{ Type = Str; Type_Localised = Str; Count = Int })
      }
      Genuses = @{
        type = "array"
        items = (Obj @{ Genus = Str; Genus_Localised = Str })
      }
    }
  }
  @{
    name = "DockingRequested"
    desc = "Docking request submitted"
    props = @{
      StationName = Str
      StationType = Str
      MarketID = Int
      LandingPad = Int
    }
  }
  @{
    name = "DockingGranted"
    desc = "Docking request granted"
    props = @{
      StationName = Str
      StationType = Str
      MarketID = Int
      LandingPad = Int
    }
  }
  @{
    name = "DockingDenied"
    desc = "Docking request denied"
    props = @{
      StationName = Str
      StationType = Str
      MarketID = Int
      Reason = Str
    }
  }
  @{
    name = "DockingCancelled"
    desc = "Docking request cancelled"
    props = @{
      StationName = Str
      MarketID = Int
    }
  }
  @{
    name = "DockingTimeout"
    desc = "Docking request timed out"
    props = @{
      StationName = Str
      MarketID = Int
    }
  }
  @{
    name = "CarrierJump"
    desc = "Fleet carrier jumped to new system"
    props = @{
      System = Str
      SystemAddress = Int
      Body = Str
      BodyID = Int
    }
  }
  @{
    name = "CarrierJumpRequest"
    desc = "Fleet carrier jump requested"
    props = @{
      System = Str
      SystemAddress = Int
      Body = Str
      BodyID = Int
      DepartureTime = Str
    }
  }
  @{
    name = "CarrierStats"
    desc = "Fleet carrier stats"
    props = @{
      CarrierID = Int
      Callsign = Str
      Name = Str
      Name_Localised = Str
      DockingAccess = Str
      AllowNotorious = Bool
      FuelLevel = Num
      JumpRangeCurr = Num
      JumpRangeMax = Num
      PendingDecommision = Bool
      SpaceAccess = Str
      Shipyard = Bool
      Outfitting = Bool
      Rearm = Bool
      Refuel = Bool
      Repair = Bool
      Market = Bool
      VoucherMarket = Bool
      ExoBiology = Bool
      VoucherExploration = Bool
      VoucherTrade = Bool
      Theme = Str
      Pack = @{ type = "array"; items = (Obj @{
        PackTheme = Str; PackTheme_Localised = Str
        PackTier = Int
      }) }
    }
  }
  @{
    name = "CarrierFinance"
    desc = "Fleet carrier finance info"
    props = @{
      CarrierID = Int
      ReserveBalance = Int
      AvailableBalance = Int
      ReservePercent = Int
      TaxRate = Int
    }
  }
  @{
    name = "CarrierBuy"
    desc = "Fleet carrier purchased"
    props = @{
      CarrierID = Int
      Location = Str
      SystemAddress = Int
      Price = Int
      Variant = Str
      Callsign = Str
    }
  }
  @{
    name = "CarrierSell"
    desc = "Fleet carrier sold"
    props = @{
      CarrierID = Int
      Location = Str
      SystemAddress = Int
      Price = Int
      Callsign = Str
    }
  }
  @{
    name = "CarrierShipPack"
    desc = "Fleet carrier ship pack bought/sold"
    props = @{
      CarrierID = Int
      Operation = StrE @("BuyPack", "SellPack")
      PackTheme = Str
      PackTheme_Localised = Str
      PackTier = Int
      Cost = Int
    }
  }
  @{
    name = "CarrierModulePack"
    desc = "Fleet carrier module pack bought/sold"
    props = @{
      CarrierID = Int
      Operation = StrE @("BuyPack", "SellPack")
      PackTheme = Str
      PackTheme_Localised = Str
      PackTier = Int
      Cost = Int
    }
  }
  @{
    name = "CarrierTradeOrder"
    desc = "Fleet carrier trade order"
    props = @{
      CarrierID = Int
      BlackMarket = Bool
      Commodity = Str
      Commodity_Localised = Str
      PurchaseOrder = Int
      SaleOrder = Int
      CancelTrade = Bool
      Price = Int
      Stock = Int
    }
  }
  @{
    name = "CarrierDeploy"
    desc = "Fleet carrier deployed"
    props = @{
      CarrierID = Int
      System = Str
      SystemAddress = Int
      Body = Str
      BodyID = Int
    }
  }
  @{
    name = "CarrierNameChange"
    desc = "Fleet carrier renamed"
    props = @{
      CarrierID = Int
      Callsign = Str
      Name = Str
      Name_Localised = Str
    }
  }
  @{
    name = "CarrierCrewService"
    desc = "Fleet carrier crew service"
    props = @{
      CarrierID = Int
      Operation = StrE @("Activate", "Deactivate")
      CrewRole = Str
      CrewName = Str
    }
  }
  @{
    name = "CarrierBankTransfer"
    desc = "Fleet carrier bank transfer"
    props = @{
      CarrierID = Int
      Deposit = Int
      Withdraw = Int
      PlayerBalance = Int
      CarrierBalance = Int
    }
  }
  @{
    name = "CollectItems"
    desc = "Items collected from space"
    props = @{
      Name = Str
      Name_Localised = Str
      Type = Str
      OwnerID = Int
      MissionID = Int
      Stolen = Bool
    }
  }
  @{
    name = "EjectCargo"
    desc = "Cargo ejected"
    props = @{
      Type = Str
      Type_Localised = Str
      Count = Int
      Abandoned = Bool
      MissionID = Int
      Powerplay = Bool
    }
  }
  @{
    name = "MiningRefined"
    desc = "Mining refinery produced a commodity"
    props = @{
      Type = Str
      Type_Localised = Str
      Commodity_Localised = Str
    }
  }
  @{
    name = "ProspectedAsteroid"
    desc = "Asteroid prospected"
    props = @{
      Materials = @{
        type = "array"
        items = (Obj @{ Name = Str; Name_Localised = Str; Proportion = Num })
      }
      Content = Str
      Content_Localised = Str
      Remaining = Num
      MotherlodeMaterial = Str
      MotherlodeMaterial_Localised = Str
      MotherlodeProportion = Num
    }
  }
  @{
    name = "ReservoirReplenished"
    desc = "Fuel reservoir replenished"
    props = @{
      FuelMain = Num
      FuelReservoir = Num
    }
  }
  @{
    name = "RefuelPartial"
    desc = "Partial refuel"
    props = @{
      Cost = Int
      Amount = Num
    }
  }
  @{
    name = "RefuelAll"
    desc = "Full refuel"
    props = @{
      Cost = Int
      Amount = Num
    }
  }
  @{
    name = "Repair"
    desc = "Repair of a specific item"
    props = @{
      Item = Str
      Item_Localised = Str
      Cost = Int
    }
  }
  @{
    name = "RepairAll"
    desc = "Full repair of ship"
    props = @{
      Cost = Int
    }
  }
  @{
    name = "BuyAmmo"
    desc = "Ammunition purchased"
    props = @{ Cost = Int }
  }
  @{
    name = "BuyDrones"
    desc = "Drones purchased"
    props = @{
      Type = Str
      Type_Localised = Str
      Count = Int
      BuyPrice = Int
      TotalCost = Int
    }
  }
  @{
    name = "SellDrones"
    desc = "Drones sold"
    props = @{
      Type = Str
      Type_Localised = Str
      Count = Int
      SellPrice = Int
      TotalSale = Int
    }
  }
  @{
    name = "BuyTradeData"
    desc = "Trade data purchased"
    props = @{
      System = Str
      Cost = Int
    }
  }
  @{
    name = "MarketBuy"
    desc = "Goods purchased at market"
    props = @{
      MarketID = Int
      Type = Str
      Type_Localised = Str
      Count = Int
      BuyPrice = Int
      TotalCost = Int
    }
  }
  @{
    name = "MarketSell"
    desc = "Goods sold at market"
    props = @{
      MarketID = Int
      Type = Str
      Type_Localised = Str
      Count = Int
      SellPrice = Int
      TotalSale = Int
      AvgPricePaid = Int
      Stolen = Bool
      IllegalGoods = Bool
      BlackMarket = Bool
    }
  }
  @{
    name = "BuyExplorationData"
    desc = "Exploration data purchased"
    props = @{
      System = Str
      Cost = Int
    }
  }
  @{
    name = "SellExplorationData"
    desc = "Exploration data sold"
    props = @{
      Systems = @{ type = "array"; items = (Obj @{ Name = Str; SystemAddress = Int }) }
      Discovered = @{ type = "array"; items = (Obj @{ SystemName = Str; NumBodies = Int }) }
      BaseValue = Int
      Bonus = Int
      TotalEarnings = Int
    }
  }
  @{
    name = "DataScanned"
    desc = "Data point scanned"
    props = @{
      Type = Str
      Type_Localised = Str
    }
  }
  @{
    name = "AfmuRepairs"
    desc = "AFMU repairs completed"
    props = @{
      Module = Str
      Module_Localised = Str
      FullyRepaired = Bool
      Health = Num
    }
  }
  @{
    name = "RebootRepair"
    desc = "Reboot/repair sequence"
    props = @{
      Modules = @{ type = "array"; items = (Obj @{ Module = Str; Module_Localised = Str; Slot = Str }) }
    }
  }
  @{
    name = "RestockVehicle"
    desc = "Vehicle restocked on carrier"
    props = @{
      Type = Str
      Loadout = Str
      Loadout_Localised = Str
      Cost = Int
      Count = Int
    }
  }
  @{
    name = "Continued"
    desc = "Journal continuation marker (split file)"
    props = @{
      Part = Int
    }
  }
  @{
    name = "Shutdown"
    desc = "Game shutdown"
    props = @{}
  }
  @{
    name = "ModuleInfo"
    desc = "Module information"
    props = @{
      Modules = @{
        type = "array"
        items = (Obj @{
          Slot = Str; Item = Str; Item_Localised = Str
          On = Bool; Priority = Int; Health = Num
          Value = Int; AmmoClip = Int; AmmoHopper = Int
          Engineering = (Obj @{
            Engineer = Str; BlueprintID = Int; BlueprintName = Str
            Level = Int; Quality = Num
            ExperimentalEffect = Str; ExperimentalEffect_Localised = Str
            Modifiers = @{
              type = "array"
              items = (Obj @{
                Label = Str; Value = Num; OriginalValue = Num
                LessIsGood = Bool; ValueStr = Str
              })
            }
          })
        })
      }
    }
  }
  @{
    name = "NavRoute"
    desc = "Current nav route"
    props = @{
      Route = @{
        type = "array"
        items = (Obj @{
          StarSystem = Str; SystemAddress = Int
          StarPos = @{ type = "array"; items = (Obj @{ type = "number" }); minItems = 3; maxItems = 3 }
        })
      }
    }
  }
  @{
    name = "NavRouteClear"
    desc = "Nav route cleared"
    props = @{}
  }
  @{
    name = "ShipTargeted"
    desc = "Targeted ship information"
    props = @{
      TargetLocked = Bool
      Ship = Str
      Ship_Localised = Str
      ScanStage = Int
      PilotName = Str
      PilotName_Localised = Str
      PilotRank = Str
      ShieldHealth = Num
      HullHealth = Num
      Faction = Str
      LegalStatus = Str
      SquadronID = Int
      Power = Str
    }
  }
  @{
    name = "CapShipBond"
    desc = "Capital ship bond awarded"
    props = @{
      AwardingFaction = Str
      AwardingFaction_Localised = Str
      VictimFaction = Str
      VictimFaction_Localised = Str
      Amount = Int
      PlayerPilot = Bool
      Fighter = Bool
    }
  }
  @{
    name = "FactionKillBond"
    desc = "Faction kill bond awarded"
    props = @{
      AwardingFaction = Str
      AwardingFaction_Localised = Str
      VictimFaction = Str
      VictimFaction_Localised = Str
      Amount = Int
    }
  }
  @{
    name = "PVPKill"
    desc = "Player kill in PvP"
    props = @{
      Victim = Str
      Victim_Localised = Str
      CombatRank = Int
    }
  }
  @{
    name = "PayFines"
    desc = "Fines paid"
    props = @{
      Amount = Int
      AllFines = Bool
      BrokerPercentage = Num
    }
  }
  @{
    name = "PayLegacyFines"
    desc = "Legacy fines paid"
    props = @{
      Amount = Int
      BrokerPercentage = Num
    }
  }
  @{
    name = "SquadronStartup"
    desc = "Squadron info on game startup"
    props = @{
      SquadronName = Str
      SquadronRank = Str
      SquadronAlignedPower = Str
      SquadronHomeSystem = Str
      SquadronFaction = Str
      SquadronPowerplayState = Str
      CurrentRating = Int
      Rating = @{ type = "array"; items = (Obj @{ Name = Str; Rank = Int }) }
      SquadronID = Int
    }
  }
  @{
    name = "InvitedToSquadron"
    desc = "Invited to a squadron"
    props = @{
      SquadronName = Str
      InviterName = Str
      InviterName_Localised = Str
    }
  }
  @{
    name = "JoinedSquadron"
    desc = "Joined a squadron"
    props = @{
      SquadronName = Str
    }
  }
  @{
    name = "SquadronCreated"
    desc = "Squadron created"
    props = @{
      SquadronName = Str
    }
  }
  @{
    name = "AppliedToSquadron"
    desc = "Applied to join a squadron"
    props = @{
      SquadronName = Str
    }
  }
  @{
    name = "SquadronDemotion"
    desc = "Demoted within squadron"
    props = @{
      SquadronName = Str
      OldRank = Int
      NewRank = Int
    }
  }
  @{
    name = "SquadronPromotion"
    desc = "Promoted within squadron"
    props = @{
      SquadronName = Str
      OldRank = Int
      NewRank = Int
    }
  }
  @{
    name = "DisbandedSquadron"
    desc = "Squadron disbanded"
    props = @{
      SquadronName = Str
    }
  }
  @{
    name = "LeftSquadron"
    desc = "Left a squadron"
    props = @{
      SquadronName = Str
      OldRank = Int
    }
  }
  @{
    name = "KickedFromSquadron"
    desc = "Kicked from squadron"
    props = @{
      SquadronName = Str
    }
  }
  @{
    name = "SquadronKicked"
    desc = "Squadron kicked a member"
    props = @{
      SquadronName = Str
      PlayerName = Str
    }
  }
  @{
    name = "QuitACrew"
    desc = "Quit a multicrew session"
    props = @{
      Captain = Str
    }
  }
  @{
    name = "JoinACrew"
    desc = "Joined a multicrew session"
    props = @{
      Captain = Str
      Captain_Localised = Str
    }
  }
  @{
    name = "ChangeCrewAssignedRole"
    desc = "Crew role changed"
    props = @{
      Role = StrE @("Idle", "FighterCon", "FireCon", "Turret")
    }
  }
  @{
    name = "CrewHire"
    desc = "Crew member hired"
    props = @{
      Name = Str
      Faction = Str
      Cost = Int
      CombatRank = Int
    }
  }
  @{
    name = "CrewFire"
    desc = "Crew member fired"
    props = @{
      Name = Str
      CombatRank = Int
    }
  }
  @{
    name = "CrewLaunchFighter"
    desc = "Crew launched fighter"
    props = @{
      Crew = Str
      ID = Int
      Loadout = Str
      Loadout_Localised = Str
    }
  }
  @{
    name = "CrewRoleRepair"
    desc = "Crew role repaired"
    props = @{
      CrewID = Int
    }
  }
  @{
    name = "CrewMemberJoins"
    desc = "Crew member joins ship"
    props = @{
      Crew = Str
      CombatRank = Int
      Telepresence = Bool
    }
  }
  @{
    name = "CrewMemberQuits"
    desc = "Crew member leaves"
    props = @{
      Crew = Str
      Telepresence = Bool
    }
  }
  @{
    name = "CrewMemberRoleChange"
    desc = "Crew member role changed"
    props = @{
      Crew = Str
      Role = StrE @("Idle", "FighterCon", "FireCon", "Turret")
      Telepresence = Bool
    }
  }
  @{
    name = "KickCrewMember"
    desc = "Crew member kicked"
    props = @{
      Crew = Str
      Telepresence = Bool
    }
  }
  @{
    name = "EndCrewSession"
    desc = "Crew session ended"
    props = @{}
  }
  @{
    name = "WingJoin"
    desc = "Joined a wing"
    props = @{
      Others = @{ type = "array"; items = (Obj @{ Name = Str }) }
    }
  }
  @{
    name = "WingLeave"
    desc = "Left a wing"
    props = @{}
  }
  @{
    name = "WingAdd"
    desc = "Player added to wing"
    props = @{
      Other = Str
    }
  }
  @{
    name = "WingInvite"
    desc = "Wing invitation"
    props = @{
      Other = Str
    }
  }
  @{
    name = "Powerplay"
    desc = "Powerplay status"
    props = @{
      Power = Str
      Rating = Int
      Merits = Int
      Votes = Int
      TimePledged = Int
      PowerplayState = Str
      Rank = Int
    }
  }
  @{
    name = "PowerplayJoin"
    desc = "Joined a Powerplay power"
    props = @{
      Power = Str
    }
  }
  @{
    name = "PowerplayLeave"
    desc = "Left a Powerplay power"
    props = @{
      Power = Str
    }
  }
  @{
    name = "PowerplayDefect"
    desc = "Defected to another Powerplay power"
    props = @{
      FromPower = Str
      ToPower = Str
    }
  }
  @{
    name = "PowerplaySalary"
    desc = "Powerplay salary received"
    props = @{
      Power = Str
      Amount = Int
    }
  }
  @{
    name = "PowerplayVote"
    desc = "Powerplay vote"
    props = @{
      Power = Str
      Votes = Int
      Vote = Int
      Vote_Weighting = Num
    }
  }
  @{
    name = "PowerplayFastTrack"
    desc = "Powerplay fast track"
    props = @{
      Power = Str
      Cost = Int
      Amount = Int
    }
  }
  @{
    name = "PowerplayDeliver"
    desc = "Powerplay goods delivered"
    props = @{
      Power = Str
      Type = Str
      Type_Localised = Str
      Count = Int
    }
  }
  @{
    name = "ApproachSettlement"
    desc = "Approaching a settlement"
    props = @{
      Name = Str
      Name_Localised = Str
      MarketID = Int
      Body = Str
      BodyID = Int
      SystemAddress = Int
      Latitude = Num
      Longitude = Num
    }
  }
  @{
    name = "PlanetApproach"
    desc = "Approaching a planet"
    props = @{
      SystemAddress = Int
      Body = Str
      BodyID = Int
    }
  }
  @{
    name = "SAAscanComplete"
    desc = "Detailed surface scan completed"
    props = @{
      SystemAddress = Int
      BodyName = Str
      BodyID = Int
      ProbesUsed = Int
      EfficiencyTarget = Int
    }
  }
  @{
    name = "CodexEntry"
    desc = "Codex entry added"
    props = @{
      System = Str
      SystemAddress = Int
      Body = Str
      BodyID = Int
      Name = Str
      Name_Localised = Str
      Category = Str
      Category_Localised = Str
      SubCategory = Str
      SubCategory_Localised = Str
      Region = Str
      Region_Localised = Str
      NearestDestination = Str
      NearestDestination_Localised = Str
      VoucherAmount = Int
      Latitude = Num
      Longitude = Num
    }
  }
  @{
    name = "ScanOrganic"
    desc = "Organic sample scanned with exobiology tool"
    props = @{
      ScanType = StrE @("Basic", "Analyse", "Sample")
      Genus = Str
      Genus_Localised = Str
      Species = Str
      Species_Localised = Str
      Variant = Str
      Variant_Localised = Str
      System = Str
      SystemAddress = Int
      Body = Int
      Latitude = Num
      Longitude = Num
    }
  }
  @{
    name = "SellOrganicData"
    desc = "Organic exploration data sold"
    props = @{
      MarketID = Int
      BioData = @{
        type = "array"
        items = (Obj @{
          Genus = Str; Genus_Localised = Str
          Species = Str; Species_Localised = Str
          Variant = Str; Variant_Localised = Str
          Bonus = Int; TotalBonus = Int
          Value = Int; TotalValue = Int
          Vendor = Str; Vendor_Localised = Str
        })
      }
    }
  }
  @{
    name = "Backpack"
    desc = "Backpack contents"
    props = @{
      Items = @{
        type = "array"
        items = (Obj @{
          Name = Str; Name_Localised = Str
          Count = Int; OwnerID = Int
          MissionID = Int; Type = Str
          LocType = Str
        })
      }
      Components = @{
        type = "array"
        items = (Obj @{ Name = Str; Name_Localised = Str; Count = Int })
      }
      Consumables = @{
        type = "array"
        items = (Obj @{ Name = Str; Name_Localised = Str; Count = Int })
      }
      Data = @{
        type = "array"
        items = (Obj @{ Name = Str; Name_Localised = Str; Count = Int })
      }
    }
  }
  @{
    name = "BackpackChange"
    desc = "Backpack contents changed"
    props = @{
      Type = Int
      Total = Int
      Added = @{
        type = "array"
        items = (Obj @{ Name = Str; Name_Localised = Str; OwnerID = Int; MissionID = Int; Count = Int; Type = Str })
      }
      Removed = @{
        type = "array"
        items = (Obj @{ Name = Str; Name_Localised = Str; OwnerID = Int; MissionID = Int; Count = Int; Type = Str })
      }
    }
  }
  @{
    name = "ShipLocker"
    desc = "Ship locker contents"
    props = @{
      Items = @{
        type = "array"
        items = (Obj @{ Name = Str; Name_Localised = Str; Count = Int; OwnerID = Int; MissionID = Int; Type = Str })
      }
      Components = @{
        type = "array"
        items = (Obj @{ Name = Str; Name_Localised = Str; Count = Int })
      }
      Consumables = @{
        type = "array"
        items = (Obj @{ Name = Str; Name_Localised = Str; Count = Int })
      }
      Data = @{
        type = "array"
        items = (Obj @{ Name = Str; Name_Localised = Str; Count = Int })
      }
    }
  }
  @{
    name = "ShipLockerMaterials"
    desc = "Ship locker materials update"
    props = @{
      Items = @{
        type = "array"
        items = (Obj @{ Name = Str; Name_Localised = Str; Count = Int })
      }
      Components = @{
        type = "array"
        items = (Obj @{ Name = Str; Name_Localised = Str; Count = Int })
      }
      Consumables = @{
        type = "array"
        items = (Obj @{ Name = Str; Name_Localised = Str; Count = Int })
      }
      Data = @{
        type = "array"
        items = (Obj @{ Name = Str; Name_Localised = Str; Count = Int })
      }
    }
  }
  @{
    name = "FCMaterials"
    desc = "Fleet carrier materials"
    props = @{
      Items = @{
        type = "array"
        items = (Obj @{ Name = Str; Name_Localised = Str; Count = Int })
      }
      Components = @{
        type = "array"
        items = (Obj @{ Name = Str; Name_Localised = Str; Count = Int })
      }
      Consumables = @{
        type = "array"
        items = (Obj @{ Name = Str; Name_Localised = Str; Count = Int })
      }
      Data = @{
        type = "array"
        items = (Obj @{ Name = Str; Name_Localised = Str; Count = Int })
      }
    }
  }
  @{
    name = "FCMaterialsCAPI"
    desc = "Fleet carrier materials CAPI"
    props = @{
      MarketID = Int
      CarrierName = Str
      CarrierName_Localised = Str
      Items = @{
        type = "array"
        items = (Obj @{ Name = Str; Name_Localised = Str; Count = Int })
      }
      Components = @{
        type = "array"
        items = (Obj @{ Name = Str; Name_Localised = Str; Count = Int })
      }
      Consumables = @{
        type = "array"
        items = (Obj @{ Name = Str; Name_Localised = Str; Count = Int })
      }
      Data = @{
        type = "array"
        items = (Obj @{ Name = Str; Name_Localised = Str; Count = Int })
      }
    }
  }
  @{
    name = "CollectMicroResources"
    desc = "Micro resources collected"
    props = @{
      Items = @{
        type = "array"
        items = (Obj @{
          Name = Str; Name_Localised = Str
          OwnerID = Int; MissionID = Int
          Count = Int; Type = Str
        })
      }
    }
  }
  @{
    name = "UseConsumable"
    desc = "Consumable used"
    props = @{
      Consumable = Str
      Consumable_Localised = Str
      Type = Str
    }
  }
  @{
    name = "CreateSuitLoadout"
    desc = "Suit loadout created"
    props = @{
      SuitID = Int
      SuitName = Str
      SuitName_Localised = Str
      LoadoutName = Str
      SuitMods = StrArr
      Modules = @{
        type = "array"
        items = (Obj @{
          SlotName = Str; SuitModuleID = Int; ModuleName = Str
          ModuleName_Localised = Str
        })
      }
    }
  }
  @{
    name = "DeleteSuitLoadout"
    desc = "Suit loadout deleted"
    props = @{
      SuitID = Int
      SuitName = Str
      SuitName_Localised = Str
      LoadoutName = Str
      LoadoutID = Int
    }
  }
  @{
    name = "RenameSuitLoadout"
    desc = "Suit loadout renamed"
    props = @{
      SuitID = Int
      SuitName = Str
      SuitName_Localised = Str
      LoadoutName = Str
      LoadoutID = Int
      PreviousLoadoutName = Str
    }
  }
  @{
    name = "SwitchSuitLoadout"
    desc = "Suit loadout switched"
    props = @{
      SuitID = Int
      SuitName = Str
      SuitName_Localised = Str
      LoadoutName = Str
      LoadoutID = Int
      Modules = @{
        type = "array"
        items = (Obj @{
          SlotName = Str; SuitModuleID = Int; ModuleName = Str
          ModuleName_Localised = Str
        })
      }
    }
  }
  @{
    name = "UpgradeSuit"
    desc = "Suit upgraded"
    props = @{
      Name = Str
      Name_Localised = Str
      SuitID = Int
      Class = Int
      Cost = Int
    }
  }
  @{
    name = "UpgradeWeapon"
    desc = "Weapon upgraded"
    props = @{
      Name = Str
      Name_Localised = Str
      WeaponID = Int
      Class = Int
      Cost = Int
    }
  }
  @{
    name = "BuySuit"
    desc = "Suit purchased"
    props = @{
      Name = Str
      Name_Localised = Str
      SuitID = Int
      Price = Int
      SuitMods = StrArr
    }
  }
  @{
    name = "SellSuit"
    desc = "Suit sold"
    props = @{
      Name = Str
      Name_Localised = Str
      SuitID = Int
      Price = Int
    }
  }
  @{
    name = "BuyWeapon"
    desc = "Weapon purchased"
    props = @{
      Name = Str
      Name_Localised = Str
      WeaponID = Int
      Price = Int
    }
  }
  @{
    name = "SellWeapon"
    desc = "Weapon sold"
    props = @{
      Name = Str
      Name_Localised = Str
      WeaponID = Int
      Price = Int
    }
  }
  @{
    name = "Disembark"
    desc = "Player disembarked from ship/SRV"
    props = @{
      SRV = Bool
      Taxi = Bool
      Multicrew = Bool
      StarSystem = Str
      SystemAddress = Int
      Body = Str
      BodyID = Int
      OnStation = Bool
      OnPlanet = Bool
      StationName = Str
      StationType = Str
      MarketID = Int
    }
  }
  @{
    name = "Embark"
    desc = "Player embarked into ship/SRV"
    props = @{
      SRV = Bool
      Taxi = Bool
      Multicrew = Bool
      StarSystem = Str
      SystemAddress = Int
      Body = Str
      BodyID = Int
      OnStation = Bool
      OnPlanet = Bool
      StationName = Str
      StationType = Str
      MarketID = Int
    }
  }
  @{
    name = "BookTaxi"
    desc = "Taxi booked (Apex Interstellar)"
    props = @{
      Cost = Int
      DestinationSystem = Str
      DestinationStation = Str
      DestinationLocation = Str
    }
  }
  @{
    name = "CancelTaxi"
    desc = "Taxi cancelled"
    props = @{
      Refund = Int
    }
  }
  @{
    name = "DropShipDeploy"
    desc = "Dropship deployment"
    props = @{
      StarSystem = Str
      SystemAddress = Int
      Body = Str
      BodyID = Int
      OnStation = Bool
      OnPlanet = Bool
      StationName = Str
      StationType = Str
      MarketID = Int
    }
  }
  @{
    name = "TradeMicroResources"
    desc = "Micro resources traded"
    props = @{
      Offered = @{
        type = "array"
        items = (Obj @{ Name = Str; Name_Localised = Str; Count = Int })
      }
      Received = @{
        type = "array"
        items = (Obj @{ Name = Str; Name_Localised = Str; Count = Int })
      }
      MarketID = Int
    }
  }
  @{
    name = "TransferMicroResources"
    desc = "Micro resources transferred between ship/backpack"
    props = @{
      Transfers = @{
        type = "array"
        items = (Obj @{
          Name = Str; Name_Localised = Str
          Count = Int; Direction = StrE @("ToBackpack", "ToShipLocker")
        })
      }
    }
  }
  @{
    name = "BuyMicroResources"
    desc = "Micro resources purchased"
    props = @{
      Name = Str
      Name_Localised = Str
      Count = Int
      Cost = Int
      Category = Str
      Category_Localised = Str
      MarketID = Int
    }
  }
)

# Create output directory if it doesn't exist
if (-not (Test-Path -LiteralPath $OutputDir)) {
  New-Item -ItemType Directory -Path $OutputDir -Force | Out-Null
}

# Generate schema files
$existingFiles = @("FileHeader", "LoadGame", "Location", "FSDJump", "Docked", "Scan")
$countCreated = 0

foreach ($ev in $events) {
  $name = $ev.name
  if ($name -in $existingFiles) { continue }

  $desc = $ev.desc
  $props = $ev.props

  $requiredProps = @("timestamp", "event")
  $schemaProps = @{
    timestamp = @{ type = "string"; format = "date-time" }
    event = @{ type = "string"; enum = @($name) }
  }

  # Add specific properties
  foreach ($propName in $props.Keys) {
    if ($propName -eq "System") {
      $schemaProps[$propName] = @{ type = "string"; description = "System name" }
    } elseif ($propName -eq "SystemAddress") {
      $schemaProps[$propName] = @{ type = "integer"; description = "Unique system 64-bit ID" }
    } elseif ($propName -eq "Body") {
      $schemaProps[$propName] = @{ type = "string"; description = "Body name" }
    } elseif ($propName -eq "BodyID") {
      $schemaProps[$propName] = @{ type = "integer"; description = "Body ID" }
    } elseif ($propName -eq "BodyType") {
      $schemaProps[$propName] = @{ type = "string"; description = "Body type" }
    } elseif ($propName -eq "StationName") {
      $schemaProps[$propName] = @{ type = "string"; description = "Station name" }
    } elseif ($propName -eq "StationType") {
      $schemaProps[$propName] = @{ type = "string"; description = "Station type" }
    } elseif ($propName -eq "MarketID") {
      $schemaProps[$propName] = @{ type = "integer"; description = "Market ID" }
    } else {
      $schemaProps[$propName] = $props[$propName]
    }
  }

  $schema = @{
    '$schema' = "http://json-schema.org/draft-07/schema#"
    title = $name
    description = $desc
    type = "object"
    required = $requiredProps
    properties = $schemaProps
  }

  $filePath = Join-Path -Path $OutputDir -ChildPath "$name.json"
  $json = $schema | ConvertTo-Json -Depth 10
  $json | Set-Content -Path $filePath -Encoding UTF8
  $countCreated++
}

Write-Output "Created $countCreated schema files in $OutputDir"
