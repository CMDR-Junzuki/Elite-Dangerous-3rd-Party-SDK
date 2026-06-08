import { describe, expect, it } from "vitest";
import { parseLine } from "../src";

describe("schema smoke tests", () => {
  it("parses AfmuRepairs", () => {
    const line =
      '{"Health":1.0,"FullyRepaired":true,"Module_Localised":"test","event":"AfmuRepairs","timestamp":"2024-01-01T00:00:00Z","Module":"test"}';
    const ev = parseLine(line);
    expect(ev.event).toBe("AfmuRepairs");
    expect(ev.timestamp).toBe("2024-01-01T00:00:00Z");
  });

  it("parses AppliedToSquadron", () => {
    const line =
      '{"timestamp":"2024-01-01T00:00:00Z","SquadronName":"test","event":"AppliedToSquadron"}';
    const ev = parseLine(line);
    expect(ev.event).toBe("AppliedToSquadron");
    expect(ev.timestamp).toBe("2024-01-01T00:00:00Z");
  });

  it("parses ApproachBody", () => {
    const line =
      '{"SystemAddress":1,"BodyID":1,"event":"ApproachBody","timestamp":"2024-01-01T00:00:00Z","System":"test","Body":"test"}';
    const ev = parseLine(line);
    expect(ev.event).toBe("ApproachBody");
    expect(ev.timestamp).toBe("2024-01-01T00:00:00Z");
  });

  it("parses ApproachSettlement", () => {
    const line =
      '{"Longitude":1.0,"BodyID":1,"Name_Localised":"test","timestamp":"2024-01-01T00:00:00Z","MarketID":1,"event":"ApproachSettlement","Name":"test","SystemAddress":1,"Body":"test","Latitude":1.0}';
    const ev = parseLine(line);
    expect(ev.event).toBe("ApproachSettlement");
    expect(ev.timestamp).toBe("2024-01-01T00:00:00Z");
  });

  it("parses Backpack", () => {
    const line =
      '{"Data":[{}],"Items":[{}],"event":"Backpack","timestamp":"2024-01-01T00:00:00Z","Components":[{}],"Consumables":[{}]}';
    const ev = parseLine(line);
    expect(ev.event).toBe("Backpack");
    expect(ev.timestamp).toBe("2024-01-01T00:00:00Z");
  });

  it("parses BackpackChange", () => {
    const line =
      '{"Removed":[{}],"Total":1,"Type":1,"Added":[{}],"event":"BackpackChange","timestamp":"2024-01-01T00:00:00Z"}';
    const ev = parseLine(line);
    expect(ev.event).toBe("BackpackChange");
    expect(ev.timestamp).toBe("2024-01-01T00:00:00Z");
  });

  it("parses BookTaxi", () => {
    const line =
      '{"Cost":1,"DestinationLocation":"test","event":"BookTaxi","timestamp":"2024-01-01T00:00:00Z","DestinationStation":"test","DestinationSystem":"test"}';
    const ev = parseLine(line);
    expect(ev.event).toBe("BookTaxi");
    expect(ev.timestamp).toBe("2024-01-01T00:00:00Z");
  });

  it("parses Bounty", () => {
    const line =
      '{"TotalReward":1,"Rewards":[{}],"Target_Localised":"test","VictimFaction":"test","event":"Bounty","timestamp":"2024-01-01T00:00:00Z","Target":"test","SharedWithOthers":1,"Faction":"test"}';
    const ev = parseLine(line);
    expect(ev.event).toBe("Bounty");
    expect(ev.timestamp).toBe("2024-01-01T00:00:00Z");
  });

  it("parses BuyAmmo", () => {
    const line =
      '{"Cost":1,"timestamp":"2024-01-01T00:00:00Z","event":"BuyAmmo"}';
    const ev = parseLine(line);
    expect(ev.event).toBe("BuyAmmo");
    expect(ev.timestamp).toBe("2024-01-01T00:00:00Z");
  });

  it("parses BuyDrones", () => {
    const line =
      '{"Count":1,"Type":"test","Type_Localised":"test","event":"BuyDrones","timestamp":"2024-01-01T00:00:00Z","TotalCost":1,"BuyPrice":1}';
    const ev = parseLine(line);
    expect(ev.event).toBe("BuyDrones");
    expect(ev.timestamp).toBe("2024-01-01T00:00:00Z");
  });

  it("parses BuyExplorationData", () => {
    const line =
      '{"Cost":1,"timestamp":"2024-01-01T00:00:00Z","event":"BuyExplorationData","System":"test"}';
    const ev = parseLine(line);
    expect(ev.event).toBe("BuyExplorationData");
    expect(ev.timestamp).toBe("2024-01-01T00:00:00Z");
  });

  it("parses BuyMicroResources", () => {
    const line =
      '{"Name":"test","Category":"test","Count":1,"Cost":1,"MarketID":1,"Category_Localised":"test","event":"BuyMicroResources","timestamp":"2024-01-01T00:00:00Z","Name_Localised":"test"}';
    const ev = parseLine(line);
    expect(ev.event).toBe("BuyMicroResources");
    expect(ev.timestamp).toBe("2024-01-01T00:00:00Z");
  });

  it("parses BuySuit", () => {
    const line =
      '{"Name":"test","Price":1,"Name_Localised":"test","event":"BuySuit","timestamp":"2024-01-01T00:00:00Z","SuitID":1,"SuitMods":["test"]}';
    const ev = parseLine(line);
    expect(ev.event).toBe("BuySuit");
    expect(ev.timestamp).toBe("2024-01-01T00:00:00Z");
  });

  it("parses BuyTradeData", () => {
    const line =
      '{"Cost":1,"timestamp":"2024-01-01T00:00:00Z","event":"BuyTradeData","System":"test"}';
    const ev = parseLine(line);
    expect(ev.event).toBe("BuyTradeData");
    expect(ev.timestamp).toBe("2024-01-01T00:00:00Z");
  });

  it("parses BuyWeapon", () => {
    const line =
      '{"Price":1,"WeaponID":1,"Name_Localised":"test","event":"BuyWeapon","Name":"test","timestamp":"2024-01-01T00:00:00Z"}';
    const ev = parseLine(line);
    expect(ev.event).toBe("BuyWeapon");
    expect(ev.timestamp).toBe("2024-01-01T00:00:00Z");
  });

  it("parses CancelTaxi", () => {
    const line =
      '{"timestamp":"2024-01-01T00:00:00Z","event":"CancelTaxi","Refund":1}';
    const ev = parseLine(line);
    expect(ev.event).toBe("CancelTaxi");
    expect(ev.timestamp).toBe("2024-01-01T00:00:00Z");
  });

  it("parses CapShipBond", () => {
    const line =
      '{"Fighter":true,"VictimFaction_Localised":"test","AwardingFaction":"test","PlayerPilot":true,"VictimFaction":"test","event":"CapShipBond","timestamp":"2024-01-01T00:00:00Z","AwardingFaction_Localised":"test","Amount":1}';
    const ev = parseLine(line);
    expect(ev.event).toBe("CapShipBond");
    expect(ev.timestamp).toBe("2024-01-01T00:00:00Z");
  });

  it("parses CarrierBankTransfer", () => {
    const line =
      '{"CarrierBalance":1,"PlayerBalance":1,"CarrierID":1,"event":"CarrierBankTransfer","timestamp":"2024-01-01T00:00:00Z","Withdraw":1,"Deposit":1}';
    const ev = parseLine(line);
    expect(ev.event).toBe("CarrierBankTransfer");
    expect(ev.timestamp).toBe("2024-01-01T00:00:00Z");
  });

  it("parses CarrierBuy", () => {
    const line =
      '{"Callsign":"test","Price":1,"CarrierID":1,"Variant":"test","event":"CarrierBuy","timestamp":"2024-01-01T00:00:00Z","SystemAddress":1,"Location":"test"}';
    const ev = parseLine(line);
    expect(ev.event).toBe("CarrierBuy");
    expect(ev.timestamp).toBe("2024-01-01T00:00:00Z");
  });

  it("parses CarrierCrewService", () => {
    const line =
      '{"CrewName":"test","CarrierID":1,"event":"CarrierCrewService","timestamp":"2024-01-01T00:00:00Z","CrewRole":"test","Operation":"test"}';
    const ev = parseLine(line);
    expect(ev.event).toBe("CarrierCrewService");
    expect(ev.timestamp).toBe("2024-01-01T00:00:00Z");
  });

  it("parses CarrierDeploy", () => {
    const line =
      '{"BodyID":1,"CarrierID":1,"event":"CarrierDeploy","timestamp":"2024-01-01T00:00:00Z","SystemAddress":1,"Body":"test","System":"test"}';
    const ev = parseLine(line);
    expect(ev.event).toBe("CarrierDeploy");
    expect(ev.timestamp).toBe("2024-01-01T00:00:00Z");
  });

  it("parses CarrierFinance", () => {
    const line =
      '{"ReserveBalance":1,"AvailableBalance":1,"CarrierID":1,"TaxRate":1,"event":"CarrierFinance","ReservePercent":1,"timestamp":"2024-01-01T00:00:00Z"}';
    const ev = parseLine(line);
    expect(ev.event).toBe("CarrierFinance");
    expect(ev.timestamp).toBe("2024-01-01T00:00:00Z");
  });

  it("parses CarrierJump", () => {
    const line =
      '{"SystemAddress":1,"BodyID":1,"event":"CarrierJump","timestamp":"2024-01-01T00:00:00Z","System":"test","Body":"test"}';
    const ev = parseLine(line);
    expect(ev.event).toBe("CarrierJump");
    expect(ev.timestamp).toBe("2024-01-01T00:00:00Z");
  });

  it("parses CarrierJumpRequest", () => {
    const line =
      '{"BodyID":1,"event":"CarrierJumpRequest","timestamp":"2024-01-01T00:00:00Z","SystemAddress":1,"DepartureTime":"test","Body":"test","System":"test"}';
    const ev = parseLine(line);
    expect(ev.event).toBe("CarrierJumpRequest");
    expect(ev.timestamp).toBe("2024-01-01T00:00:00Z");
  });

  it("parses CarrierModulePack", () => {
    const line =
      '{"CarrierID":1,"Cost":1,"Operation":"test","PackTier":1,"event":"CarrierModulePack","timestamp":"2024-01-01T00:00:00Z","PackTheme":"test","PackTheme_Localised":"test"}';
    const ev = parseLine(line);
    expect(ev.event).toBe("CarrierModulePack");
    expect(ev.timestamp).toBe("2024-01-01T00:00:00Z");
  });

  it("parses CarrierNameChange", () => {
    const line =
      '{"Callsign":"test","Name":"test","CarrierID":1,"Name_Localised":"test","event":"CarrierNameChange","timestamp":"2024-01-01T00:00:00Z"}';
    const ev = parseLine(line);
    expect(ev.event).toBe("CarrierNameChange");
    expect(ev.timestamp).toBe("2024-01-01T00:00:00Z");
  });

  it("parses CarrierSell", () => {
    const line =
      '{"Callsign":"test","Price":1,"CarrierID":1,"event":"CarrierSell","timestamp":"2024-01-01T00:00:00Z","SystemAddress":1,"Location":"test"}';
    const ev = parseLine(line);
    expect(ev.event).toBe("CarrierSell");
    expect(ev.timestamp).toBe("2024-01-01T00:00:00Z");
  });

  it("parses CarrierShipPack", () => {
    const line =
      '{"CarrierID":1,"Cost":1,"Operation":"test","PackTier":1,"event":"CarrierShipPack","timestamp":"2024-01-01T00:00:00Z","PackTheme":"test","PackTheme_Localised":"test"}';
    const ev = parseLine(line);
    expect(ev.event).toBe("CarrierShipPack");
    expect(ev.timestamp).toBe("2024-01-01T00:00:00Z");
  });

  it("parses CarrierStats", () => {
    const line =
      '{"AllowNotorious":true,"Theme":"test","Market":true,"Shipyard":true,"Callsign":"test","Name":"test","FuelLevel":1.0,"PendingDecommision":true,"JumpRangeCurr":1.0,"Refuel":true,"SpaceAccess":"test","VoucherExploration":true,"VoucherTrade":true,"Rearm":true,"DockingAccess":"test","CarrierID":1,"JumpRangeMax":1.0,"timestamp":"2024-01-01T00:00:00Z","Name_Localised":"test","VoucherMarket":true,"Outfitting":true,"Pack":[{}],"event":"CarrierStats","ExoBiology":true,"Repair":true}';
    const ev = parseLine(line);
    expect(ev.event).toBe("CarrierStats");
    expect(ev.timestamp).toBe("2024-01-01T00:00:00Z");
  });

  it("parses CarrierTradeOrder", () => {
    const line =
      '{"PurchaseOrder":1,"Price":1,"CarrierID":1,"Stock":1,"Commodity_Localised":"test","event":"CarrierTradeOrder","timestamp":"2024-01-01T00:00:00Z","CancelTrade":true,"SaleOrder":1,"BlackMarket":true,"Commodity":"test"}';
    const ev = parseLine(line);
    expect(ev.event).toBe("CarrierTradeOrder");
    expect(ev.timestamp).toBe("2024-01-01T00:00:00Z");
  });

  it("parses ChangeCrewAssignedRole", () => {
    const line =
      '{"timestamp":"2024-01-01T00:00:00Z","event":"ChangeCrewAssignedRole","Role":"test"}';
    const ev = parseLine(line);
    expect(ev.event).toBe("ChangeCrewAssignedRole");
    expect(ev.timestamp).toBe("2024-01-01T00:00:00Z");
  });

  it("parses CodexEntry", () => {
    const line =
      '{"Latitude":1.0,"SystemAddress":1,"Body":"test","Name":"test","NearestDestination":"test","BodyID":1,"Category_Localised":"test","SubCategory_Localised":"test","SubCategory":"test","VoucherAmount":1,"NearestDestination_Localised":"test","Region_Localised":"test","Longitude":1.0,"Region":"test","Category":"test","timestamp":"2024-01-01T00:00:00Z","Name_Localised":"test","event":"CodexEntry","System":"test"}';
    const ev = parseLine(line);
    expect(ev.event).toBe("CodexEntry");
    expect(ev.timestamp).toBe("2024-01-01T00:00:00Z");
  });

  it("parses CollectItems", () => {
    const line =
      '{"MissionID":1,"OwnerID":1,"Type":"test","Stolen":true,"event":"CollectItems","Name":"test","Name_Localised":"test","timestamp":"2024-01-01T00:00:00Z"}';
    const ev = parseLine(line);
    expect(ev.event).toBe("CollectItems");
    expect(ev.timestamp).toBe("2024-01-01T00:00:00Z");
  });

  it("parses CollectMicroResources", () => {
    const line =
      '{"timestamp":"2024-01-01T00:00:00Z","Items":[{}],"event":"CollectMicroResources"}';
    const ev = parseLine(line);
    expect(ev.event).toBe("CollectMicroResources");
    expect(ev.timestamp).toBe("2024-01-01T00:00:00Z");
  });

  it("parses CommitCrime", () => {
    const line =
      '{"Victim":"test","Bounty":1,"CrimeType":"test","event":"CommitCrime","timestamp":"2024-01-01T00:00:00Z","Fine":1,"Faction":"test","Victim_Localised":"test"}';
    const ev = parseLine(line);
    expect(ev.event).toBe("CommitCrime");
    expect(ev.timestamp).toBe("2024-01-01T00:00:00Z");
  });

  it("parses CommunityGoal", () => {
    const line =
      '{"timestamp":"2024-01-01T00:00:00Z","CurrentGoals":[{}],"event":"CommunityGoal"}';
    const ev = parseLine(line);
    expect(ev.event).toBe("CommunityGoal");
    expect(ev.timestamp).toBe("2024-01-01T00:00:00Z");
  });

  it("parses CommunityGoalDiscard", () => {
    const line =
      '{"CGID":1,"MarketName":"test","Name_Localised":"test","event":"CommunityGoalDiscard","Name":"test","SystemName":"test","timestamp":"2024-01-01T00:00:00Z"}';
    const ev = parseLine(line);
    expect(ev.event).toBe("CommunityGoalDiscard");
    expect(ev.timestamp).toBe("2024-01-01T00:00:00Z");
  });

  it("parses CommunityGoalJoin", () => {
    const line =
      '{"CGID":1,"MarketName":"test","Name_Localised":"test","event":"CommunityGoalJoin","Name":"test","SystemName":"test","timestamp":"2024-01-01T00:00:00Z"}';
    const ev = parseLine(line);
    expect(ev.event).toBe("CommunityGoalJoin");
    expect(ev.timestamp).toBe("2024-01-01T00:00:00Z");
  });

  it("parses CommunityGoalReward", () => {
    const line =
      '{"DetailReward":1,"MarketName":"test","CGID":1,"Name_Localised":"test","event":"CommunityGoalReward","Name":"test","SystemName":"test","Reward":1,"timestamp":"2024-01-01T00:00:00Z"}';
    const ev = parseLine(line);
    expect(ev.event).toBe("CommunityGoalReward");
    expect(ev.timestamp).toBe("2024-01-01T00:00:00Z");
  });

  it("parses Continued", () => {
    const line =
      '{"timestamp":"2024-01-01T00:00:00Z","Part":1,"event":"Continued"}';
    const ev = parseLine(line);
    expect(ev.event).toBe("Continued");
    expect(ev.timestamp).toBe("2024-01-01T00:00:00Z");
  });

  it("parses CreateSuitLoadout", () => {
    const line =
      '{"Modules":[{}],"SuitName_Localised":"test","event":"CreateSuitLoadout","timestamp":"2024-01-01T00:00:00Z","SuitName":"test","SuitID":1,"SuitMods":["test"],"LoadoutName":"test"}';
    const ev = parseLine(line);
    expect(ev.event).toBe("CreateSuitLoadout");
    expect(ev.timestamp).toBe("2024-01-01T00:00:00Z");
  });

  it("parses CrewFire", () => {
    const line =
      '{"CombatRank":1,"timestamp":"2024-01-01T00:00:00Z","Name":"test","event":"CrewFire"}';
    const ev = parseLine(line);
    expect(ev.event).toBe("CrewFire");
    expect(ev.timestamp).toBe("2024-01-01T00:00:00Z");
  });

  it("parses CrewHire", () => {
    const line =
      '{"Name":"test","Cost":1,"event":"CrewHire","timestamp":"2024-01-01T00:00:00Z","CombatRank":1,"Faction":"test"}';
    const ev = parseLine(line);
    expect(ev.event).toBe("CrewHire");
    expect(ev.timestamp).toBe("2024-01-01T00:00:00Z");
  });

  it("parses CrewLaunchFighter", () => {
    const line =
      '{"Loadout_Localised":"test","ID":1,"Crew":"test","Loadout":"test","event":"CrewLaunchFighter","timestamp":"2024-01-01T00:00:00Z"}';
    const ev = parseLine(line);
    expect(ev.event).toBe("CrewLaunchFighter");
    expect(ev.timestamp).toBe("2024-01-01T00:00:00Z");
  });

  it("parses CrewMemberJoins", () => {
    const line =
      '{"Telepresence":true,"CombatRank":1,"timestamp":"2024-01-01T00:00:00Z","Crew":"test","event":"CrewMemberJoins"}';
    const ev = parseLine(line);
    expect(ev.event).toBe("CrewMemberJoins");
    expect(ev.timestamp).toBe("2024-01-01T00:00:00Z");
  });

  it("parses CrewMemberQuits", () => {
    const line =
      '{"Telepresence":true,"timestamp":"2024-01-01T00:00:00Z","Crew":"test","event":"CrewMemberQuits"}';
    const ev = parseLine(line);
    expect(ev.event).toBe("CrewMemberQuits");
    expect(ev.timestamp).toBe("2024-01-01T00:00:00Z");
  });

  it("parses CrewMemberRoleChange", () => {
    const line =
      '{"Telepresence":true,"timestamp":"2024-01-01T00:00:00Z","Crew":"test","event":"CrewMemberRoleChange","Role":"test"}';
    const ev = parseLine(line);
    expect(ev.event).toBe("CrewMemberRoleChange");
    expect(ev.timestamp).toBe("2024-01-01T00:00:00Z");
  });

  it("parses CrewRoleRepair", () => {
    const line =
      '{"CrewID":1,"timestamp":"2024-01-01T00:00:00Z","event":"CrewRoleRepair"}';
    const ev = parseLine(line);
    expect(ev.event).toBe("CrewRoleRepair");
    expect(ev.timestamp).toBe("2024-01-01T00:00:00Z");
  });

  it("parses DataScanned", () => {
    const line =
      '{"timestamp":"2024-01-01T00:00:00Z","Type":"test","Type_Localised":"test","event":"DataScanned"}';
    const ev = parseLine(line);
    expect(ev.event).toBe("DataScanned");
    expect(ev.timestamp).toBe("2024-01-01T00:00:00Z");
  });

  it("parses DeleteSuitLoadout", () => {
    const line =
      '{"SuitName_Localised":"test","event":"DeleteSuitLoadout","timestamp":"2024-01-01T00:00:00Z","SuitName":"test","SuitID":1,"LoadoutID":1,"LoadoutName":"test"}';
    const ev = parseLine(line);
    expect(ev.event).toBe("DeleteSuitLoadout");
    expect(ev.timestamp).toBe("2024-01-01T00:00:00Z");
  });

  it("parses Died", () => {
    const line =
      '{"KillerRank":"test","event":"Died","timestamp":"2024-01-01T00:00:00Z","KillerName_Localised":"test","KillerShip":"test","KillerName":"test","Killers":[{}]}';
    const ev = parseLine(line);
    expect(ev.event).toBe("Died");
    expect(ev.timestamp).toBe("2024-01-01T00:00:00Z");
  });

  it("parses DisbandedSquadron", () => {
    const line =
      '{"timestamp":"2024-01-01T00:00:00Z","SquadronName":"test","event":"DisbandedSquadron"}';
    const ev = parseLine(line);
    expect(ev.event).toBe("DisbandedSquadron");
    expect(ev.timestamp).toBe("2024-01-01T00:00:00Z");
  });

  it("parses Disembark", () => {
    const line =
      '{"SystemAddress":1,"Body":"test","Multicrew":true,"SRV":true,"BodyID":1,"MarketID":1,"OnPlanet":true,"Taxi":true,"StationType":"test","OnStation":true,"StarSystem":"test","event":"Disembark","StationName":"test","timestamp":"2024-01-01T00:00:00Z"}';
    const ev = parseLine(line);
    expect(ev.event).toBe("Disembark");
    expect(ev.timestamp).toBe("2024-01-01T00:00:00Z");
  });

  it("parses DockFighter", () => {
    const line =
      '{"timestamp":"2024-01-01T00:00:00Z","ID":1,"event":"DockFighter"}';
    const ev = parseLine(line);
    expect(ev.event).toBe("DockFighter");
    expect(ev.timestamp).toBe("2024-01-01T00:00:00Z");
  });

  it("parses DockSRV", () => {
    const line =
      '{"timestamp":"2024-01-01T00:00:00Z","ID":1,"event":"DockSRV"}';
    const ev = parseLine(line);
    expect(ev.event).toBe("DockSRV");
    expect(ev.timestamp).toBe("2024-01-01T00:00:00Z");
  });

  it("parses Docked", () => {
    const line =
      '{"timestamp":"2024-01-01T00:00:00Z","event":"Docked","StationName":"test","StationType":"test","StarSystem":"test","SystemAddress":1,"MarketID":1,"StationServices":["test"],"StationEconomy":"test","StationEconomies":[{}],"StationAllegiance":"test","StationGovernment":"test","StationState":"test","LandingPads":{},"CockpitBreach":true,"Wanted":true,"ActiveFine":true,"DistFromStarLS":1.0,"PowerplayState":"test","Powers":["test"],"Taxoname":"test"}';
    const ev = parseLine(line);
    expect(ev.event).toBe("Docked");
    expect(ev.timestamp).toBe("2024-01-01T00:00:00Z");
  });

  it("parses DockingCancelled", () => {
    const line =
      '{"timestamp":"2024-01-01T00:00:00Z","MarketID":1,"StationName":"test","event":"DockingCancelled"}';
    const ev = parseLine(line);
    expect(ev.event).toBe("DockingCancelled");
    expect(ev.timestamp).toBe("2024-01-01T00:00:00Z");
  });

  it("parses DockingDenied", () => {
    const line =
      '{"MarketID":1,"event":"DockingDenied","timestamp":"2024-01-01T00:00:00Z","StationType":"test","Reason":"test","StationName":"test"}';
    const ev = parseLine(line);
    expect(ev.event).toBe("DockingDenied");
    expect(ev.timestamp).toBe("2024-01-01T00:00:00Z");
  });

  it("parses DockingGranted", () => {
    const line =
      '{"MarketID":1,"event":"DockingGranted","timestamp":"2024-01-01T00:00:00Z","StationType":"test","LandingPad":1,"StationName":"test"}';
    const ev = parseLine(line);
    expect(ev.event).toBe("DockingGranted");
    expect(ev.timestamp).toBe("2024-01-01T00:00:00Z");
  });

  it("parses DockingRequested", () => {
    const line =
      '{"MarketID":1,"event":"DockingRequested","timestamp":"2024-01-01T00:00:00Z","StationType":"test","LandingPad":1,"StationName":"test"}';
    const ev = parseLine(line);
    expect(ev.event).toBe("DockingRequested");
    expect(ev.timestamp).toBe("2024-01-01T00:00:00Z");
  });

  it("parses DockingTimeout", () => {
    const line =
      '{"timestamp":"2024-01-01T00:00:00Z","MarketID":1,"StationName":"test","event":"DockingTimeout"}';
    const ev = parseLine(line);
    expect(ev.event).toBe("DockingTimeout");
    expect(ev.timestamp).toBe("2024-01-01T00:00:00Z");
  });

  it("parses DropShipDeploy", () => {
    const line =
      '{"SystemAddress":1,"BodyID":1,"OnStation":true,"OnPlanet":true,"MarketID":1,"event":"DropShipDeploy","timestamp":"2024-01-01T00:00:00Z","StationType":"test","Body":"test","StarSystem":"test","StationName":"test"}';
    const ev = parseLine(line);
    expect(ev.event).toBe("DropShipDeploy");
    expect(ev.timestamp).toBe("2024-01-01T00:00:00Z");
  });

  it("parses EjectCargo", () => {
    const line =
      '{"MissionID":1,"Type":"test","Count":1,"event":"EjectCargo","timestamp":"2024-01-01T00:00:00Z","Powerplay":true,"Type_Localised":"test","Abandoned":true}';
    const ev = parseLine(line);
    expect(ev.event).toBe("EjectCargo");
    expect(ev.timestamp).toBe("2024-01-01T00:00:00Z");
  });

  it("parses Embark", () => {
    const line =
      '{"SystemAddress":1,"Body":"test","Multicrew":true,"SRV":true,"BodyID":1,"MarketID":1,"OnPlanet":true,"Taxi":true,"StationType":"test","OnStation":true,"StarSystem":"test","event":"Embark","StationName":"test","timestamp":"2024-01-01T00:00:00Z"}';
    const ev = parseLine(line);
    expect(ev.event).toBe("Embark");
    expect(ev.timestamp).toBe("2024-01-01T00:00:00Z");
  });

  it("parses EndCrewSession", () => {
    const line =
      '{"timestamp":"2024-01-01T00:00:00Z","event":"EndCrewSession"}';
    const ev = parseLine(line);
    expect(ev.event).toBe("EndCrewSession");
    expect(ev.timestamp).toBe("2024-01-01T00:00:00Z");
  });

  it("parses EngineerApply", () => {
    const line =
      '{"Blueprint":"test","BlueprintID":1,"Engineer":"test","Level":1,"event":"EngineerApply","timestamp":"2024-01-01T00:00:00Z"}';
    const ev = parseLine(line);
    expect(ev.event).toBe("EngineerApply");
    expect(ev.timestamp).toBe("2024-01-01T00:00:00Z");
  });

  it("parses EngineerCraft", () => {
    const line =
      '{"ExperimentalEffect":"test","Quality":1.0,"Modifiers":[{}],"Engineer":"test","EngineerID":1,"Level":1,"event":"EngineerCraft","timestamp":"2024-01-01T00:00:00Z","Ingredients":[{}],"BlueprintID":1,"ExperimentalEffect_Localised":"test","Blueprint":"test"}';
    const ev = parseLine(line);
    expect(ev.event).toBe("EngineerCraft");
    expect(ev.timestamp).toBe("2024-01-01T00:00:00Z");
  });

  it("parses EngineerProgress", () => {
    const line =
      '{"timestamp":"2024-01-01T00:00:00Z","event":"EngineerProgress","Engineers":[{}]}';
    const ev = parseLine(line);
    expect(ev.event).toBe("EngineerProgress");
    expect(ev.timestamp).toBe("2024-01-01T00:00:00Z");
  });

  it("parses FCMaterials", () => {
    const line =
      '{"Data":[{}],"Items":[{}],"event":"FCMaterials","timestamp":"2024-01-01T00:00:00Z","Components":[{}],"Consumables":[{}]}';
    const ev = parseLine(line);
    expect(ev.event).toBe("FCMaterials");
    expect(ev.timestamp).toBe("2024-01-01T00:00:00Z");
  });

  it("parses FCMaterialsCAPI", () => {
    const line =
      '{"CarrierName_Localised":"test","Data":[{}],"Items":[{}],"MarketID":1,"event":"FCMaterialsCAPI","timestamp":"2024-01-01T00:00:00Z","Components":[{}],"Consumables":[{}],"CarrierName":"test"}';
    const ev = parseLine(line);
    expect(ev.event).toBe("FCMaterialsCAPI");
    expect(ev.timestamp).toBe("2024-01-01T00:00:00Z");
  });

  it("parses FSDJump", () => {
    const line =
      '{"timestamp":"2024-01-01T00:00:00Z","event":"FSDJump","StarSystem":"test","SystemAddress":1,"StarPos":[1.0],"SystemAllegiance":"test","SystemEconomy":"test","SystemSecondEconomy":"test","SystemGovernment":"test","SystemSecurity":"test","Population":1,"PowerplayState":"test","Powers":["test"],"JumpDist":1.0,"FuelUsed":1.0,"FuelLevel":1.0,"BoostUsed":1.0,"Factions":["test"],"Conflicts":["test"],"Body":"test","BodyID":1,"Taxoname":"test"}';
    const ev = parseLine(line);
    expect(ev.event).toBe("FSDJump");
    expect(ev.timestamp).toBe("2024-01-01T00:00:00Z");
  });

  it("parses FSSBodySignals", () => {
    const line =
      '{"BodyID":1,"BodyName":"test","event":"FSSBodySignals","Signals":[{}],"SystemAddress":1,"timestamp":"2024-01-01T00:00:00Z"}';
    const ev = parseLine(line);
    expect(ev.event).toBe("FSSBodySignals");
    expect(ev.timestamp).toBe("2024-01-01T00:00:00Z");
  });

  it("parses FSSSignalDiscovered", () => {
    const line =
      '{"USSType_Localised":"test","SignalName_Localised":"test","SpawningFaction":"test","ThargoidWar":"test","event":"FSSSignalDiscovered","timestamp":"2024-01-01T00:00:00Z","SystemAddress":1,"USSType":"test","SpawningState":"test","SignalName":"test"}';
    const ev = parseLine(line);
    expect(ev.event).toBe("FSSSignalDiscovered");
    expect(ev.timestamp).toBe("2024-01-01T00:00:00Z");
  });

  it("parses FactionKillBond", () => {
    const line =
      '{"VictimFaction_Localised":"test","AwardingFaction":"test","VictimFaction":"test","event":"FactionKillBond","timestamp":"2024-01-01T00:00:00Z","AwardingFaction_Localised":"test","Amount":1}';
    const ev = parseLine(line);
    expect(ev.event).toBe("FactionKillBond");
    expect(ev.timestamp).toBe("2024-01-01T00:00:00Z");
  });

  it("parses FighterDestroyed", () => {
    const line =
      '{"timestamp":"2024-01-01T00:00:00Z","ID":1,"event":"FighterDestroyed"}';
    const ev = parseLine(line);
    expect(ev.event).toBe("FighterDestroyed");
    expect(ev.timestamp).toBe("2024-01-01T00:00:00Z");
  });

  it("parses FileHeader", () => {
    const line =
      '{"timestamp":"2024-01-01T00:00:00Z","event":"FileHeader","part":1,"language":"test","gameversion":"test","build":"test","odyssey":true}';
    const ev = parseLine(line);
    expect(ev.event).toBe("FileHeader");
    expect(ev.timestamp).toBe("2024-01-01T00:00:00Z");
  });

  it("parses FuelScoop", () => {
    const line =
      '{"Total":1.0,"timestamp":"2024-01-01T00:00:00Z","event":"FuelScoop","Scooped":1.0}';
    const ev = parseLine(line);
    expect(ev.event).toBe("FuelScoop");
    expect(ev.timestamp).toBe("2024-01-01T00:00:00Z");
  });

  it("parses HeatDamage", () => {
    const line = '{"timestamp":"2024-01-01T00:00:00Z","event":"HeatDamage"}';
    const ev = parseLine(line);
    expect(ev.event).toBe("HeatDamage");
    expect(ev.timestamp).toBe("2024-01-01T00:00:00Z");
  });

  it("parses HeatWarning", () => {
    const line = '{"timestamp":"2024-01-01T00:00:00Z","event":"HeatWarning"}';
    const ev = parseLine(line);
    expect(ev.event).toBe("HeatWarning");
    expect(ev.timestamp).toBe("2024-01-01T00:00:00Z");
  });

  it("parses HullDamage", () => {
    const line =
      '{"PlayerPilot":true,"timestamp":"2024-01-01T00:00:00Z","Health":1.0,"event":"HullDamage","Fighter":true}';
    const ev = parseLine(line);
    expect(ev.event).toBe("HullDamage");
    expect(ev.timestamp).toBe("2024-01-01T00:00:00Z");
  });

  it("parses InvitedToSquadron", () => {
    const line =
      '{"InviterName_Localised":"test","timestamp":"2024-01-01T00:00:00Z","SquadronName":"test","event":"InvitedToSquadron","InviterName":"test"}';
    const ev = parseLine(line);
    expect(ev.event).toBe("InvitedToSquadron");
    expect(ev.timestamp).toBe("2024-01-01T00:00:00Z");
  });

  it("parses JoinACrew", () => {
    const line =
      '{"Captain_Localised":"test","timestamp":"2024-01-01T00:00:00Z","event":"JoinACrew","Captain":"test"}';
    const ev = parseLine(line);
    expect(ev.event).toBe("JoinACrew");
    expect(ev.timestamp).toBe("2024-01-01T00:00:00Z");
  });

  it("parses JoinedSquadron", () => {
    const line =
      '{"timestamp":"2024-01-01T00:00:00Z","SquadronName":"test","event":"JoinedSquadron"}';
    const ev = parseLine(line);
    expect(ev.event).toBe("JoinedSquadron");
    expect(ev.timestamp).toBe("2024-01-01T00:00:00Z");
  });

  it("parses KickCrewMember", () => {
    const line =
      '{"Telepresence":true,"timestamp":"2024-01-01T00:00:00Z","Crew":"test","event":"KickCrewMember"}';
    const ev = parseLine(line);
    expect(ev.event).toBe("KickCrewMember");
    expect(ev.timestamp).toBe("2024-01-01T00:00:00Z");
  });

  it("parses KickedFromSquadron", () => {
    const line =
      '{"timestamp":"2024-01-01T00:00:00Z","SquadronName":"test","event":"KickedFromSquadron"}';
    const ev = parseLine(line);
    expect(ev.event).toBe("KickedFromSquadron");
    expect(ev.timestamp).toBe("2024-01-01T00:00:00Z");
  });

  it("parses LaunchFighter", () => {
    const line =
      '{"Loadout":"test","Loadout_Localised":"test","timestamp":"2024-01-01T00:00:00Z","PlayerControlled":true,"event":"LaunchFighter"}';
    const ev = parseLine(line);
    expect(ev.event).toBe("LaunchFighter");
    expect(ev.timestamp).toBe("2024-01-01T00:00:00Z");
  });

  it("parses LaunchSRV", () => {
    const line =
      '{"Loadout_Localised":"test","ID":1,"Loadout":"test","event":"LaunchSRV","timestamp":"2024-01-01T00:00:00Z","PlayerControlled":true}';
    const ev = parseLine(line);
    expect(ev.event).toBe("LaunchSRV");
    expect(ev.timestamp).toBe("2024-01-01T00:00:00Z");
  });

  it("parses LeaveBody", () => {
    const line =
      '{"SystemAddress":1,"BodyID":1,"event":"LeaveBody","timestamp":"2024-01-01T00:00:00Z","System":"test","Body":"test"}';
    const ev = parseLine(line);
    expect(ev.event).toBe("LeaveBody");
    expect(ev.timestamp).toBe("2024-01-01T00:00:00Z");
  });

  it("parses LeftSquadron", () => {
    const line =
      '{"SquadronName":"test","timestamp":"2024-01-01T00:00:00Z","OldRank":1,"event":"LeftSquadron"}';
    const ev = parseLine(line);
    expect(ev.event).toBe("LeftSquadron");
    expect(ev.timestamp).toBe("2024-01-01T00:00:00Z");
  });

  it("parses Liftoff", () => {
    const line =
      '{"BodyID":1,"OnStation":true,"OnPlanet":true,"Latitude":1.0,"event":"Liftoff","timestamp":"2024-01-01T00:00:00Z","SystemAddress":1,"PlayerControlled":true,"Body":"test","System":"test","Longitude":1.0}';
    const ev = parseLine(line);
    expect(ev.event).toBe("Liftoff");
    expect(ev.timestamp).toBe("2024-01-01T00:00:00Z");
  });

  it("parses LoadGame", () => {
    const line =
      '{"timestamp":"2024-01-01T00:00:00Z","event":"LoadGame","Commander":"test","FID":"test","Ship":"test","ShipID":1,"ShipName":"test","ShipIdent":"test","FuelLevel":1.0,"FuelCapacity":1.0,"GameMode":"test","Group":"test","Credits":1,"Loan":1,"Horizons":true,"Odyssey":true,"language":"test","gameversion":"test","build":"test"}';
    const ev = parseLine(line);
    expect(ev.event).toBe("LoadGame");
    expect(ev.timestamp).toBe("2024-01-01T00:00:00Z");
  });

  it("parses Location", () => {
    const line =
      '{"timestamp":"2024-01-01T00:00:00Z","event":"Location","StarSystem":"test","SystemAddress":1,"StarPos":[1.0],"Body":"test","BodyID":1,"BodyType":"test","Docked":true,"StationName":"test","StationType":"test","MarketID":1,"SystemAllegiance":"test","SystemEconomy":"test","SystemSecondEconomy":"test","SystemGovernment":"test","SystemSecurity":"test","Population":1,"PowerplayState":"test","Powers":["test"]}';
    const ev = parseLine(line);
    expect(ev.event).toBe("Location");
    expect(ev.timestamp).toBe("2024-01-01T00:00:00Z");
  });

  it("parses MarketBuy", () => {
    const line =
      '{"Count":1,"Type":"test","TotalCost":1,"MarketID":1,"event":"MarketBuy","timestamp":"2024-01-01T00:00:00Z","Type_Localised":"test","BuyPrice":1}';
    const ev = parseLine(line);
    expect(ev.event).toBe("MarketBuy");
    expect(ev.timestamp).toBe("2024-01-01T00:00:00Z");
  });

  it("parses MarketSell", () => {
    const line =
      '{"IllegalGoods":true,"TotalSale":1,"Type":"test","Type_Localised":"test","AvgPricePaid":1,"MarketID":1,"event":"MarketSell","timestamp":"2024-01-01T00:00:00Z","Count":1,"SellPrice":1,"BlackMarket":true,"Stolen":true}';
    const ev = parseLine(line);
    expect(ev.event).toBe("MarketSell");
    expect(ev.timestamp).toBe("2024-01-01T00:00:00Z");
  });

  it("parses MaterialCollected", () => {
    const line =
      '{"Name":"test","Count":1,"Category":"test","Name_Localised":"test","event":"MaterialCollected","timestamp":"2024-01-01T00:00:00Z"}';
    const ev = parseLine(line);
    expect(ev.event).toBe("MaterialCollected");
    expect(ev.timestamp).toBe("2024-01-01T00:00:00Z");
  });

  it("parses MaterialDiscarded", () => {
    const line =
      '{"Name":"test","Count":1,"Category":"test","Name_Localised":"test","event":"MaterialDiscarded","timestamp":"2024-01-01T00:00:00Z"}';
    const ev = parseLine(line);
    expect(ev.event).toBe("MaterialDiscarded");
    expect(ev.timestamp).toBe("2024-01-01T00:00:00Z");
  });

  it("parses MaterialDiscovered", () => {
    const line =
      '{"Name":"test","Category":"test","Name_Localised":"test","event":"MaterialDiscovered","timestamp":"2024-01-01T00:00:00Z","DiscoveryNumber":1}';
    const ev = parseLine(line);
    expect(ev.event).toBe("MaterialDiscovered");
    expect(ev.timestamp).toBe("2024-01-01T00:00:00Z");
  });

  it("parses MaterialTrade", () => {
    const line =
      '{"Traded":{},"MarketID":1,"event":"MaterialTrade","timestamp":"2024-01-01T00:00:00Z","TraderType":"test","Received":{}}';
    const ev = parseLine(line);
    expect(ev.event).toBe("MaterialTrade");
    expect(ev.timestamp).toBe("2024-01-01T00:00:00Z");
  });

  it("parses MiningRefined", () => {
    const line =
      '{"Commodity_Localised":"test","timestamp":"2024-01-01T00:00:00Z","Type":"test","Type_Localised":"test","event":"MiningRefined"}';
    const ev = parseLine(line);
    expect(ev.event).toBe("MiningRefined");
    expect(ev.timestamp).toBe("2024-01-01T00:00:00Z");
  });

  it("parses MissionAbandoned", () => {
    const line =
      '{"MissionID":1,"Name_Localised":"test","event":"MissionAbandoned","Name":"test","Fine":1,"timestamp":"2024-01-01T00:00:00Z"}';
    const ev = parseLine(line);
    expect(ev.event).toBe("MissionAbandoned");
    expect(ev.timestamp).toBe("2024-01-01T00:00:00Z");
  });

  it("parses MissionAccepted", () => {
    const line =
      '{"timestamp":"2024-01-01T00:00:00Z","Count":1,"Reward":1,"Target":"test","TargetType_Localised":"test","KillCount":1,"DestinationStation":"test","Expiry":"test","CommodityReward":[{}],"Wing":true,"Commodity":"test","PassengerType":"test","MaterialsRequired":[{}],"InfluenceGain":"test","LocalisedName":"test","ReputationGain":"test","PassengerWanted":true,"Influence":"test","MissionID":1,"Faction":"test","TargetCommodity":"test","Name_Localised":"test","Commodity_Localised":"test","Reputation":"test","Donated":1,"PassengerCount":1,"TargetType":"test","TargetFaction":"test","Target_Localised":"test","DestinationSystem":"test","event":"MissionAccepted","PassengerVIPs":true,"Name":"test","PassengerMission":true,"TargetCommodity_Localised":"test","Donation":"test","MinJumps":1}';
    const ev = parseLine(line);
    expect(ev.event).toBe("MissionAccepted");
    expect(ev.timestamp).toBe("2024-01-01T00:00:00Z");
  });

  it("parses MissionCompleted", () => {
    const line =
      '{"Donated":1,"MaterialsReward":[{}],"Commodity":"test","Count":1,"PermitsAwarded":[{}],"TargetFaction":"test","DestinationStation":"test","Reward":1,"RewardDetail_Localised":"test","Name":"test","Donation":"test","RewardDetail":"test","DestinationSystem":"test","FactionEffect":[{}],"Faction":"test","Name_Localised":"test","MissionID":1,"KillCount":1,"Commodity_Localised":"test","event":"MissionCompleted","CommodityReward":[{}],"timestamp":"2024-01-01T00:00:00Z"}';
    const ev = parseLine(line);
    expect(ev.event).toBe("MissionCompleted");
    expect(ev.timestamp).toBe("2024-01-01T00:00:00Z");
  });

  it("parses MissionFailed", () => {
    const line =
      '{"MissionID":1,"Name":"test","Name_Localised":"test","event":"MissionFailed","timestamp":"2024-01-01T00:00:00Z","Fine":1,"Faction":"test"}';
    const ev = parseLine(line);
    expect(ev.event).toBe("MissionFailed");
    expect(ev.timestamp).toBe("2024-01-01T00:00:00Z");
  });

  it("parses MissionRedirected", () => {
    const line =
      '{"MissionID":1,"NewDestinationStation":"test","NewDestinationSystem":"test","Name_Localised":"test","OldDestinationSystem":"test","event":"MissionRedirected","Name":"test","OldDestinationStation":"test","timestamp":"2024-01-01T00:00:00Z"}';
    const ev = parseLine(line);
    expect(ev.event).toBe("MissionRedirected");
    expect(ev.timestamp).toBe("2024-01-01T00:00:00Z");
  });

  it("parses ModuleInfo", () => {
    const line =
      '{"Modules":[{}],"timestamp":"2024-01-01T00:00:00Z","event":"ModuleInfo"}';
    const ev = parseLine(line);
    expect(ev.event).toBe("ModuleInfo");
    expect(ev.timestamp).toBe("2024-01-01T00:00:00Z");
  });

  it("parses Music", () => {
    const line =
      '{"MusicTrack":"test","timestamp":"2024-01-01T00:00:00Z","event":"Music"}';
    const ev = parseLine(line);
    expect(ev.event).toBe("Music");
    expect(ev.timestamp).toBe("2024-01-01T00:00:00Z");
  });

  it("parses NavBeaconScan", () => {
    const line =
      '{"SystemAddress":1,"timestamp":"2024-01-01T00:00:00Z","NumBodies":1,"event":"NavBeaconScan"}';
    const ev = parseLine(line);
    expect(ev.event).toBe("NavBeaconScan");
    expect(ev.timestamp).toBe("2024-01-01T00:00:00Z");
  });

  it("parses NavRoute", () => {
    const line =
      '{"timestamp":"2024-01-01T00:00:00Z","event":"NavRoute","Route":[{}]}';
    const ev = parseLine(line);
    expect(ev.event).toBe("NavRoute");
    expect(ev.timestamp).toBe("2024-01-01T00:00:00Z");
  });

  it("parses NavRouteClear", () => {
    const line = '{"timestamp":"2024-01-01T00:00:00Z","event":"NavRouteClear"}';
    const ev = parseLine(line);
    expect(ev.event).toBe("NavRouteClear");
    expect(ev.timestamp).toBe("2024-01-01T00:00:00Z");
  });

  it("parses PVPKill", () => {
    const line =
      '{"Victim_Localised":"test","timestamp":"2024-01-01T00:00:00Z","CombatRank":1,"event":"PVPKill","Victim":"test"}';
    const ev = parseLine(line);
    expect(ev.event).toBe("PVPKill");
    expect(ev.timestamp).toBe("2024-01-01T00:00:00Z");
  });

  it("parses PayFines", () => {
    const line =
      '{"Amount":1,"timestamp":"2024-01-01T00:00:00Z","AllFines":true,"event":"PayFines","BrokerPercentage":1.0}';
    const ev = parseLine(line);
    expect(ev.event).toBe("PayFines");
    expect(ev.timestamp).toBe("2024-01-01T00:00:00Z");
  });

  it("parses PayLegacyFines", () => {
    const line =
      '{"Amount":1,"timestamp":"2024-01-01T00:00:00Z","event":"PayLegacyFines","BrokerPercentage":1.0}';
    const ev = parseLine(line);
    expect(ev.event).toBe("PayLegacyFines");
    expect(ev.timestamp).toBe("2024-01-01T00:00:00Z");
  });

  it("parses PlanetApproach", () => {
    const line =
      '{"Body":"test","SystemAddress":1,"timestamp":"2024-01-01T00:00:00Z","event":"PlanetApproach","BodyID":1}';
    const ev = parseLine(line);
    expect(ev.event).toBe("PlanetApproach");
    expect(ev.timestamp).toBe("2024-01-01T00:00:00Z");
  });

  it("parses Powerplay", () => {
    const line =
      '{"TimePledged":1,"Rank":1,"Merits":1,"Rating":1,"Votes":1,"event":"Powerplay","timestamp":"2024-01-01T00:00:00Z","Power":"test","PowerplayState":"test"}';
    const ev = parseLine(line);
    expect(ev.event).toBe("Powerplay");
    expect(ev.timestamp).toBe("2024-01-01T00:00:00Z");
  });

  it("parses PowerplayDefect", () => {
    const line =
      '{"ToPower":"test","timestamp":"2024-01-01T00:00:00Z","event":"PowerplayDefect","FromPower":"test"}';
    const ev = parseLine(line);
    expect(ev.event).toBe("PowerplayDefect");
    expect(ev.timestamp).toBe("2024-01-01T00:00:00Z");
  });

  it("parses PowerplayDeliver", () => {
    const line =
      '{"Type":"test","Count":1,"event":"PowerplayDeliver","timestamp":"2024-01-01T00:00:00Z","Power":"test","Type_Localised":"test"}';
    const ev = parseLine(line);
    expect(ev.event).toBe("PowerplayDeliver");
    expect(ev.timestamp).toBe("2024-01-01T00:00:00Z");
  });

  it("parses PowerplayFastTrack", () => {
    const line =
      '{"Amount":1,"Power":"test","timestamp":"2024-01-01T00:00:00Z","event":"PowerplayFastTrack","Cost":1}';
    const ev = parseLine(line);
    expect(ev.event).toBe("PowerplayFastTrack");
    expect(ev.timestamp).toBe("2024-01-01T00:00:00Z");
  });

  it("parses PowerplayJoin", () => {
    const line =
      '{"Power":"test","timestamp":"2024-01-01T00:00:00Z","event":"PowerplayJoin"}';
    const ev = parseLine(line);
    expect(ev.event).toBe("PowerplayJoin");
    expect(ev.timestamp).toBe("2024-01-01T00:00:00Z");
  });

  it("parses PowerplayLeave", () => {
    const line =
      '{"Power":"test","timestamp":"2024-01-01T00:00:00Z","event":"PowerplayLeave"}';
    const ev = parseLine(line);
    expect(ev.event).toBe("PowerplayLeave");
    expect(ev.timestamp).toBe("2024-01-01T00:00:00Z");
  });

  it("parses PowerplaySalary", () => {
    const line =
      '{"Amount":1,"Power":"test","timestamp":"2024-01-01T00:00:00Z","event":"PowerplaySalary"}';
    const ev = parseLine(line);
    expect(ev.event).toBe("PowerplaySalary");
    expect(ev.timestamp).toBe("2024-01-01T00:00:00Z");
  });

  it("parses PowerplayVote", () => {
    const line =
      '{"Vote":1,"Vote_Weighting":1.0,"Votes":1,"event":"PowerplayVote","timestamp":"2024-01-01T00:00:00Z","Power":"test"}';
    const ev = parseLine(line);
    expect(ev.event).toBe("PowerplayVote");
    expect(ev.timestamp).toBe("2024-01-01T00:00:00Z");
  });

  it("parses Progress", () => {
    const line =
      '{"Soldier":1.0,"Exobiologist":1.0,"Trade":1.0,"Federation":1.0,"CQC":1.0,"Combat":1.0,"event":"Progress","timestamp":"2024-01-01T00:00:00Z","Explore":1.0,"Empire":1.0}';
    const ev = parseLine(line);
    expect(ev.event).toBe("Progress");
    expect(ev.timestamp).toBe("2024-01-01T00:00:00Z");
  });

  it("parses Promotion", () => {
    const line =
      '{"Soldier":1,"Exobiologist":1,"Trade":1,"Federation":1,"CQC":1,"Combat":1,"event":"Promotion","timestamp":"2024-01-01T00:00:00Z","Explore":1,"Empire":1}';
    const ev = parseLine(line);
    expect(ev.event).toBe("Promotion");
    expect(ev.timestamp).toBe("2024-01-01T00:00:00Z");
  });

  it("parses ProspectedAsteroid", () => {
    const line =
      '{"MotherlodeProportion":1.0,"Content_Localised":"test","Content":"test","Materials":[{}],"event":"ProspectedAsteroid","timestamp":"2024-01-01T00:00:00Z","MotherlodeMaterial_Localised":"test","Remaining":1.0,"MotherlodeMaterial":"test"}';
    const ev = parseLine(line);
    expect(ev.event).toBe("ProspectedAsteroid");
    expect(ev.timestamp).toBe("2024-01-01T00:00:00Z");
  });

  it("parses QuitACrew", () => {
    const line =
      '{"timestamp":"2024-01-01T00:00:00Z","event":"QuitACrew","Captain":"test"}';
    const ev = parseLine(line);
    expect(ev.event).toBe("QuitACrew");
    expect(ev.timestamp).toBe("2024-01-01T00:00:00Z");
  });

  it("parses Rank", () => {
    const line =
      '{"Soldier":1,"Exobiologist":1,"Trade":1,"Federation":1,"CQC":1,"Combat":1,"event":"Rank","timestamp":"2024-01-01T00:00:00Z","Explore":1,"Empire":1}';
    const ev = parseLine(line);
    expect(ev.event).toBe("Rank");
    expect(ev.timestamp).toBe("2024-01-01T00:00:00Z");
  });

  it("parses RebootRepair", () => {
    const line =
      '{"Modules":[{}],"timestamp":"2024-01-01T00:00:00Z","event":"RebootRepair"}';
    const ev = parseLine(line);
    expect(ev.event).toBe("RebootRepair");
    expect(ev.timestamp).toBe("2024-01-01T00:00:00Z");
  });

  it("parses ReceiveText", () => {
    const line =
      '{"Message":"test","Message_Localised":"test","event":"ReceiveText","timestamp":"2024-01-01T00:00:00Z","Channel":"test","From_Localised":"test","From":"test"}';
    const ev = parseLine(line);
    expect(ev.event).toBe("ReceiveText");
    expect(ev.timestamp).toBe("2024-01-01T00:00:00Z");
  });

  it("parses RedeemVoucher", () => {
    const line =
      '{"Amount":1,"timestamp":"2024-01-01T00:00:00Z","Type":"test","Factions":[{}],"event":"RedeemVoucher"}';
    const ev = parseLine(line);
    expect(ev.event).toBe("RedeemVoucher");
    expect(ev.timestamp).toBe("2024-01-01T00:00:00Z");
  });

  it("parses RefuelAll", () => {
    const line =
      '{"Amount":1.0,"Cost":1,"timestamp":"2024-01-01T00:00:00Z","event":"RefuelAll"}';
    const ev = parseLine(line);
    expect(ev.event).toBe("RefuelAll");
    expect(ev.timestamp).toBe("2024-01-01T00:00:00Z");
  });

  it("parses RefuelPartial", () => {
    const line =
      '{"Amount":1.0,"Cost":1,"timestamp":"2024-01-01T00:00:00Z","event":"RefuelPartial"}';
    const ev = parseLine(line);
    expect(ev.event).toBe("RefuelPartial");
    expect(ev.timestamp).toBe("2024-01-01T00:00:00Z");
  });

  it("parses RenameSuitLoadout", () => {
    const line =
      '{"PreviousLoadoutName":"test","SuitName_Localised":"test","event":"RenameSuitLoadout","timestamp":"2024-01-01T00:00:00Z","SuitName":"test","SuitID":1,"LoadoutID":1,"LoadoutName":"test"}';
    const ev = parseLine(line);
    expect(ev.event).toBe("RenameSuitLoadout");
    expect(ev.timestamp).toBe("2024-01-01T00:00:00Z");
  });

  it("parses Repair", () => {
    const line =
      '{"Cost":1,"timestamp":"2024-01-01T00:00:00Z","Item_Localised":"test","Item":"test","event":"Repair"}';
    const ev = parseLine(line);
    expect(ev.event).toBe("Repair");
    expect(ev.timestamp).toBe("2024-01-01T00:00:00Z");
  });

  it("parses RepairAll", () => {
    const line =
      '{"Cost":1,"timestamp":"2024-01-01T00:00:00Z","event":"RepairAll"}';
    const ev = parseLine(line);
    expect(ev.event).toBe("RepairAll");
    expect(ev.timestamp).toBe("2024-01-01T00:00:00Z");
  });

  it("parses ReservoirReplenished", () => {
    const line =
      '{"FuelReservoir":1.0,"timestamp":"2024-01-01T00:00:00Z","FuelMain":1.0,"event":"ReservoirReplenished"}';
    const ev = parseLine(line);
    expect(ev.event).toBe("ReservoirReplenished");
    expect(ev.timestamp).toBe("2024-01-01T00:00:00Z");
  });

  it("parses RestockVehicle", () => {
    const line =
      '{"Loadout_Localised":"test","Type":"test","Cost":1,"Loadout":"test","event":"RestockVehicle","Count":1,"timestamp":"2024-01-01T00:00:00Z"}';
    const ev = parseLine(line);
    expect(ev.event).toBe("RestockVehicle");
    expect(ev.timestamp).toBe("2024-01-01T00:00:00Z");
  });

  it("parses Resurrect", () => {
    const line =
      '{"Cost":1,"timestamp":"2024-01-01T00:00:00Z","Bankrupt":true,"Option":"test","event":"Resurrect"}';
    const ev = parseLine(line);
    expect(ev.event).toBe("Resurrect");
    expect(ev.timestamp).toBe("2024-01-01T00:00:00Z");
  });

  it("parses SAASignalsFound", () => {
    const line =
      '{"BodyID":1,"BodyName":"test","event":"SAASignalsFound","Signals":[{}],"SystemAddress":1,"Genuses":[{}],"timestamp":"2024-01-01T00:00:00Z"}';
    const ev = parseLine(line);
    expect(ev.event).toBe("SAASignalsFound");
    expect(ev.timestamp).toBe("2024-01-01T00:00:00Z");
  });

  it("parses SAAscanComplete", () => {
    const line =
      '{"BodyID":1,"EfficiencyTarget":1,"BodyName":"test","event":"SAAscanComplete","timestamp":"2024-01-01T00:00:00Z","SystemAddress":1,"ProbesUsed":1}';
    const ev = parseLine(line);
    expect(ev.event).toBe("SAAscanComplete");
    expect(ev.timestamp).toBe("2024-01-01T00:00:00Z");
  });

  it("parses SRVDestroyed", () => {
    const line =
      '{"timestamp":"2024-01-01T00:00:00Z","ID":1,"event":"SRVDestroyed"}';
    const ev = parseLine(line);
    expect(ev.event).toBe("SRVDestroyed");
    expect(ev.timestamp).toBe("2024-01-01T00:00:00Z");
  });

  it("parses Scan", () => {
    const line =
      '{"timestamp":"2024-01-01T00:00:00Z","event":"Scan","BodyName":"test","BodyID":1,"DistanceFromArrivalLS":1.0,"StarSystem":"test","SystemAddress":1,"StarPos":[1.0],"WasDiscovered":true,"WasMapped":true,"Parents":[{}],"Rings":[{}],"AtmosphereType":"test","AtmosphereComposition":[{}],"Volcanism":"test","SurfaceGravity":1.0,"SurfaceTemperature":1.0,"SurfacePressure":1.0,"Landable":true,"TerraformingState":"test","PlanetClass":"test","Composition":{},"Materials":"test","Radius":1.0,"MassEM":1.0,"SemiMajorAxis":1.0,"Eccentricity":1.0,"OrbitalInclination":1.0,"Periapsis":1.0,"OrbitalPeriod":1.0,"RotationPeriod":1.0,"AxialTilt":1.0,"TidalLock":true,"StarType":"test","StellarMass":1.0,"StellarRadius":1.0,"AbsoluteMagnitude":1.0,"Age_MY":1.0,"Luminosity":"test","Subclass":1,"WasDiscoveredByName":true,"WasMappedByName":true,"ScanType":"test"}';
    const ev = parseLine(line);
    expect(ev.event).toBe("Scan");
    expect(ev.timestamp).toBe("2024-01-01T00:00:00Z");
  });

  it("parses ScanOrganic", () => {
    const line =
      '{"Latitude":1.0,"SystemAddress":1,"Body":"test","Species":"test","Variant":"test","Longitude":1.0,"Variant_Localised":"test","Species_Localised":"test","Genus_Localised":"test","ScanType":"test","timestamp":"2024-01-01T00:00:00Z","Genus":"test","event":"ScanOrganic","System":"test"}';
    const ev = parseLine(line);
    expect(ev.event).toBe("ScanOrganic");
    expect(ev.timestamp).toBe("2024-01-01T00:00:00Z");
  });

  it("parses Screenshot", () => {
    const line =
      '{"Latitude":1.0,"SystemAddress":1,"Body":"test","Filename":"test","Heading":1.0,"BodyID":1,"Longitude":1.0,"Width":1,"Height":1,"timestamp":"2024-01-01T00:00:00Z","Altitude":1.0,"event":"Screenshot","System":"test"}';
    const ev = parseLine(line);
    expect(ev.event).toBe("Screenshot");
    expect(ev.timestamp).toBe("2024-01-01T00:00:00Z");
  });

  it("parses SelfDestruct", () => {
    const line = '{"timestamp":"2024-01-01T00:00:00Z","event":"SelfDestruct"}';
    const ev = parseLine(line);
    expect(ev.event).toBe("SelfDestruct");
    expect(ev.timestamp).toBe("2024-01-01T00:00:00Z");
  });

  it("parses SellDrones", () => {
    const line =
      '{"Type":"test","Count":1,"event":"SellDrones","TotalSale":1,"SellPrice":1,"Type_Localised":"test","timestamp":"2024-01-01T00:00:00Z"}';
    const ev = parseLine(line);
    expect(ev.event).toBe("SellDrones");
    expect(ev.timestamp).toBe("2024-01-01T00:00:00Z");
  });

  it("parses SellExplorationData", () => {
    const line =
      '{"Systems":[{}],"Bonus":1,"Discovered":[{}],"BaseValue":1,"event":"SellExplorationData","timestamp":"2024-01-01T00:00:00Z","TotalEarnings":1}';
    const ev = parseLine(line);
    expect(ev.event).toBe("SellExplorationData");
    expect(ev.timestamp).toBe("2024-01-01T00:00:00Z");
  });

  it("parses SellOrganicData", () => {
    const line =
      '{"timestamp":"2024-01-01T00:00:00Z","MarketID":1,"BioData":[{}],"event":"SellOrganicData"}';
    const ev = parseLine(line);
    expect(ev.event).toBe("SellOrganicData");
    expect(ev.timestamp).toBe("2024-01-01T00:00:00Z");
  });

  it("parses SellSuit", () => {
    const line =
      '{"Price":1,"Name_Localised":"test","event":"SellSuit","Name":"test","SuitID":1,"timestamp":"2024-01-01T00:00:00Z"}';
    const ev = parseLine(line);
    expect(ev.event).toBe("SellSuit");
    expect(ev.timestamp).toBe("2024-01-01T00:00:00Z");
  });

  it("parses SellWeapon", () => {
    const line =
      '{"Price":1,"WeaponID":1,"Name_Localised":"test","event":"SellWeapon","Name":"test","timestamp":"2024-01-01T00:00:00Z"}';
    const ev = parseLine(line);
    expect(ev.event).toBe("SellWeapon");
    expect(ev.timestamp).toBe("2024-01-01T00:00:00Z");
  });

  it("parses SendText", () => {
    const line =
      '{"Message":"test","Sent":true,"To_Localised":"test","event":"SendText","timestamp":"2024-01-01T00:00:00Z","To":"test"}';
    const ev = parseLine(line);
    expect(ev.event).toBe("SendText");
    expect(ev.timestamp).toBe("2024-01-01T00:00:00Z");
  });

  it("parses ShieldState", () => {
    const line =
      '{"timestamp":"2024-01-01T00:00:00Z","ShieldsUp":true,"event":"ShieldState"}';
    const ev = parseLine(line);
    expect(ev.event).toBe("ShieldState");
    expect(ev.timestamp).toBe("2024-01-01T00:00:00Z");
  });

  it("parses ShipLocker", () => {
    const line =
      '{"Data":[{}],"Items":[{}],"event":"ShipLocker","timestamp":"2024-01-01T00:00:00Z","Components":[{}],"Consumables":[{}]}';
    const ev = parseLine(line);
    expect(ev.event).toBe("ShipLocker");
    expect(ev.timestamp).toBe("2024-01-01T00:00:00Z");
  });

  it("parses ShipLockerMaterials", () => {
    const line =
      '{"Data":[{}],"Items":[{}],"event":"ShipLockerMaterials","timestamp":"2024-01-01T00:00:00Z","Components":[{}],"Consumables":[{}]}';
    const ev = parseLine(line);
    expect(ev.event).toBe("ShipLockerMaterials");
    expect(ev.timestamp).toBe("2024-01-01T00:00:00Z");
  });

  it("parses ShipTargeted", () => {
    const line =
      '{"PilotName_Localised":"test","Faction":"test","TargetLocked":true,"SquadronID":1,"Ship":"test","ScanStage":1,"Ship_Localised":"test","Power":"test","PilotRank":"test","LegalStatus":"test","ShieldHealth":1.0,"PilotName":"test","event":"ShipTargeted","HullHealth":1.0,"timestamp":"2024-01-01T00:00:00Z"}';
    const ev = parseLine(line);
    expect(ev.event).toBe("ShipTargeted");
    expect(ev.timestamp).toBe("2024-01-01T00:00:00Z");
  });

  it("parses Shutdown", () => {
    const line = '{"timestamp":"2024-01-01T00:00:00Z","event":"Shutdown"}';
    const ev = parseLine(line);
    expect(ev.event).toBe("Shutdown");
    expect(ev.timestamp).toBe("2024-01-01T00:00:00Z");
  });

  it("parses SquadronCreated", () => {
    const line =
      '{"timestamp":"2024-01-01T00:00:00Z","SquadronName":"test","event":"SquadronCreated"}';
    const ev = parseLine(line);
    expect(ev.event).toBe("SquadronCreated");
    expect(ev.timestamp).toBe("2024-01-01T00:00:00Z");
  });

  it("parses SquadronDemotion", () => {
    const line =
      '{"OldRank":1,"SquadronName":"test","timestamp":"2024-01-01T00:00:00Z","NewRank":1,"event":"SquadronDemotion"}';
    const ev = parseLine(line);
    expect(ev.event).toBe("SquadronDemotion");
    expect(ev.timestamp).toBe("2024-01-01T00:00:00Z");
  });

  it("parses SquadronKicked", () => {
    const line =
      '{"SquadronName":"test","timestamp":"2024-01-01T00:00:00Z","PlayerName":"test","event":"SquadronKicked"}';
    const ev = parseLine(line);
    expect(ev.event).toBe("SquadronKicked");
    expect(ev.timestamp).toBe("2024-01-01T00:00:00Z");
  });

  it("parses SquadronPromotion", () => {
    const line =
      '{"OldRank":1,"SquadronName":"test","timestamp":"2024-01-01T00:00:00Z","NewRank":1,"event":"SquadronPromotion"}';
    const ev = parseLine(line);
    expect(ev.event).toBe("SquadronPromotion");
    expect(ev.timestamp).toBe("2024-01-01T00:00:00Z");
  });

  it("parses SquadronStartup", () => {
    const line =
      '{"SquadronRank":"test","SquadronFaction":"test","SquadronPowerplayState":"test","CurrentRating":1,"Rating":[{}],"SquadronAlignedPower":"test","event":"SquadronStartup","timestamp":"2024-01-01T00:00:00Z","SquadronID":1,"SquadronName":"test","SquadronHomeSystem":"test"}';
    const ev = parseLine(line);
    expect(ev.event).toBe("SquadronStartup");
    expect(ev.timestamp).toBe("2024-01-01T00:00:00Z");
  });

  it("parses StartJump", () => {
    const line =
      '{"JumpType":"test","BodyID":1,"event":"StartJump","timestamp":"2024-01-01T00:00:00Z","SystemAddress":1,"Body":"test","StarSystem":"test"}';
    const ev = parseLine(line);
    expect(ev.event).toBe("StartJump");
    expect(ev.timestamp).toBe("2024-01-01T00:00:00Z");
  });

  it("parses SupercruiseEntry", () => {
    const line =
      '{"SystemAddress":1,"timestamp":"2024-01-01T00:00:00Z","event":"SupercruiseEntry","System":"test"}';
    const ev = parseLine(line);
    expect(ev.event).toBe("SupercruiseEntry");
    expect(ev.timestamp).toBe("2024-01-01T00:00:00Z");
  });

  it("parses SupercruiseExit", () => {
    const line =
      '{"BodyID":1,"BodyType":"test","event":"SupercruiseExit","timestamp":"2024-01-01T00:00:00Z","SystemAddress":1,"Body":"test","System":"test"}';
    const ev = parseLine(line);
    expect(ev.event).toBe("SupercruiseExit");
    expect(ev.timestamp).toBe("2024-01-01T00:00:00Z");
  });

  it("parses SwitchSuitLoadout", () => {
    const line =
      '{"Modules":[{}],"SuitName_Localised":"test","event":"SwitchSuitLoadout","timestamp":"2024-01-01T00:00:00Z","SuitName":"test","SuitID":1,"LoadoutID":1,"LoadoutName":"test"}';
    const ev = parseLine(line);
    expect(ev.event).toBe("SwitchSuitLoadout");
    expect(ev.timestamp).toBe("2024-01-01T00:00:00Z");
  });

  it("parses Synthesis", () => {
    const line =
      '{"Materials":[{}],"timestamp":"2024-01-01T00:00:00Z","Name_Localised":"test","Name":"test","event":"Synthesis"}';
    const ev = parseLine(line);
    expect(ev.event).toBe("Synthesis");
    expect(ev.timestamp).toBe("2024-01-01T00:00:00Z");
  });

  it("parses Touchdown", () => {
    const line =
      '{"BodyID":1,"OnStation":true,"OnPlanet":true,"Latitude":1.0,"event":"Touchdown","timestamp":"2024-01-01T00:00:00Z","SystemAddress":1,"PlayerControlled":true,"Body":"test","System":"test","Longitude":1.0}';
    const ev = parseLine(line);
    expect(ev.event).toBe("Touchdown");
    expect(ev.timestamp).toBe("2024-01-01T00:00:00Z");
  });

  it("parses TradeMicroResources", () => {
    const line =
      '{"Offered":[{}],"timestamp":"2024-01-01T00:00:00Z","MarketID":1,"event":"TradeMicroResources","Received":[{}]}';
    const ev = parseLine(line);
    expect(ev.event).toBe("TradeMicroResources");
    expect(ev.timestamp).toBe("2024-01-01T00:00:00Z");
  });

  it("parses TransferMicroResources", () => {
    const line =
      '{"timestamp":"2024-01-01T00:00:00Z","Transfers":[{}],"event":"TransferMicroResources"}';
    const ev = parseLine(line);
    expect(ev.event).toBe("TransferMicroResources");
    expect(ev.timestamp).toBe("2024-01-01T00:00:00Z");
  });

  it("parses Undocked", () => {
    const line =
      '{"timestamp":"2024-01-01T00:00:00Z","MarketID":1,"StationName":"test","event":"Undocked","StationType":"test"}';
    const ev = parseLine(line);
    expect(ev.event).toBe("Undocked");
    expect(ev.timestamp).toBe("2024-01-01T00:00:00Z");
  });

  it("parses Undocking", () => {
    const line =
      '{"timestamp":"2024-01-01T00:00:00Z","MarketID":1,"StationName":"test","event":"Undocking"}';
    const ev = parseLine(line);
    expect(ev.event).toBe("Undocking");
    expect(ev.timestamp).toBe("2024-01-01T00:00:00Z");
  });

  it("parses UpgradeSuit", () => {
    const line =
      '{"Name":"test","Cost":1,"Name_Localised":"test","event":"UpgradeSuit","timestamp":"2024-01-01T00:00:00Z","SuitID":1,"Class":1}';
    const ev = parseLine(line);
    expect(ev.event).toBe("UpgradeSuit");
    expect(ev.timestamp).toBe("2024-01-01T00:00:00Z");
  });

  it("parses UpgradeWeapon", () => {
    const line =
      '{"Name":"test","WeaponID":1,"Cost":1,"Name_Localised":"test","event":"UpgradeWeapon","timestamp":"2024-01-01T00:00:00Z","Class":1}';
    const ev = parseLine(line);
    expect(ev.event).toBe("UpgradeWeapon");
    expect(ev.timestamp).toBe("2024-01-01T00:00:00Z");
  });

  it("parses UseConsumable", () => {
    const line =
      '{"Consumable_Localised":"test","timestamp":"2024-01-01T00:00:00Z","Consumable":"test","event":"UseConsumable","Type":"test"}';
    const ev = parseLine(line);
    expect(ev.event).toBe("UseConsumable");
    expect(ev.timestamp).toBe("2024-01-01T00:00:00Z");
  });

  it("parses WingAdd", () => {
    const line =
      '{"timestamp":"2024-01-01T00:00:00Z","Other":"test","event":"WingAdd"}';
    const ev = parseLine(line);
    expect(ev.event).toBe("WingAdd");
    expect(ev.timestamp).toBe("2024-01-01T00:00:00Z");
  });

  it("parses WingInvite", () => {
    const line =
      '{"timestamp":"2024-01-01T00:00:00Z","Other":"test","event":"WingInvite"}';
    const ev = parseLine(line);
    expect(ev.event).toBe("WingInvite");
    expect(ev.timestamp).toBe("2024-01-01T00:00:00Z");
  });

  it("parses WingJoin", () => {
    const line =
      '{"Others":[{}],"timestamp":"2024-01-01T00:00:00Z","event":"WingJoin"}';
    const ev = parseLine(line);
    expect(ev.event).toBe("WingJoin");
    expect(ev.timestamp).toBe("2024-01-01T00:00:00Z");
  });

  it("parses WingLeave", () => {
    const line = '{"timestamp":"2024-01-01T00:00:00Z","event":"WingLeave"}';
    const ev = parseLine(line);
    expect(ev.event).toBe("WingLeave");
    expect(ev.timestamp).toBe("2024-01-01T00:00:00Z");
  });
});
