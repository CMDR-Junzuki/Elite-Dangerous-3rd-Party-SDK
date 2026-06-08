"""Auto-generated schema smoke tests."""
from elite_dangerous_sdk import parse_line


def test_AfmuRepairs_parses():
    line = '{"Health":1.0,"FullyRepaired":true,"Module_Localised":"test","event":"AfmuRepairs","timestamp":"2024-01-01T00:00:00Z","Module":"test"}'
    ev = parse_line(line)
    assert ev.get("event") == "AfmuRepairs"
    assert ev.get("timestamp") == "2024-01-01T00:00:00Z"


def test_AppliedToSquadron_parses():
    line = '{"timestamp":"2024-01-01T00:00:00Z","SquadronName":"test","event":"AppliedToSquadron"}'
    ev = parse_line(line)
    assert ev.get("event") == "AppliedToSquadron"
    assert ev.get("timestamp") == "2024-01-01T00:00:00Z"


def test_ApproachBody_parses():
    line = '{"SystemAddress":1,"BodyID":1,"event":"ApproachBody","timestamp":"2024-01-01T00:00:00Z","System":"test","Body":"test"}'
    ev = parse_line(line)
    assert ev.get("event") == "ApproachBody"
    assert ev.get("timestamp") == "2024-01-01T00:00:00Z"


def test_ApproachSettlement_parses():
    line = '{"Longitude":1.0,"BodyID":1,"Name_Localised":"test","timestamp":"2024-01-01T00:00:00Z","MarketID":1,"event":"ApproachSettlement","Name":"test","SystemAddress":1,"Body":"test","Latitude":1.0}'
    ev = parse_line(line)
    assert ev.get("event") == "ApproachSettlement"
    assert ev.get("timestamp") == "2024-01-01T00:00:00Z"


def test_Backpack_parses():
    line = '{"Data":[{}],"Items":[{}],"event":"Backpack","timestamp":"2024-01-01T00:00:00Z","Components":[{}],"Consumables":[{}]}'
    ev = parse_line(line)
    assert ev.get("event") == "Backpack"
    assert ev.get("timestamp") == "2024-01-01T00:00:00Z"


def test_BackpackChange_parses():
    line = '{"Removed":[{}],"Total":1,"Type":1,"Added":[{}],"event":"BackpackChange","timestamp":"2024-01-01T00:00:00Z"}'
    ev = parse_line(line)
    assert ev.get("event") == "BackpackChange"
    assert ev.get("timestamp") == "2024-01-01T00:00:00Z"


def test_BookTaxi_parses():
    line = '{"Cost":1,"DestinationLocation":"test","event":"BookTaxi","timestamp":"2024-01-01T00:00:00Z","DestinationStation":"test","DestinationSystem":"test"}'
    ev = parse_line(line)
    assert ev.get("event") == "BookTaxi"
    assert ev.get("timestamp") == "2024-01-01T00:00:00Z"


def test_Bounty_parses():
    line = '{"TotalReward":1,"Rewards":[{}],"Target_Localised":"test","VictimFaction":"test","event":"Bounty","timestamp":"2024-01-01T00:00:00Z","Target":"test","SharedWithOthers":1,"Faction":"test"}'
    ev = parse_line(line)
    assert ev.get("event") == "Bounty"
    assert ev.get("timestamp") == "2024-01-01T00:00:00Z"


def test_BuyAmmo_parses():
    line = '{"Cost":1,"timestamp":"2024-01-01T00:00:00Z","event":"BuyAmmo"}'
    ev = parse_line(line)
    assert ev.get("event") == "BuyAmmo"
    assert ev.get("timestamp") == "2024-01-01T00:00:00Z"


def test_BuyDrones_parses():
    line = '{"Count":1,"Type":"test","Type_Localised":"test","event":"BuyDrones","timestamp":"2024-01-01T00:00:00Z","TotalCost":1,"BuyPrice":1}'
    ev = parse_line(line)
    assert ev.get("event") == "BuyDrones"
    assert ev.get("timestamp") == "2024-01-01T00:00:00Z"


def test_BuyExplorationData_parses():
    line = '{"Cost":1,"timestamp":"2024-01-01T00:00:00Z","event":"BuyExplorationData","System":"test"}'
    ev = parse_line(line)
    assert ev.get("event") == "BuyExplorationData"
    assert ev.get("timestamp") == "2024-01-01T00:00:00Z"


def test_BuyMicroResources_parses():
    line = '{"Name":"test","Category":"test","Count":1,"Cost":1,"MarketID":1,"Category_Localised":"test","event":"BuyMicroResources","timestamp":"2024-01-01T00:00:00Z","Name_Localised":"test"}'
    ev = parse_line(line)
    assert ev.get("event") == "BuyMicroResources"
    assert ev.get("timestamp") == "2024-01-01T00:00:00Z"


def test_BuySuit_parses():
    line = '{"Name":"test","Price":1,"Name_Localised":"test","event":"BuySuit","timestamp":"2024-01-01T00:00:00Z","SuitID":1,"SuitMods":["test"]}'
    ev = parse_line(line)
    assert ev.get("event") == "BuySuit"
    assert ev.get("timestamp") == "2024-01-01T00:00:00Z"


def test_BuyTradeData_parses():
    line = '{"Cost":1,"timestamp":"2024-01-01T00:00:00Z","event":"BuyTradeData","System":"test"}'
    ev = parse_line(line)
    assert ev.get("event") == "BuyTradeData"
    assert ev.get("timestamp") == "2024-01-01T00:00:00Z"


def test_BuyWeapon_parses():
    line = '{"Price":1,"WeaponID":1,"Name_Localised":"test","event":"BuyWeapon","Name":"test","timestamp":"2024-01-01T00:00:00Z"}'
    ev = parse_line(line)
    assert ev.get("event") == "BuyWeapon"
    assert ev.get("timestamp") == "2024-01-01T00:00:00Z"


def test_CancelTaxi_parses():
    line = '{"timestamp":"2024-01-01T00:00:00Z","event":"CancelTaxi","Refund":1}'
    ev = parse_line(line)
    assert ev.get("event") == "CancelTaxi"
    assert ev.get("timestamp") == "2024-01-01T00:00:00Z"


def test_CapShipBond_parses():
    line = '{"Fighter":true,"VictimFaction_Localised":"test","AwardingFaction":"test","PlayerPilot":true,"VictimFaction":"test","event":"CapShipBond","timestamp":"2024-01-01T00:00:00Z","AwardingFaction_Localised":"test","Amount":1}'
    ev = parse_line(line)
    assert ev.get("event") == "CapShipBond"
    assert ev.get("timestamp") == "2024-01-01T00:00:00Z"


def test_CarrierBankTransfer_parses():
    line = '{"CarrierBalance":1,"PlayerBalance":1,"CarrierID":1,"event":"CarrierBankTransfer","timestamp":"2024-01-01T00:00:00Z","Withdraw":1,"Deposit":1}'
    ev = parse_line(line)
    assert ev.get("event") == "CarrierBankTransfer"
    assert ev.get("timestamp") == "2024-01-01T00:00:00Z"


def test_CarrierBuy_parses():
    line = '{"Callsign":"test","Price":1,"CarrierID":1,"Variant":"test","event":"CarrierBuy","timestamp":"2024-01-01T00:00:00Z","SystemAddress":1,"Location":"test"}'
    ev = parse_line(line)
    assert ev.get("event") == "CarrierBuy"
    assert ev.get("timestamp") == "2024-01-01T00:00:00Z"


def test_CarrierCrewService_parses():
    line = '{"CrewName":"test","CarrierID":1,"event":"CarrierCrewService","timestamp":"2024-01-01T00:00:00Z","CrewRole":"test","Operation":"test"}'
    ev = parse_line(line)
    assert ev.get("event") == "CarrierCrewService"
    assert ev.get("timestamp") == "2024-01-01T00:00:00Z"


def test_CarrierDeploy_parses():
    line = '{"BodyID":1,"CarrierID":1,"event":"CarrierDeploy","timestamp":"2024-01-01T00:00:00Z","SystemAddress":1,"Body":"test","System":"test"}'
    ev = parse_line(line)
    assert ev.get("event") == "CarrierDeploy"
    assert ev.get("timestamp") == "2024-01-01T00:00:00Z"


def test_CarrierFinance_parses():
    line = '{"ReserveBalance":1,"AvailableBalance":1,"CarrierID":1,"TaxRate":1,"event":"CarrierFinance","ReservePercent":1,"timestamp":"2024-01-01T00:00:00Z"}'
    ev = parse_line(line)
    assert ev.get("event") == "CarrierFinance"
    assert ev.get("timestamp") == "2024-01-01T00:00:00Z"


def test_CarrierJump_parses():
    line = '{"SystemAddress":1,"BodyID":1,"event":"CarrierJump","timestamp":"2024-01-01T00:00:00Z","System":"test","Body":"test"}'
    ev = parse_line(line)
    assert ev.get("event") == "CarrierJump"
    assert ev.get("timestamp") == "2024-01-01T00:00:00Z"


def test_CarrierJumpRequest_parses():
    line = '{"BodyID":1,"event":"CarrierJumpRequest","timestamp":"2024-01-01T00:00:00Z","SystemAddress":1,"DepartureTime":"test","Body":"test","System":"test"}'
    ev = parse_line(line)
    assert ev.get("event") == "CarrierJumpRequest"
    assert ev.get("timestamp") == "2024-01-01T00:00:00Z"


def test_CarrierModulePack_parses():
    line = '{"CarrierID":1,"Cost":1,"Operation":"test","PackTier":1,"event":"CarrierModulePack","timestamp":"2024-01-01T00:00:00Z","PackTheme":"test","PackTheme_Localised":"test"}'
    ev = parse_line(line)
    assert ev.get("event") == "CarrierModulePack"
    assert ev.get("timestamp") == "2024-01-01T00:00:00Z"


def test_CarrierNameChange_parses():
    line = '{"Callsign":"test","Name":"test","CarrierID":1,"Name_Localised":"test","event":"CarrierNameChange","timestamp":"2024-01-01T00:00:00Z"}'
    ev = parse_line(line)
    assert ev.get("event") == "CarrierNameChange"
    assert ev.get("timestamp") == "2024-01-01T00:00:00Z"


def test_CarrierSell_parses():
    line = '{"Callsign":"test","Price":1,"CarrierID":1,"event":"CarrierSell","timestamp":"2024-01-01T00:00:00Z","SystemAddress":1,"Location":"test"}'
    ev = parse_line(line)
    assert ev.get("event") == "CarrierSell"
    assert ev.get("timestamp") == "2024-01-01T00:00:00Z"


def test_CarrierShipPack_parses():
    line = '{"CarrierID":1,"Cost":1,"Operation":"test","PackTier":1,"event":"CarrierShipPack","timestamp":"2024-01-01T00:00:00Z","PackTheme":"test","PackTheme_Localised":"test"}'
    ev = parse_line(line)
    assert ev.get("event") == "CarrierShipPack"
    assert ev.get("timestamp") == "2024-01-01T00:00:00Z"


def test_CarrierStats_parses():
    line = '{"AllowNotorious":true,"Theme":"test","Market":true,"Shipyard":true,"Callsign":"test","Name":"test","FuelLevel":1.0,"PendingDecommision":true,"JumpRangeCurr":1.0,"Refuel":true,"SpaceAccess":"test","VoucherExploration":true,"VoucherTrade":true,"Rearm":true,"DockingAccess":"test","CarrierID":1,"JumpRangeMax":1.0,"timestamp":"2024-01-01T00:00:00Z","Name_Localised":"test","VoucherMarket":true,"Outfitting":true,"Pack":[{}],"event":"CarrierStats","ExoBiology":true,"Repair":true}'
    ev = parse_line(line)
    assert ev.get("event") == "CarrierStats"
    assert ev.get("timestamp") == "2024-01-01T00:00:00Z"


def test_CarrierTradeOrder_parses():
    line = '{"PurchaseOrder":1,"Price":1,"CarrierID":1,"Stock":1,"Commodity_Localised":"test","event":"CarrierTradeOrder","timestamp":"2024-01-01T00:00:00Z","CancelTrade":true,"SaleOrder":1,"BlackMarket":true,"Commodity":"test"}'
    ev = parse_line(line)
    assert ev.get("event") == "CarrierTradeOrder"
    assert ev.get("timestamp") == "2024-01-01T00:00:00Z"


def test_ChangeCrewAssignedRole_parses():
    line = '{"timestamp":"2024-01-01T00:00:00Z","event":"ChangeCrewAssignedRole","Role":"test"}'
    ev = parse_line(line)
    assert ev.get("event") == "ChangeCrewAssignedRole"
    assert ev.get("timestamp") == "2024-01-01T00:00:00Z"


def test_CodexEntry_parses():
    line = '{"Latitude":1.0,"SystemAddress":1,"Body":"test","Name":"test","NearestDestination":"test","BodyID":1,"Category_Localised":"test","SubCategory_Localised":"test","SubCategory":"test","VoucherAmount":1,"NearestDestination_Localised":"test","Region_Localised":"test","Longitude":1.0,"Region":"test","Category":"test","timestamp":"2024-01-01T00:00:00Z","Name_Localised":"test","event":"CodexEntry","System":"test"}'
    ev = parse_line(line)
    assert ev.get("event") == "CodexEntry"
    assert ev.get("timestamp") == "2024-01-01T00:00:00Z"


def test_CollectItems_parses():
    line = '{"MissionID":1,"OwnerID":1,"Type":"test","Stolen":true,"event":"CollectItems","Name":"test","Name_Localised":"test","timestamp":"2024-01-01T00:00:00Z"}'
    ev = parse_line(line)
    assert ev.get("event") == "CollectItems"
    assert ev.get("timestamp") == "2024-01-01T00:00:00Z"


def test_CollectMicroResources_parses():
    line = '{"timestamp":"2024-01-01T00:00:00Z","Items":[{}],"event":"CollectMicroResources"}'
    ev = parse_line(line)
    assert ev.get("event") == "CollectMicroResources"
    assert ev.get("timestamp") == "2024-01-01T00:00:00Z"


def test_CommitCrime_parses():
    line = '{"Victim":"test","Bounty":1,"CrimeType":"test","event":"CommitCrime","timestamp":"2024-01-01T00:00:00Z","Fine":1,"Faction":"test","Victim_Localised":"test"}'
    ev = parse_line(line)
    assert ev.get("event") == "CommitCrime"
    assert ev.get("timestamp") == "2024-01-01T00:00:00Z"


def test_CommunityGoal_parses():
    line = '{"timestamp":"2024-01-01T00:00:00Z","CurrentGoals":[{}],"event":"CommunityGoal"}'
    ev = parse_line(line)
    assert ev.get("event") == "CommunityGoal"
    assert ev.get("timestamp") == "2024-01-01T00:00:00Z"


def test_CommunityGoalDiscard_parses():
    line = '{"CGID":1,"MarketName":"test","Name_Localised":"test","event":"CommunityGoalDiscard","Name":"test","SystemName":"test","timestamp":"2024-01-01T00:00:00Z"}'
    ev = parse_line(line)
    assert ev.get("event") == "CommunityGoalDiscard"
    assert ev.get("timestamp") == "2024-01-01T00:00:00Z"


def test_CommunityGoalJoin_parses():
    line = '{"CGID":1,"MarketName":"test","Name_Localised":"test","event":"CommunityGoalJoin","Name":"test","SystemName":"test","timestamp":"2024-01-01T00:00:00Z"}'
    ev = parse_line(line)
    assert ev.get("event") == "CommunityGoalJoin"
    assert ev.get("timestamp") == "2024-01-01T00:00:00Z"


def test_CommunityGoalReward_parses():
    line = '{"DetailReward":1,"MarketName":"test","CGID":1,"Name_Localised":"test","event":"CommunityGoalReward","Name":"test","SystemName":"test","Reward":1,"timestamp":"2024-01-01T00:00:00Z"}'
    ev = parse_line(line)
    assert ev.get("event") == "CommunityGoalReward"
    assert ev.get("timestamp") == "2024-01-01T00:00:00Z"


def test_Continued_parses():
    line = '{"timestamp":"2024-01-01T00:00:00Z","Part":1,"event":"Continued"}'
    ev = parse_line(line)
    assert ev.get("event") == "Continued"
    assert ev.get("timestamp") == "2024-01-01T00:00:00Z"


def test_CreateSuitLoadout_parses():
    line = '{"Modules":[{}],"SuitName_Localised":"test","event":"CreateSuitLoadout","timestamp":"2024-01-01T00:00:00Z","SuitName":"test","SuitID":1,"SuitMods":["test"],"LoadoutName":"test"}'
    ev = parse_line(line)
    assert ev.get("event") == "CreateSuitLoadout"
    assert ev.get("timestamp") == "2024-01-01T00:00:00Z"


def test_CrewFire_parses():
    line = '{"CombatRank":1,"timestamp":"2024-01-01T00:00:00Z","Name":"test","event":"CrewFire"}'
    ev = parse_line(line)
    assert ev.get("event") == "CrewFire"
    assert ev.get("timestamp") == "2024-01-01T00:00:00Z"


def test_CrewHire_parses():
    line = '{"Name":"test","Cost":1,"event":"CrewHire","timestamp":"2024-01-01T00:00:00Z","CombatRank":1,"Faction":"test"}'
    ev = parse_line(line)
    assert ev.get("event") == "CrewHire"
    assert ev.get("timestamp") == "2024-01-01T00:00:00Z"


def test_CrewLaunchFighter_parses():
    line = '{"Loadout_Localised":"test","ID":1,"Crew":"test","Loadout":"test","event":"CrewLaunchFighter","timestamp":"2024-01-01T00:00:00Z"}'
    ev = parse_line(line)
    assert ev.get("event") == "CrewLaunchFighter"
    assert ev.get("timestamp") == "2024-01-01T00:00:00Z"


def test_CrewMemberJoins_parses():
    line = '{"Telepresence":true,"CombatRank":1,"timestamp":"2024-01-01T00:00:00Z","Crew":"test","event":"CrewMemberJoins"}'
    ev = parse_line(line)
    assert ev.get("event") == "CrewMemberJoins"
    assert ev.get("timestamp") == "2024-01-01T00:00:00Z"


def test_CrewMemberQuits_parses():
    line = '{"Telepresence":true,"timestamp":"2024-01-01T00:00:00Z","Crew":"test","event":"CrewMemberQuits"}'
    ev = parse_line(line)
    assert ev.get("event") == "CrewMemberQuits"
    assert ev.get("timestamp") == "2024-01-01T00:00:00Z"


def test_CrewMemberRoleChange_parses():
    line = '{"Telepresence":true,"timestamp":"2024-01-01T00:00:00Z","Crew":"test","event":"CrewMemberRoleChange","Role":"test"}'
    ev = parse_line(line)
    assert ev.get("event") == "CrewMemberRoleChange"
    assert ev.get("timestamp") == "2024-01-01T00:00:00Z"


def test_CrewRoleRepair_parses():
    line = '{"CrewID":1,"timestamp":"2024-01-01T00:00:00Z","event":"CrewRoleRepair"}'
    ev = parse_line(line)
    assert ev.get("event") == "CrewRoleRepair"
    assert ev.get("timestamp") == "2024-01-01T00:00:00Z"


def test_DataScanned_parses():
    line = '{"timestamp":"2024-01-01T00:00:00Z","Type":"test","Type_Localised":"test","event":"DataScanned"}'
    ev = parse_line(line)
    assert ev.get("event") == "DataScanned"
    assert ev.get("timestamp") == "2024-01-01T00:00:00Z"


def test_DeleteSuitLoadout_parses():
    line = '{"SuitName_Localised":"test","event":"DeleteSuitLoadout","timestamp":"2024-01-01T00:00:00Z","SuitName":"test","SuitID":1,"LoadoutID":1,"LoadoutName":"test"}'
    ev = parse_line(line)
    assert ev.get("event") == "DeleteSuitLoadout"
    assert ev.get("timestamp") == "2024-01-01T00:00:00Z"


def test_Died_parses():
    line = '{"KillerRank":"test","event":"Died","timestamp":"2024-01-01T00:00:00Z","KillerName_Localised":"test","KillerShip":"test","KillerName":"test","Killers":[{}]}'
    ev = parse_line(line)
    assert ev.get("event") == "Died"
    assert ev.get("timestamp") == "2024-01-01T00:00:00Z"


def test_DisbandedSquadron_parses():
    line = '{"timestamp":"2024-01-01T00:00:00Z","SquadronName":"test","event":"DisbandedSquadron"}'
    ev = parse_line(line)
    assert ev.get("event") == "DisbandedSquadron"
    assert ev.get("timestamp") == "2024-01-01T00:00:00Z"


def test_Disembark_parses():
    line = '{"SystemAddress":1,"Body":"test","Multicrew":true,"SRV":true,"BodyID":1,"MarketID":1,"OnPlanet":true,"Taxi":true,"StationType":"test","OnStation":true,"StarSystem":"test","event":"Disembark","StationName":"test","timestamp":"2024-01-01T00:00:00Z"}'
    ev = parse_line(line)
    assert ev.get("event") == "Disembark"
    assert ev.get("timestamp") == "2024-01-01T00:00:00Z"


def test_DockFighter_parses():
    line = '{"timestamp":"2024-01-01T00:00:00Z","ID":1,"event":"DockFighter"}'
    ev = parse_line(line)
    assert ev.get("event") == "DockFighter"
    assert ev.get("timestamp") == "2024-01-01T00:00:00Z"


def test_DockSRV_parses():
    line = '{"timestamp":"2024-01-01T00:00:00Z","ID":1,"event":"DockSRV"}'
    ev = parse_line(line)
    assert ev.get("event") == "DockSRV"
    assert ev.get("timestamp") == "2024-01-01T00:00:00Z"


def test_Docked_parses():
    line = '{"timestamp":"2024-01-01T00:00:00Z","event":"Docked","StationName":"test","StationType":"test","StarSystem":"test","SystemAddress":1,"MarketID":1,"StationServices":["test"],"StationEconomy":"test","StationEconomies":[{}],"StationAllegiance":"test","StationGovernment":"test","StationState":"test","LandingPads":{},"CockpitBreach":true,"Wanted":true,"ActiveFine":true,"DistFromStarLS":1.0,"PowerplayState":"test","Powers":["test"],"Taxoname":"test"}'
    ev = parse_line(line)
    assert ev.get("event") == "Docked"
    assert ev.get("timestamp") == "2024-01-01T00:00:00Z"


def test_DockingCancelled_parses():
    line = '{"timestamp":"2024-01-01T00:00:00Z","MarketID":1,"StationName":"test","event":"DockingCancelled"}'
    ev = parse_line(line)
    assert ev.get("event") == "DockingCancelled"
    assert ev.get("timestamp") == "2024-01-01T00:00:00Z"


def test_DockingDenied_parses():
    line = '{"MarketID":1,"event":"DockingDenied","timestamp":"2024-01-01T00:00:00Z","StationType":"test","Reason":"test","StationName":"test"}'
    ev = parse_line(line)
    assert ev.get("event") == "DockingDenied"
    assert ev.get("timestamp") == "2024-01-01T00:00:00Z"


def test_DockingGranted_parses():
    line = '{"MarketID":1,"event":"DockingGranted","timestamp":"2024-01-01T00:00:00Z","StationType":"test","LandingPad":1,"StationName":"test"}'
    ev = parse_line(line)
    assert ev.get("event") == "DockingGranted"
    assert ev.get("timestamp") == "2024-01-01T00:00:00Z"


def test_DockingRequested_parses():
    line = '{"MarketID":1,"event":"DockingRequested","timestamp":"2024-01-01T00:00:00Z","StationType":"test","LandingPad":1,"StationName":"test"}'
    ev = parse_line(line)
    assert ev.get("event") == "DockingRequested"
    assert ev.get("timestamp") == "2024-01-01T00:00:00Z"


def test_DockingTimeout_parses():
    line = '{"timestamp":"2024-01-01T00:00:00Z","MarketID":1,"StationName":"test","event":"DockingTimeout"}'
    ev = parse_line(line)
    assert ev.get("event") == "DockingTimeout"
    assert ev.get("timestamp") == "2024-01-01T00:00:00Z"


def test_DropShipDeploy_parses():
    line = '{"SystemAddress":1,"BodyID":1,"OnStation":true,"OnPlanet":true,"MarketID":1,"event":"DropShipDeploy","timestamp":"2024-01-01T00:00:00Z","StationType":"test","Body":"test","StarSystem":"test","StationName":"test"}'
    ev = parse_line(line)
    assert ev.get("event") == "DropShipDeploy"
    assert ev.get("timestamp") == "2024-01-01T00:00:00Z"


def test_EjectCargo_parses():
    line = '{"MissionID":1,"Type":"test","Count":1,"event":"EjectCargo","timestamp":"2024-01-01T00:00:00Z","Powerplay":true,"Type_Localised":"test","Abandoned":true}'
    ev = parse_line(line)
    assert ev.get("event") == "EjectCargo"
    assert ev.get("timestamp") == "2024-01-01T00:00:00Z"


def test_Embark_parses():
    line = '{"SystemAddress":1,"Body":"test","Multicrew":true,"SRV":true,"BodyID":1,"MarketID":1,"OnPlanet":true,"Taxi":true,"StationType":"test","OnStation":true,"StarSystem":"test","event":"Embark","StationName":"test","timestamp":"2024-01-01T00:00:00Z"}'
    ev = parse_line(line)
    assert ev.get("event") == "Embark"
    assert ev.get("timestamp") == "2024-01-01T00:00:00Z"


def test_EndCrewSession_parses():
    line = '{"timestamp":"2024-01-01T00:00:00Z","event":"EndCrewSession"}'
    ev = parse_line(line)
    assert ev.get("event") == "EndCrewSession"
    assert ev.get("timestamp") == "2024-01-01T00:00:00Z"


def test_EngineerApply_parses():
    line = '{"Blueprint":"test","BlueprintID":1,"Engineer":"test","Level":1,"event":"EngineerApply","timestamp":"2024-01-01T00:00:00Z"}'
    ev = parse_line(line)
    assert ev.get("event") == "EngineerApply"
    assert ev.get("timestamp") == "2024-01-01T00:00:00Z"


def test_EngineerCraft_parses():
    line = '{"ExperimentalEffect":"test","Quality":1.0,"Modifiers":[{}],"Engineer":"test","EngineerID":1,"Level":1,"event":"EngineerCraft","timestamp":"2024-01-01T00:00:00Z","Ingredients":[{}],"BlueprintID":1,"ExperimentalEffect_Localised":"test","Blueprint":"test"}'
    ev = parse_line(line)
    assert ev.get("event") == "EngineerCraft"
    assert ev.get("timestamp") == "2024-01-01T00:00:00Z"


def test_EngineerProgress_parses():
    line = '{"timestamp":"2024-01-01T00:00:00Z","event":"EngineerProgress","Engineers":[{}]}'
    ev = parse_line(line)
    assert ev.get("event") == "EngineerProgress"
    assert ev.get("timestamp") == "2024-01-01T00:00:00Z"


def test_FCMaterials_parses():
    line = '{"Data":[{}],"Items":[{}],"event":"FCMaterials","timestamp":"2024-01-01T00:00:00Z","Components":[{}],"Consumables":[{}]}'
    ev = parse_line(line)
    assert ev.get("event") == "FCMaterials"
    assert ev.get("timestamp") == "2024-01-01T00:00:00Z"


def test_FCMaterialsCAPI_parses():
    line = '{"CarrierName_Localised":"test","Data":[{}],"Items":[{}],"MarketID":1,"event":"FCMaterialsCAPI","timestamp":"2024-01-01T00:00:00Z","Components":[{}],"Consumables":[{}],"CarrierName":"test"}'
    ev = parse_line(line)
    assert ev.get("event") == "FCMaterialsCAPI"
    assert ev.get("timestamp") == "2024-01-01T00:00:00Z"


def test_FSDJump_parses():
    line = '{"timestamp":"2024-01-01T00:00:00Z","event":"FSDJump","StarSystem":"test","SystemAddress":1,"StarPos":[1.0],"SystemAllegiance":"test","SystemEconomy":"test","SystemSecondEconomy":"test","SystemGovernment":"test","SystemSecurity":"test","Population":1,"PowerplayState":"test","Powers":["test"],"JumpDist":1.0,"FuelUsed":1.0,"FuelLevel":1.0,"BoostUsed":1.0,"Factions":["test"],"Conflicts":["test"],"Body":"test","BodyID":1,"Taxoname":"test"}'
    ev = parse_line(line)
    assert ev.get("event") == "FSDJump"
    assert ev.get("timestamp") == "2024-01-01T00:00:00Z"


def test_FSSBodySignals_parses():
    line = '{"BodyID":1,"BodyName":"test","event":"FSSBodySignals","Signals":[{}],"SystemAddress":1,"timestamp":"2024-01-01T00:00:00Z"}'
    ev = parse_line(line)
    assert ev.get("event") == "FSSBodySignals"
    assert ev.get("timestamp") == "2024-01-01T00:00:00Z"


def test_FSSSignalDiscovered_parses():
    line = '{"USSType_Localised":"test","SignalName_Localised":"test","SpawningFaction":"test","ThargoidWar":"test","event":"FSSSignalDiscovered","timestamp":"2024-01-01T00:00:00Z","SystemAddress":1,"USSType":"test","SpawningState":"test","SignalName":"test"}'
    ev = parse_line(line)
    assert ev.get("event") == "FSSSignalDiscovered"
    assert ev.get("timestamp") == "2024-01-01T00:00:00Z"


def test_FactionKillBond_parses():
    line = '{"VictimFaction_Localised":"test","AwardingFaction":"test","VictimFaction":"test","event":"FactionKillBond","timestamp":"2024-01-01T00:00:00Z","AwardingFaction_Localised":"test","Amount":1}'
    ev = parse_line(line)
    assert ev.get("event") == "FactionKillBond"
    assert ev.get("timestamp") == "2024-01-01T00:00:00Z"


def test_FighterDestroyed_parses():
    line = '{"timestamp":"2024-01-01T00:00:00Z","ID":1,"event":"FighterDestroyed"}'
    ev = parse_line(line)
    assert ev.get("event") == "FighterDestroyed"
    assert ev.get("timestamp") == "2024-01-01T00:00:00Z"


def test_FileHeader_parses():
    line = '{"timestamp":"2024-01-01T00:00:00Z","event":"FileHeader","part":1,"language":"test","gameversion":"test","build":"test","odyssey":true}'
    ev = parse_line(line)
    assert ev.get("event") == "FileHeader"
    assert ev.get("timestamp") == "2024-01-01T00:00:00Z"


def test_FuelScoop_parses():
    line = '{"Total":1.0,"timestamp":"2024-01-01T00:00:00Z","event":"FuelScoop","Scooped":1.0}'
    ev = parse_line(line)
    assert ev.get("event") == "FuelScoop"
    assert ev.get("timestamp") == "2024-01-01T00:00:00Z"


def test_HeatDamage_parses():
    line = '{"timestamp":"2024-01-01T00:00:00Z","event":"HeatDamage"}'
    ev = parse_line(line)
    assert ev.get("event") == "HeatDamage"
    assert ev.get("timestamp") == "2024-01-01T00:00:00Z"


def test_HeatWarning_parses():
    line = '{"timestamp":"2024-01-01T00:00:00Z","event":"HeatWarning"}'
    ev = parse_line(line)
    assert ev.get("event") == "HeatWarning"
    assert ev.get("timestamp") == "2024-01-01T00:00:00Z"


def test_HullDamage_parses():
    line = '{"PlayerPilot":true,"timestamp":"2024-01-01T00:00:00Z","Health":1.0,"event":"HullDamage","Fighter":true}'
    ev = parse_line(line)
    assert ev.get("event") == "HullDamage"
    assert ev.get("timestamp") == "2024-01-01T00:00:00Z"


def test_InvitedToSquadron_parses():
    line = '{"InviterName_Localised":"test","timestamp":"2024-01-01T00:00:00Z","SquadronName":"test","event":"InvitedToSquadron","InviterName":"test"}'
    ev = parse_line(line)
    assert ev.get("event") == "InvitedToSquadron"
    assert ev.get("timestamp") == "2024-01-01T00:00:00Z"


def test_JoinACrew_parses():
    line = '{"Captain_Localised":"test","timestamp":"2024-01-01T00:00:00Z","event":"JoinACrew","Captain":"test"}'
    ev = parse_line(line)
    assert ev.get("event") == "JoinACrew"
    assert ev.get("timestamp") == "2024-01-01T00:00:00Z"


def test_JoinedSquadron_parses():
    line = '{"timestamp":"2024-01-01T00:00:00Z","SquadronName":"test","event":"JoinedSquadron"}'
    ev = parse_line(line)
    assert ev.get("event") == "JoinedSquadron"
    assert ev.get("timestamp") == "2024-01-01T00:00:00Z"


def test_KickCrewMember_parses():
    line = '{"Telepresence":true,"timestamp":"2024-01-01T00:00:00Z","Crew":"test","event":"KickCrewMember"}'
    ev = parse_line(line)
    assert ev.get("event") == "KickCrewMember"
    assert ev.get("timestamp") == "2024-01-01T00:00:00Z"


def test_KickedFromSquadron_parses():
    line = '{"timestamp":"2024-01-01T00:00:00Z","SquadronName":"test","event":"KickedFromSquadron"}'
    ev = parse_line(line)
    assert ev.get("event") == "KickedFromSquadron"
    assert ev.get("timestamp") == "2024-01-01T00:00:00Z"


def test_LaunchFighter_parses():
    line = '{"Loadout":"test","Loadout_Localised":"test","timestamp":"2024-01-01T00:00:00Z","PlayerControlled":true,"event":"LaunchFighter"}'
    ev = parse_line(line)
    assert ev.get("event") == "LaunchFighter"
    assert ev.get("timestamp") == "2024-01-01T00:00:00Z"


def test_LaunchSRV_parses():
    line = '{"Loadout_Localised":"test","ID":1,"Loadout":"test","event":"LaunchSRV","timestamp":"2024-01-01T00:00:00Z","PlayerControlled":true}'
    ev = parse_line(line)
    assert ev.get("event") == "LaunchSRV"
    assert ev.get("timestamp") == "2024-01-01T00:00:00Z"


def test_LeaveBody_parses():
    line = '{"SystemAddress":1,"BodyID":1,"event":"LeaveBody","timestamp":"2024-01-01T00:00:00Z","System":"test","Body":"test"}'
    ev = parse_line(line)
    assert ev.get("event") == "LeaveBody"
    assert ev.get("timestamp") == "2024-01-01T00:00:00Z"


def test_LeftSquadron_parses():
    line = '{"SquadronName":"test","timestamp":"2024-01-01T00:00:00Z","OldRank":1,"event":"LeftSquadron"}'
    ev = parse_line(line)
    assert ev.get("event") == "LeftSquadron"
    assert ev.get("timestamp") == "2024-01-01T00:00:00Z"


def test_Liftoff_parses():
    line = '{"BodyID":1,"OnStation":true,"OnPlanet":true,"Latitude":1.0,"event":"Liftoff","timestamp":"2024-01-01T00:00:00Z","SystemAddress":1,"PlayerControlled":true,"Body":"test","System":"test","Longitude":1.0}'
    ev = parse_line(line)
    assert ev.get("event") == "Liftoff"
    assert ev.get("timestamp") == "2024-01-01T00:00:00Z"


def test_LoadGame_parses():
    line = '{"timestamp":"2024-01-01T00:00:00Z","event":"LoadGame","Commander":"test","FID":"test","Ship":"test","ShipID":1,"ShipName":"test","ShipIdent":"test","FuelLevel":1.0,"FuelCapacity":1.0,"GameMode":"test","Group":"test","Credits":1,"Loan":1,"Horizons":true,"Odyssey":true,"language":"test","gameversion":"test","build":"test"}'
    ev = parse_line(line)
    assert ev.get("event") == "LoadGame"
    assert ev.get("timestamp") == "2024-01-01T00:00:00Z"


def test_Location_parses():
    line = '{"timestamp":"2024-01-01T00:00:00Z","event":"Location","StarSystem":"test","SystemAddress":1,"StarPos":[1.0],"Body":"test","BodyID":1,"BodyType":"test","Docked":true,"StationName":"test","StationType":"test","MarketID":1,"SystemAllegiance":"test","SystemEconomy":"test","SystemSecondEconomy":"test","SystemGovernment":"test","SystemSecurity":"test","Population":1,"PowerplayState":"test","Powers":["test"]}'
    ev = parse_line(line)
    assert ev.get("event") == "Location"
    assert ev.get("timestamp") == "2024-01-01T00:00:00Z"


def test_MarketBuy_parses():
    line = '{"Count":1,"Type":"test","TotalCost":1,"MarketID":1,"event":"MarketBuy","timestamp":"2024-01-01T00:00:00Z","Type_Localised":"test","BuyPrice":1}'
    ev = parse_line(line)
    assert ev.get("event") == "MarketBuy"
    assert ev.get("timestamp") == "2024-01-01T00:00:00Z"


def test_MarketSell_parses():
    line = '{"IllegalGoods":true,"TotalSale":1,"Type":"test","Type_Localised":"test","AvgPricePaid":1,"MarketID":1,"event":"MarketSell","timestamp":"2024-01-01T00:00:00Z","Count":1,"SellPrice":1,"BlackMarket":true,"Stolen":true}'
    ev = parse_line(line)
    assert ev.get("event") == "MarketSell"
    assert ev.get("timestamp") == "2024-01-01T00:00:00Z"


def test_MaterialCollected_parses():
    line = '{"Name":"test","Count":1,"Category":"test","Name_Localised":"test","event":"MaterialCollected","timestamp":"2024-01-01T00:00:00Z"}'
    ev = parse_line(line)
    assert ev.get("event") == "MaterialCollected"
    assert ev.get("timestamp") == "2024-01-01T00:00:00Z"


def test_MaterialDiscarded_parses():
    line = '{"Name":"test","Count":1,"Category":"test","Name_Localised":"test","event":"MaterialDiscarded","timestamp":"2024-01-01T00:00:00Z"}'
    ev = parse_line(line)
    assert ev.get("event") == "MaterialDiscarded"
    assert ev.get("timestamp") == "2024-01-01T00:00:00Z"


def test_MaterialDiscovered_parses():
    line = '{"Name":"test","Category":"test","Name_Localised":"test","event":"MaterialDiscovered","timestamp":"2024-01-01T00:00:00Z","DiscoveryNumber":1}'
    ev = parse_line(line)
    assert ev.get("event") == "MaterialDiscovered"
    assert ev.get("timestamp") == "2024-01-01T00:00:00Z"


def test_MaterialTrade_parses():
    line = '{"Traded":{},"MarketID":1,"event":"MaterialTrade","timestamp":"2024-01-01T00:00:00Z","TraderType":"test","Received":{}}'
    ev = parse_line(line)
    assert ev.get("event") == "MaterialTrade"
    assert ev.get("timestamp") == "2024-01-01T00:00:00Z"


def test_MiningRefined_parses():
    line = '{"Commodity_Localised":"test","timestamp":"2024-01-01T00:00:00Z","Type":"test","Type_Localised":"test","event":"MiningRefined"}'
    ev = parse_line(line)
    assert ev.get("event") == "MiningRefined"
    assert ev.get("timestamp") == "2024-01-01T00:00:00Z"


def test_MissionAbandoned_parses():
    line = '{"MissionID":1,"Name_Localised":"test","event":"MissionAbandoned","Name":"test","Fine":1,"timestamp":"2024-01-01T00:00:00Z"}'
    ev = parse_line(line)
    assert ev.get("event") == "MissionAbandoned"
    assert ev.get("timestamp") == "2024-01-01T00:00:00Z"


def test_MissionAccepted_parses():
    line = '{"timestamp":"2024-01-01T00:00:00Z","Count":1,"Reward":1,"Target":"test","TargetType_Localised":"test","KillCount":1,"DestinationStation":"test","Expiry":"test","CommodityReward":[{}],"Wing":true,"Commodity":"test","PassengerType":"test","MaterialsRequired":[{}],"InfluenceGain":"test","LocalisedName":"test","ReputationGain":"test","PassengerWanted":true,"Influence":"test","MissionID":1,"Faction":"test","TargetCommodity":"test","Name_Localised":"test","Commodity_Localised":"test","Reputation":"test","Donated":1,"PassengerCount":1,"TargetType":"test","TargetFaction":"test","Target_Localised":"test","DestinationSystem":"test","event":"MissionAccepted","PassengerVIPs":true,"Name":"test","PassengerMission":true,"TargetCommodity_Localised":"test","Donation":"test","MinJumps":1}'
    ev = parse_line(line)
    assert ev.get("event") == "MissionAccepted"
    assert ev.get("timestamp") == "2024-01-01T00:00:00Z"


def test_MissionCompleted_parses():
    line = '{"Donated":1,"MaterialsReward":[{}],"Commodity":"test","Count":1,"PermitsAwarded":[{}],"TargetFaction":"test","DestinationStation":"test","Reward":1,"RewardDetail_Localised":"test","Name":"test","Donation":"test","RewardDetail":"test","DestinationSystem":"test","FactionEffect":[{}],"Faction":"test","Name_Localised":"test","MissionID":1,"KillCount":1,"Commodity_Localised":"test","event":"MissionCompleted","CommodityReward":[{}],"timestamp":"2024-01-01T00:00:00Z"}'
    ev = parse_line(line)
    assert ev.get("event") == "MissionCompleted"
    assert ev.get("timestamp") == "2024-01-01T00:00:00Z"


def test_MissionFailed_parses():
    line = '{"MissionID":1,"Name":"test","Name_Localised":"test","event":"MissionFailed","timestamp":"2024-01-01T00:00:00Z","Fine":1,"Faction":"test"}'
    ev = parse_line(line)
    assert ev.get("event") == "MissionFailed"
    assert ev.get("timestamp") == "2024-01-01T00:00:00Z"


def test_MissionRedirected_parses():
    line = '{"MissionID":1,"NewDestinationStation":"test","NewDestinationSystem":"test","Name_Localised":"test","OldDestinationSystem":"test","event":"MissionRedirected","Name":"test","OldDestinationStation":"test","timestamp":"2024-01-01T00:00:00Z"}'
    ev = parse_line(line)
    assert ev.get("event") == "MissionRedirected"
    assert ev.get("timestamp") == "2024-01-01T00:00:00Z"


def test_ModuleInfo_parses():
    line = '{"Modules":[{}],"timestamp":"2024-01-01T00:00:00Z","event":"ModuleInfo"}'
    ev = parse_line(line)
    assert ev.get("event") == "ModuleInfo"
    assert ev.get("timestamp") == "2024-01-01T00:00:00Z"


def test_Music_parses():
    line = '{"MusicTrack":"test","timestamp":"2024-01-01T00:00:00Z","event":"Music"}'
    ev = parse_line(line)
    assert ev.get("event") == "Music"
    assert ev.get("timestamp") == "2024-01-01T00:00:00Z"


def test_NavBeaconScan_parses():
    line = '{"SystemAddress":1,"timestamp":"2024-01-01T00:00:00Z","NumBodies":1,"event":"NavBeaconScan"}'
    ev = parse_line(line)
    assert ev.get("event") == "NavBeaconScan"
    assert ev.get("timestamp") == "2024-01-01T00:00:00Z"


def test_NavRoute_parses():
    line = '{"timestamp":"2024-01-01T00:00:00Z","event":"NavRoute","Route":[{}]}'
    ev = parse_line(line)
    assert ev.get("event") == "NavRoute"
    assert ev.get("timestamp") == "2024-01-01T00:00:00Z"


def test_NavRouteClear_parses():
    line = '{"timestamp":"2024-01-01T00:00:00Z","event":"NavRouteClear"}'
    ev = parse_line(line)
    assert ev.get("event") == "NavRouteClear"
    assert ev.get("timestamp") == "2024-01-01T00:00:00Z"


def test_PVPKill_parses():
    line = '{"Victim_Localised":"test","timestamp":"2024-01-01T00:00:00Z","CombatRank":1,"event":"PVPKill","Victim":"test"}'
    ev = parse_line(line)
    assert ev.get("event") == "PVPKill"
    assert ev.get("timestamp") == "2024-01-01T00:00:00Z"


def test_PayFines_parses():
    line = '{"Amount":1,"timestamp":"2024-01-01T00:00:00Z","AllFines":true,"event":"PayFines","BrokerPercentage":1.0}'
    ev = parse_line(line)
    assert ev.get("event") == "PayFines"
    assert ev.get("timestamp") == "2024-01-01T00:00:00Z"


def test_PayLegacyFines_parses():
    line = '{"Amount":1,"timestamp":"2024-01-01T00:00:00Z","event":"PayLegacyFines","BrokerPercentage":1.0}'
    ev = parse_line(line)
    assert ev.get("event") == "PayLegacyFines"
    assert ev.get("timestamp") == "2024-01-01T00:00:00Z"


def test_PlanetApproach_parses():
    line = '{"Body":"test","SystemAddress":1,"timestamp":"2024-01-01T00:00:00Z","event":"PlanetApproach","BodyID":1}'
    ev = parse_line(line)
    assert ev.get("event") == "PlanetApproach"
    assert ev.get("timestamp") == "2024-01-01T00:00:00Z"


def test_Powerplay_parses():
    line = '{"TimePledged":1,"Rank":1,"Merits":1,"Rating":1,"Votes":1,"event":"Powerplay","timestamp":"2024-01-01T00:00:00Z","Power":"test","PowerplayState":"test"}'
    ev = parse_line(line)
    assert ev.get("event") == "Powerplay"
    assert ev.get("timestamp") == "2024-01-01T00:00:00Z"


def test_PowerplayDefect_parses():
    line = '{"ToPower":"test","timestamp":"2024-01-01T00:00:00Z","event":"PowerplayDefect","FromPower":"test"}'
    ev = parse_line(line)
    assert ev.get("event") == "PowerplayDefect"
    assert ev.get("timestamp") == "2024-01-01T00:00:00Z"


def test_PowerplayDeliver_parses():
    line = '{"Type":"test","Count":1,"event":"PowerplayDeliver","timestamp":"2024-01-01T00:00:00Z","Power":"test","Type_Localised":"test"}'
    ev = parse_line(line)
    assert ev.get("event") == "PowerplayDeliver"
    assert ev.get("timestamp") == "2024-01-01T00:00:00Z"


def test_PowerplayFastTrack_parses():
    line = '{"Amount":1,"Power":"test","timestamp":"2024-01-01T00:00:00Z","event":"PowerplayFastTrack","Cost":1}'
    ev = parse_line(line)
    assert ev.get("event") == "PowerplayFastTrack"
    assert ev.get("timestamp") == "2024-01-01T00:00:00Z"


def test_PowerplayJoin_parses():
    line = '{"Power":"test","timestamp":"2024-01-01T00:00:00Z","event":"PowerplayJoin"}'
    ev = parse_line(line)
    assert ev.get("event") == "PowerplayJoin"
    assert ev.get("timestamp") == "2024-01-01T00:00:00Z"


def test_PowerplayLeave_parses():
    line = '{"Power":"test","timestamp":"2024-01-01T00:00:00Z","event":"PowerplayLeave"}'
    ev = parse_line(line)
    assert ev.get("event") == "PowerplayLeave"
    assert ev.get("timestamp") == "2024-01-01T00:00:00Z"


def test_PowerplaySalary_parses():
    line = '{"Amount":1,"Power":"test","timestamp":"2024-01-01T00:00:00Z","event":"PowerplaySalary"}'
    ev = parse_line(line)
    assert ev.get("event") == "PowerplaySalary"
    assert ev.get("timestamp") == "2024-01-01T00:00:00Z"


def test_PowerplayVote_parses():
    line = '{"Vote":1,"Vote_Weighting":1.0,"Votes":1,"event":"PowerplayVote","timestamp":"2024-01-01T00:00:00Z","Power":"test"}'
    ev = parse_line(line)
    assert ev.get("event") == "PowerplayVote"
    assert ev.get("timestamp") == "2024-01-01T00:00:00Z"


def test_Progress_parses():
    line = '{"Soldier":1.0,"Exobiologist":1.0,"Trade":1.0,"Federation":1.0,"CQC":1.0,"Combat":1.0,"event":"Progress","timestamp":"2024-01-01T00:00:00Z","Explore":1.0,"Empire":1.0}'
    ev = parse_line(line)
    assert ev.get("event") == "Progress"
    assert ev.get("timestamp") == "2024-01-01T00:00:00Z"


def test_Promotion_parses():
    line = '{"Soldier":1,"Exobiologist":1,"Trade":1,"Federation":1,"CQC":1,"Combat":1,"event":"Promotion","timestamp":"2024-01-01T00:00:00Z","Explore":1,"Empire":1}'
    ev = parse_line(line)
    assert ev.get("event") == "Promotion"
    assert ev.get("timestamp") == "2024-01-01T00:00:00Z"


def test_ProspectedAsteroid_parses():
    line = '{"MotherlodeProportion":1.0,"Content_Localised":"test","Content":"test","Materials":[{}],"event":"ProspectedAsteroid","timestamp":"2024-01-01T00:00:00Z","MotherlodeMaterial_Localised":"test","Remaining":1.0,"MotherlodeMaterial":"test"}'
    ev = parse_line(line)
    assert ev.get("event") == "ProspectedAsteroid"
    assert ev.get("timestamp") == "2024-01-01T00:00:00Z"


def test_QuitACrew_parses():
    line = '{"timestamp":"2024-01-01T00:00:00Z","event":"QuitACrew","Captain":"test"}'
    ev = parse_line(line)
    assert ev.get("event") == "QuitACrew"
    assert ev.get("timestamp") == "2024-01-01T00:00:00Z"


def test_Rank_parses():
    line = '{"Soldier":1,"Exobiologist":1,"Trade":1,"Federation":1,"CQC":1,"Combat":1,"event":"Rank","timestamp":"2024-01-01T00:00:00Z","Explore":1,"Empire":1}'
    ev = parse_line(line)
    assert ev.get("event") == "Rank"
    assert ev.get("timestamp") == "2024-01-01T00:00:00Z"


def test_RebootRepair_parses():
    line = '{"Modules":[{}],"timestamp":"2024-01-01T00:00:00Z","event":"RebootRepair"}'
    ev = parse_line(line)
    assert ev.get("event") == "RebootRepair"
    assert ev.get("timestamp") == "2024-01-01T00:00:00Z"


def test_ReceiveText_parses():
    line = '{"Message":"test","Message_Localised":"test","event":"ReceiveText","timestamp":"2024-01-01T00:00:00Z","Channel":"test","From_Localised":"test","From":"test"}'
    ev = parse_line(line)
    assert ev.get("event") == "ReceiveText"
    assert ev.get("timestamp") == "2024-01-01T00:00:00Z"


def test_RedeemVoucher_parses():
    line = '{"Amount":1,"timestamp":"2024-01-01T00:00:00Z","Type":"test","Factions":[{}],"event":"RedeemVoucher"}'
    ev = parse_line(line)
    assert ev.get("event") == "RedeemVoucher"
    assert ev.get("timestamp") == "2024-01-01T00:00:00Z"


def test_RefuelAll_parses():
    line = '{"Amount":1.0,"Cost":1,"timestamp":"2024-01-01T00:00:00Z","event":"RefuelAll"}'
    ev = parse_line(line)
    assert ev.get("event") == "RefuelAll"
    assert ev.get("timestamp") == "2024-01-01T00:00:00Z"


def test_RefuelPartial_parses():
    line = '{"Amount":1.0,"Cost":1,"timestamp":"2024-01-01T00:00:00Z","event":"RefuelPartial"}'
    ev = parse_line(line)
    assert ev.get("event") == "RefuelPartial"
    assert ev.get("timestamp") == "2024-01-01T00:00:00Z"


def test_RenameSuitLoadout_parses():
    line = '{"PreviousLoadoutName":"test","SuitName_Localised":"test","event":"RenameSuitLoadout","timestamp":"2024-01-01T00:00:00Z","SuitName":"test","SuitID":1,"LoadoutID":1,"LoadoutName":"test"}'
    ev = parse_line(line)
    assert ev.get("event") == "RenameSuitLoadout"
    assert ev.get("timestamp") == "2024-01-01T00:00:00Z"


def test_Repair_parses():
    line = '{"Cost":1,"timestamp":"2024-01-01T00:00:00Z","Item_Localised":"test","Item":"test","event":"Repair"}'
    ev = parse_line(line)
    assert ev.get("event") == "Repair"
    assert ev.get("timestamp") == "2024-01-01T00:00:00Z"


def test_RepairAll_parses():
    line = '{"Cost":1,"timestamp":"2024-01-01T00:00:00Z","event":"RepairAll"}'
    ev = parse_line(line)
    assert ev.get("event") == "RepairAll"
    assert ev.get("timestamp") == "2024-01-01T00:00:00Z"


def test_ReservoirReplenished_parses():
    line = '{"FuelReservoir":1.0,"timestamp":"2024-01-01T00:00:00Z","FuelMain":1.0,"event":"ReservoirReplenished"}'
    ev = parse_line(line)
    assert ev.get("event") == "ReservoirReplenished"
    assert ev.get("timestamp") == "2024-01-01T00:00:00Z"


def test_RestockVehicle_parses():
    line = '{"Loadout_Localised":"test","Type":"test","Cost":1,"Loadout":"test","event":"RestockVehicle","Count":1,"timestamp":"2024-01-01T00:00:00Z"}'
    ev = parse_line(line)
    assert ev.get("event") == "RestockVehicle"
    assert ev.get("timestamp") == "2024-01-01T00:00:00Z"


def test_Resurrect_parses():
    line = '{"Cost":1,"timestamp":"2024-01-01T00:00:00Z","Bankrupt":true,"Option":"test","event":"Resurrect"}'
    ev = parse_line(line)
    assert ev.get("event") == "Resurrect"
    assert ev.get("timestamp") == "2024-01-01T00:00:00Z"


def test_SAASignalsFound_parses():
    line = '{"BodyID":1,"BodyName":"test","event":"SAASignalsFound","Signals":[{}],"SystemAddress":1,"Genuses":[{}],"timestamp":"2024-01-01T00:00:00Z"}'
    ev = parse_line(line)
    assert ev.get("event") == "SAASignalsFound"
    assert ev.get("timestamp") == "2024-01-01T00:00:00Z"


def test_SAAscanComplete_parses():
    line = '{"BodyID":1,"EfficiencyTarget":1,"BodyName":"test","event":"SAAscanComplete","timestamp":"2024-01-01T00:00:00Z","SystemAddress":1,"ProbesUsed":1}'
    ev = parse_line(line)
    assert ev.get("event") == "SAAscanComplete"
    assert ev.get("timestamp") == "2024-01-01T00:00:00Z"


def test_SRVDestroyed_parses():
    line = '{"timestamp":"2024-01-01T00:00:00Z","ID":1,"event":"SRVDestroyed"}'
    ev = parse_line(line)
    assert ev.get("event") == "SRVDestroyed"
    assert ev.get("timestamp") == "2024-01-01T00:00:00Z"


def test_Scan_parses():
    line = '{"timestamp":"2024-01-01T00:00:00Z","event":"Scan","BodyName":"test","BodyID":1,"DistanceFromArrivalLS":1.0,"StarSystem":"test","SystemAddress":1,"StarPos":[1.0],"WasDiscovered":true,"WasMapped":true,"Parents":[{}],"Rings":[{}],"AtmosphereType":"test","AtmosphereComposition":[{}],"Volcanism":"test","SurfaceGravity":1.0,"SurfaceTemperature":1.0,"SurfacePressure":1.0,"Landable":true,"TerraformingState":"test","PlanetClass":"test","Composition":{},"Materials":"test","Radius":1.0,"MassEM":1.0,"SemiMajorAxis":1.0,"Eccentricity":1.0,"OrbitalInclination":1.0,"Periapsis":1.0,"OrbitalPeriod":1.0,"RotationPeriod":1.0,"AxialTilt":1.0,"TidalLock":true,"StarType":"test","StellarMass":1.0,"StellarRadius":1.0,"AbsoluteMagnitude":1.0,"Age_MY":1.0,"Luminosity":"test","Subclass":1,"WasDiscoveredByName":true,"WasMappedByName":true,"ScanType":"test"}'
    ev = parse_line(line)
    assert ev.get("event") == "Scan"
    assert ev.get("timestamp") == "2024-01-01T00:00:00Z"


def test_ScanOrganic_parses():
    line = '{"Latitude":1.0,"SystemAddress":1,"Body":"test","Species":"test","Variant":"test","Longitude":1.0,"Variant_Localised":"test","Species_Localised":"test","Genus_Localised":"test","ScanType":"test","timestamp":"2024-01-01T00:00:00Z","Genus":"test","event":"ScanOrganic","System":"test"}'
    ev = parse_line(line)
    assert ev.get("event") == "ScanOrganic"
    assert ev.get("timestamp") == "2024-01-01T00:00:00Z"


def test_Screenshot_parses():
    line = '{"Latitude":1.0,"SystemAddress":1,"Body":"test","Filename":"test","Heading":1.0,"BodyID":1,"Longitude":1.0,"Width":1,"Height":1,"timestamp":"2024-01-01T00:00:00Z","Altitude":1.0,"event":"Screenshot","System":"test"}'
    ev = parse_line(line)
    assert ev.get("event") == "Screenshot"
    assert ev.get("timestamp") == "2024-01-01T00:00:00Z"


def test_SelfDestruct_parses():
    line = '{"timestamp":"2024-01-01T00:00:00Z","event":"SelfDestruct"}'
    ev = parse_line(line)
    assert ev.get("event") == "SelfDestruct"
    assert ev.get("timestamp") == "2024-01-01T00:00:00Z"


def test_SellDrones_parses():
    line = '{"Type":"test","Count":1,"event":"SellDrones","TotalSale":1,"SellPrice":1,"Type_Localised":"test","timestamp":"2024-01-01T00:00:00Z"}'
    ev = parse_line(line)
    assert ev.get("event") == "SellDrones"
    assert ev.get("timestamp") == "2024-01-01T00:00:00Z"


def test_SellExplorationData_parses():
    line = '{"Systems":[{}],"Bonus":1,"Discovered":[{}],"BaseValue":1,"event":"SellExplorationData","timestamp":"2024-01-01T00:00:00Z","TotalEarnings":1}'
    ev = parse_line(line)
    assert ev.get("event") == "SellExplorationData"
    assert ev.get("timestamp") == "2024-01-01T00:00:00Z"


def test_SellOrganicData_parses():
    line = '{"timestamp":"2024-01-01T00:00:00Z","MarketID":1,"BioData":[{}],"event":"SellOrganicData"}'
    ev = parse_line(line)
    assert ev.get("event") == "SellOrganicData"
    assert ev.get("timestamp") == "2024-01-01T00:00:00Z"


def test_SellSuit_parses():
    line = '{"Price":1,"Name_Localised":"test","event":"SellSuit","Name":"test","SuitID":1,"timestamp":"2024-01-01T00:00:00Z"}'
    ev = parse_line(line)
    assert ev.get("event") == "SellSuit"
    assert ev.get("timestamp") == "2024-01-01T00:00:00Z"


def test_SellWeapon_parses():
    line = '{"Price":1,"WeaponID":1,"Name_Localised":"test","event":"SellWeapon","Name":"test","timestamp":"2024-01-01T00:00:00Z"}'
    ev = parse_line(line)
    assert ev.get("event") == "SellWeapon"
    assert ev.get("timestamp") == "2024-01-01T00:00:00Z"


def test_SendText_parses():
    line = '{"Message":"test","Sent":true,"To_Localised":"test","event":"SendText","timestamp":"2024-01-01T00:00:00Z","To":"test"}'
    ev = parse_line(line)
    assert ev.get("event") == "SendText"
    assert ev.get("timestamp") == "2024-01-01T00:00:00Z"


def test_ShieldState_parses():
    line = '{"timestamp":"2024-01-01T00:00:00Z","ShieldsUp":true,"event":"ShieldState"}'
    ev = parse_line(line)
    assert ev.get("event") == "ShieldState"
    assert ev.get("timestamp") == "2024-01-01T00:00:00Z"


def test_ShipLocker_parses():
    line = '{"Data":[{}],"Items":[{}],"event":"ShipLocker","timestamp":"2024-01-01T00:00:00Z","Components":[{}],"Consumables":[{}]}'
    ev = parse_line(line)
    assert ev.get("event") == "ShipLocker"
    assert ev.get("timestamp") == "2024-01-01T00:00:00Z"


def test_ShipLockerMaterials_parses():
    line = '{"Data":[{}],"Items":[{}],"event":"ShipLockerMaterials","timestamp":"2024-01-01T00:00:00Z","Components":[{}],"Consumables":[{}]}'
    ev = parse_line(line)
    assert ev.get("event") == "ShipLockerMaterials"
    assert ev.get("timestamp") == "2024-01-01T00:00:00Z"


def test_ShipTargeted_parses():
    line = '{"PilotName_Localised":"test","Faction":"test","TargetLocked":true,"SquadronID":1,"Ship":"test","ScanStage":1,"Ship_Localised":"test","Power":"test","PilotRank":"test","LegalStatus":"test","ShieldHealth":1.0,"PilotName":"test","event":"ShipTargeted","HullHealth":1.0,"timestamp":"2024-01-01T00:00:00Z"}'
    ev = parse_line(line)
    assert ev.get("event") == "ShipTargeted"
    assert ev.get("timestamp") == "2024-01-01T00:00:00Z"


def test_Shutdown_parses():
    line = '{"timestamp":"2024-01-01T00:00:00Z","event":"Shutdown"}'
    ev = parse_line(line)
    assert ev.get("event") == "Shutdown"
    assert ev.get("timestamp") == "2024-01-01T00:00:00Z"


def test_SquadronCreated_parses():
    line = '{"timestamp":"2024-01-01T00:00:00Z","SquadronName":"test","event":"SquadronCreated"}'
    ev = parse_line(line)
    assert ev.get("event") == "SquadronCreated"
    assert ev.get("timestamp") == "2024-01-01T00:00:00Z"


def test_SquadronDemotion_parses():
    line = '{"OldRank":1,"SquadronName":"test","timestamp":"2024-01-01T00:00:00Z","NewRank":1,"event":"SquadronDemotion"}'
    ev = parse_line(line)
    assert ev.get("event") == "SquadronDemotion"
    assert ev.get("timestamp") == "2024-01-01T00:00:00Z"


def test_SquadronKicked_parses():
    line = '{"SquadronName":"test","timestamp":"2024-01-01T00:00:00Z","PlayerName":"test","event":"SquadronKicked"}'
    ev = parse_line(line)
    assert ev.get("event") == "SquadronKicked"
    assert ev.get("timestamp") == "2024-01-01T00:00:00Z"


def test_SquadronPromotion_parses():
    line = '{"OldRank":1,"SquadronName":"test","timestamp":"2024-01-01T00:00:00Z","NewRank":1,"event":"SquadronPromotion"}'
    ev = parse_line(line)
    assert ev.get("event") == "SquadronPromotion"
    assert ev.get("timestamp") == "2024-01-01T00:00:00Z"


def test_SquadronStartup_parses():
    line = '{"SquadronRank":"test","SquadronFaction":"test","SquadronPowerplayState":"test","CurrentRating":1,"Rating":[{}],"SquadronAlignedPower":"test","event":"SquadronStartup","timestamp":"2024-01-01T00:00:00Z","SquadronID":1,"SquadronName":"test","SquadronHomeSystem":"test"}'
    ev = parse_line(line)
    assert ev.get("event") == "SquadronStartup"
    assert ev.get("timestamp") == "2024-01-01T00:00:00Z"


def test_StartJump_parses():
    line = '{"JumpType":"test","BodyID":1,"event":"StartJump","timestamp":"2024-01-01T00:00:00Z","SystemAddress":1,"Body":"test","StarSystem":"test"}'
    ev = parse_line(line)
    assert ev.get("event") == "StartJump"
    assert ev.get("timestamp") == "2024-01-01T00:00:00Z"


def test_SupercruiseEntry_parses():
    line = '{"SystemAddress":1,"timestamp":"2024-01-01T00:00:00Z","event":"SupercruiseEntry","System":"test"}'
    ev = parse_line(line)
    assert ev.get("event") == "SupercruiseEntry"
    assert ev.get("timestamp") == "2024-01-01T00:00:00Z"


def test_SupercruiseExit_parses():
    line = '{"BodyID":1,"BodyType":"test","event":"SupercruiseExit","timestamp":"2024-01-01T00:00:00Z","SystemAddress":1,"Body":"test","System":"test"}'
    ev = parse_line(line)
    assert ev.get("event") == "SupercruiseExit"
    assert ev.get("timestamp") == "2024-01-01T00:00:00Z"


def test_SwitchSuitLoadout_parses():
    line = '{"Modules":[{}],"SuitName_Localised":"test","event":"SwitchSuitLoadout","timestamp":"2024-01-01T00:00:00Z","SuitName":"test","SuitID":1,"LoadoutID":1,"LoadoutName":"test"}'
    ev = parse_line(line)
    assert ev.get("event") == "SwitchSuitLoadout"
    assert ev.get("timestamp") == "2024-01-01T00:00:00Z"


def test_Synthesis_parses():
    line = '{"Materials":[{}],"timestamp":"2024-01-01T00:00:00Z","Name_Localised":"test","Name":"test","event":"Synthesis"}'
    ev = parse_line(line)
    assert ev.get("event") == "Synthesis"
    assert ev.get("timestamp") == "2024-01-01T00:00:00Z"


def test_Touchdown_parses():
    line = '{"BodyID":1,"OnStation":true,"OnPlanet":true,"Latitude":1.0,"event":"Touchdown","timestamp":"2024-01-01T00:00:00Z","SystemAddress":1,"PlayerControlled":true,"Body":"test","System":"test","Longitude":1.0}'
    ev = parse_line(line)
    assert ev.get("event") == "Touchdown"
    assert ev.get("timestamp") == "2024-01-01T00:00:00Z"


def test_TradeMicroResources_parses():
    line = '{"Offered":[{}],"timestamp":"2024-01-01T00:00:00Z","MarketID":1,"event":"TradeMicroResources","Received":[{}]}'
    ev = parse_line(line)
    assert ev.get("event") == "TradeMicroResources"
    assert ev.get("timestamp") == "2024-01-01T00:00:00Z"


def test_TransferMicroResources_parses():
    line = '{"timestamp":"2024-01-01T00:00:00Z","Transfers":[{}],"event":"TransferMicroResources"}'
    ev = parse_line(line)
    assert ev.get("event") == "TransferMicroResources"
    assert ev.get("timestamp") == "2024-01-01T00:00:00Z"


def test_Undocked_parses():
    line = '{"timestamp":"2024-01-01T00:00:00Z","MarketID":1,"StationName":"test","event":"Undocked","StationType":"test"}'
    ev = parse_line(line)
    assert ev.get("event") == "Undocked"
    assert ev.get("timestamp") == "2024-01-01T00:00:00Z"


def test_Undocking_parses():
    line = '{"timestamp":"2024-01-01T00:00:00Z","MarketID":1,"StationName":"test","event":"Undocking"}'
    ev = parse_line(line)
    assert ev.get("event") == "Undocking"
    assert ev.get("timestamp") == "2024-01-01T00:00:00Z"


def test_UpgradeSuit_parses():
    line = '{"Name":"test","Cost":1,"Name_Localised":"test","event":"UpgradeSuit","timestamp":"2024-01-01T00:00:00Z","SuitID":1,"Class":1}'
    ev = parse_line(line)
    assert ev.get("event") == "UpgradeSuit"
    assert ev.get("timestamp") == "2024-01-01T00:00:00Z"


def test_UpgradeWeapon_parses():
    line = '{"Name":"test","WeaponID":1,"Cost":1,"Name_Localised":"test","event":"UpgradeWeapon","timestamp":"2024-01-01T00:00:00Z","Class":1}'
    ev = parse_line(line)
    assert ev.get("event") == "UpgradeWeapon"
    assert ev.get("timestamp") == "2024-01-01T00:00:00Z"


def test_UseConsumable_parses():
    line = '{"Consumable_Localised":"test","timestamp":"2024-01-01T00:00:00Z","Consumable":"test","event":"UseConsumable","Type":"test"}'
    ev = parse_line(line)
    assert ev.get("event") == "UseConsumable"
    assert ev.get("timestamp") == "2024-01-01T00:00:00Z"


def test_WingAdd_parses():
    line = '{"timestamp":"2024-01-01T00:00:00Z","Other":"test","event":"WingAdd"}'
    ev = parse_line(line)
    assert ev.get("event") == "WingAdd"
    assert ev.get("timestamp") == "2024-01-01T00:00:00Z"


def test_WingInvite_parses():
    line = '{"timestamp":"2024-01-01T00:00:00Z","Other":"test","event":"WingInvite"}'
    ev = parse_line(line)
    assert ev.get("event") == "WingInvite"
    assert ev.get("timestamp") == "2024-01-01T00:00:00Z"


def test_WingJoin_parses():
    line = '{"Others":[{}],"timestamp":"2024-01-01T00:00:00Z","event":"WingJoin"}'
    ev = parse_line(line)
    assert ev.get("event") == "WingJoin"
    assert ev.get("timestamp") == "2024-01-01T00:00:00Z"


def test_WingLeave_parses():
    line = '{"timestamp":"2024-01-01T00:00:00Z","event":"WingLeave"}'
    ev = parse_line(line)
    assert ev.get("event") == "WingLeave"
    assert ev.get("timestamp") == "2024-01-01T00:00:00Z"

