import time
from typing import Any

import httpx

INARA_ENDPOINT = "https://inara.cz/inapi/v1/"


class InaraClient:

    def __init__(
        self,
        app_name: str,
        app_version: str,
        api_key: str,
        commander_name: str | None = None,
        commander_frontier_id: str | None = None,
        is_developing: bool = False,
    ):
        self.header = {
            "appName": app_name,
            "appVersion": app_version,
            "isBeingDeveloped": is_developing,
            "APIkey": api_key,
        }
        if commander_name:
            self.header["commanderName"] = commander_name
        if commander_frontier_id:
            self.header["commanderFrontierID"] = commander_frontier_id
        self._last_request: float = 0

    def _rate_limit(self):
        elapsed = time.time() - self._last_request
        if elapsed < 30:
            time.sleep(30 - elapsed)

    def send_events(self, events: list[dict[str, Any]]) -> dict[str, Any]:
        self._rate_limit()
        payload = {
            "header": self.header,
            "events": events,
        }
        resp = httpx.post(
            INARA_ENDPOINT,
            json=payload,
            headers={"Content-Type": "application/json"},
        )
        self._last_request = time.time()
        resp.raise_for_status()
        data = resp.json()
        header = data.get("header", {})
        if header.get("eventStatus") != 200:
            msg = header.get("eventStatusText") or f"Inara API error: {header.get('eventStatus')}"
            raise Exception(msg)
        return data

    def add_commander(self, commander_name: str, frontier_id: str | None = None):
        return self.send_events([{
            "eventName": "addCommander",
            "eventData": {
                "commanderName": commander_name,
                "commanderFrontierID": frontier_id,
                "isMainCommander": True,
            },
        }])

    def get_commander_profile(self):
        return self.send_events([{"eventName": "getCommanderProfile"}])

    def set_commander_ship(
        self, ship_type: str, ship_game_id: int,
        starsystem_name: str, station_name: str,
        ship_name: str | None = None, ship_ident: str | None = None,
    ):
        return self.send_events([{
            "eventName": "setCommanderShip",
            "eventData": {
                "shipType": ship_type,
                "shipGameID": ship_game_id,
                "starsystemName": starsystem_name,
                "stationName": station_name,
                "shipName": ship_name,
                "shipIdent": ship_ident,
            },
        }])

    def set_commander_ship_loadout(self, ship_id: int, modules: list[dict[str, Any]]):
        return self.send_events([{
            "eventName": "setCommanderShipLoadout",
            "eventData": {
                "shipGameID": ship_id,
                "modules": modules,
            },
        }])

    def add_travel_carrier_jump(
        self, system_name: str, coords: tuple[float, float, float] | None = None,
    ):
        data = {"starSystemName": system_name}
        if coords:
            data.update({
                "starSystemX": coords[0],
                "starSystemY": coords[1],
                "starSystemZ": coords[2],
            })
        return self.send_events([{
            "eventName": "addCommanderTravelCarrierJump",
            "eventData": data,
        }])

    def set_commander_travel_location(
        self, system_name: str, coords: tuple[float, float, float] | None = None,
    ):
        data = {"starSystemName": system_name}
        if coords:
            data.update({
                "starSystemX": coords[0],
                "starSystemY": coords[1],
                "starSystemZ": coords[2],
            })
        return self.send_events([{
            "eventName": "setCommanderTravelLocation",
            "eventData": data,
        }])

    def set_commander_community_goal_progress(
        self, goal_id: int, contribution: int, percentile: float | None = None,
    ):
        data = {
            "communitygoalGameID": goal_id,
            "contribution": contribution,
        }
        if percentile is not None:
            data["percentile"] = percentile
        return self.send_events([{
            "eventName": "setCommanderCommunityGoalProgress",
            "eventData": data,
        }])

    def add_travel_fsd_jump(
        self, system_name: str, coords: tuple[float, float, float] | None = None,
    ):
        data = {"starSystemName": system_name}
        if coords:
            data.update({
                "starSystemX": coords[0],
                "starSystemY": coords[1],
                "starSystemZ": coords[2],
            })
        return self.send_events([{
            "eventName": "addCommanderTravelFSDJump",
            "eventData": data,
        }])

    def add_travel_dock(self, station_name: str, system_name: str):
        return self.send_events([{
            "eventName": "addCommanderTravelDock",
            "eventData": {
                "starSystemName": system_name,
                "stationName": station_name,
            },
        }])

    def set_commander_rank(self, **ranks):
        return self.send_events([{
            "eventName": "setCommanderRank",
            "eventData": ranks,
        }])

    def set_commander_credits(self, credits: int, loan: int | None = None, assets: int | None = None):
        data = {"commanderCredits": credits}
        if loan is not None:
            data["commanderLoan"] = loan
        if assets is not None:
            data["commanderAssets"] = assets
        return self.send_events([{
            "eventName": "setCommanderCredits",
            "eventData": data,
        }])

    def set_commander_inventory(self, **inventory):
        return self.send_events([{
            "eventName": "setCommanderInventory",
            "eventData": inventory,
        }])

    def set_community_goal(self, **goal_data):
        return self.send_events([{
            "eventName": "setCommunityGoal",
            "eventData": goal_data,
        }])

    # --- Friend events ---

    def add_commander_friend(self, commander_name: str, game_platform: str | None = None):
        data: dict[str, Any] = {"commanderName": commander_name}
        if game_platform is not None:
            data["gamePlatform"] = game_platform
        return self.send_events([{
            "eventName": "addCommanderFriend",
            "eventData": data,
        }])

    def del_commander_friend(self, commander_name: str, game_platform: str | None = None):
        data: dict[str, Any] = {"commanderName": commander_name}
        if game_platform is not None:
            data["gamePlatform"] = game_platform
        return self.send_events([{
            "eventName": "delCommanderFriend",
            "eventData": data,
        }])

    # --- Permit events ---

    def add_commander_permit(self, starsystem_name: str):
        return self.send_events([{
            "eventName": "addCommanderPermit",
            "eventData": {
                "starsystemName": starsystem_name,
            },
        }])

    # --- Stats, ranks, reputation ---

    def set_commander_game_statistics(self, statistics: dict[str, Any]):
        return self.send_events([{
            "eventName": "setCommanderGameStatistics",
            "eventData": statistics,
        }])

    def set_commander_rank_engineer(self, data: dict[str, Any] | list[dict[str, Any]]):
        return self.send_events([{
            "eventName": "setCommanderRankEngineer",
            "eventData": data,
        }])

    def set_commander_rank_pilot(
        self, rank_name: str | list[dict[str, Any]],
        rank_value: int | None = None, rank_progress: float | None = None,
    ):
        if isinstance(rank_name, list):
            event_data = rank_name
        else:
            event_data: dict[str, Any] = {"rankName": rank_name}
            if rank_value is not None:
                event_data["rankValue"] = rank_value
            if rank_progress is not None:
                event_data["rankProgress"] = rank_progress
        return self.send_events([{
            "eventName": "setCommanderRankPilot",
            "eventData": event_data,
        }])

    def set_commander_rank_power(self, power_name: str, rank_value: int, merits_value: int | None = None):
        data: dict[str, Any] = {
            "powerName": power_name,
            "rankValue": rank_value,
        }
        if merits_value is not None:
            data["meritsValue"] = merits_value
        return self.send_events([{
            "eventName": "setCommanderRankPower",
            "eventData": data,
        }])

    def set_commander_reputation_major_faction(
        self, majorfaction_name: str | list[dict[str, Any]],
        majorfaction_reputation: float | None = None,
    ):
        if isinstance(majorfaction_name, list):
            event_data = majorfaction_name
        else:
            event_data = {
                "majorfactionName": majorfaction_name,
                "majorfactionReputation": majorfaction_reputation,
            }
        return self.send_events([{
            "eventName": "setCommanderReputationMajorFaction",
            "eventData": event_data,
        }])

    def set_commander_reputation_minor_faction(
        self, minorfaction_name: str | list[dict[str, Any]],
        minorfaction_reputation: float | None = None,
    ):
        if isinstance(minorfaction_name, list):
            event_data = minorfaction_name
        else:
            event_data = {
                "minorfactionName": minorfaction_name,
                "minorfactionReputation": minorfaction_reputation,
            }
        return self.send_events([{
            "eventName": "setCommanderReputationMinorFaction",
            "eventData": event_data,
        }])

    # --- Inventory events (generic) ---

    def add_commander_inventory_item(
        self, item_name: str, item_count: int, item_type: str,
        item_location: str | None = None, is_stolen: bool | None = None,
        mission_game_id: int | None = None,
    ):
        data: dict[str, Any] = {
            "itemName": item_name,
            "itemCount": item_count,
            "itemType": item_type,
        }
        if item_location is not None:
            data["itemLocation"] = item_location
        if is_stolen is not None:
            data["isStolen"] = is_stolen
        if mission_game_id is not None:
            data["missionGameID"] = mission_game_id
        return self.send_events([{
            "eventName": "addCommanderInventoryItem",
            "eventData": data,
        }])

    def del_commander_inventory_item(
        self, item_name: str, item_count: int, item_type: str,
        item_location: str | None = None, is_stolen: bool | None = None,
        mission_game_id: int | None = None,
    ):
        data: dict[str, Any] = {
            "itemName": item_name,
            "itemCount": item_count,
            "itemType": item_type,
        }
        if item_location is not None:
            data["itemLocation"] = item_location
        if is_stolen is not None:
            data["isStolen"] = is_stolen
        if mission_game_id is not None:
            data["missionGameID"] = mission_game_id
        return self.send_events([{
            "eventName": "delCommanderInventoryItem",
            "eventData": data,
        }])

    def reset_commander_inventory(
        self, item_type: str | list[dict[str, Any]],
        item_location: str | None = None,
    ):
        if isinstance(item_type, list):
            event_data = item_type
        else:
            event_data: dict[str, Any] = {"itemType": item_type}
            if item_location is not None:
                event_data["itemLocation"] = item_location
        return self.send_events([{
            "eventName": "resetCommanderInventory",
            "eventData": event_data,
        }])

    def set_commander_inventory_item(
        self, item_name: str, item_count: int, item_type: str,
        item_location: str | None = None, is_stolen: bool | None = None,
        mission_game_id: int | None = None,
    ):
        data: dict[str, Any] = {
            "itemName": item_name,
            "itemCount": item_count,
            "itemType": item_type,
        }
        if item_location is not None:
            data["itemLocation"] = item_location
        if is_stolen is not None:
            data["isStolen"] = is_stolen
        if mission_game_id is not None:
            data["missionGameID"] = mission_game_id
        return self.send_events([{
            "eventName": "setCommanderInventoryItem",
            "eventData": data,
        }])

    # --- Inventory cargo events ---

    def add_commander_inventory_cargo_item(
        self, item_name: str, item_count: int,
        is_stolen: bool | None = None, mission_game_id: int | None = None,
    ):
        data: dict[str, Any] = {
            "itemName": item_name,
            "itemCount": item_count,
        }
        if is_stolen is not None:
            data["isStolen"] = is_stolen
        if mission_game_id is not None:
            data["missionGameID"] = mission_game_id
        return self.send_events([{
            "eventName": "addCommanderInventoryCargoItem",
            "eventData": data,
        }])

    def add_commander_inventory_materials_item(self, item_name: str, item_count: int):
        return self.send_events([{
            "eventName": "addCommanderInventoryMaterialsItem",
            "eventData": {
                "itemName": item_name,
                "itemCount": item_count,
            },
        }])

    def del_commander_inventory_cargo_item(
        self, item_name: str, item_count: int,
        is_stolen: bool | None = None, mission_game_id: int | None = None,
    ):
        data: dict[str, Any] = {
            "itemName": item_name,
            "itemCount": item_count,
        }
        if is_stolen is not None:
            data["isStolen"] = is_stolen
        if mission_game_id is not None:
            data["missionGameID"] = mission_game_id
        return self.send_events([{
            "eventName": "delCommanderInventoryCargoItem",
            "eventData": data,
        }])

    def del_commander_inventory_materials_item(self, item_name: str, item_count: int):
        return self.send_events([{
            "eventName": "delCommanderInventoryMaterialsItem",
            "eventData": {
                "itemName": item_name,
                "itemCount": item_count,
            },
        }])

    def set_commander_inventory_cargo(self, items: list[dict[str, Any]]):
        return self.send_events([{
            "eventName": "setCommanderInventoryCargo",
            "eventData": items,
        }])

    def set_commander_inventory_cargo_item(
        self, item_name: str, item_count: int,
        is_stolen: bool | None = None, mission_game_id: int | None = None,
    ):
        data: dict[str, Any] = {
            "itemName": item_name,
            "itemCount": item_count,
        }
        if is_stolen is not None:
            data["isStolen"] = is_stolen
        if mission_game_id is not None:
            data["missionGameID"] = mission_game_id
        return self.send_events([{
            "eventName": "setCommanderInventoryCargoItem",
            "eventData": data,
        }])

    def set_commander_inventory_materials(self, items: list[dict[str, Any]]):
        return self.send_events([{
            "eventName": "setCommanderInventoryMaterials",
            "eventData": items,
        }])

    def set_commander_inventory_materials_item(self, item_name: str, item_count: int):
        return self.send_events([{
            "eventName": "setCommanderInventoryMaterialsItem",
            "eventData": {
                "itemName": item_name,
                "itemCount": item_count,
            },
        }])

    # --- Storage modules ---

    def set_commander_storage_modules(self, modules: list[dict[str, Any]]):
        return self.send_events([{
            "eventName": "setCommanderStorageModules",
            "eventData": modules,
        }])

    # --- Ship events ---

    def add_commander_ship(self, ship_type: str, ship_game_id: int):
        return self.send_events([{
            "eventName": "addCommanderShip",
            "eventData": {
                "shipType": ship_type,
                "shipGameID": ship_game_id,
            },
        }])

    def del_commander_ship(self, ship_type: str, ship_game_id: int):
        return self.send_events([{
            "eventName": "delCommanderShip",
            "eventData": {
                "shipType": ship_type,
                "shipGameID": ship_game_id,
            },
        }])

    def set_commander_ship_transfer(
        self, ship_type: str, ship_game_id: int,
        starsystem_name: str, station_name: str,
        market_id: int | None = None, transfer_time: int | None = None,
    ):
        data: dict[str, Any] = {
            "shipType": ship_type,
            "shipGameID": ship_game_id,
            "starsystemName": starsystem_name,
            "stationName": station_name,
        }
        if market_id is not None:
            data["marketID"] = market_id
        if transfer_time is not None:
            data["transferTime"] = transfer_time
        return self.send_events([{
            "eventName": "setCommanderShipTransfer",
            "eventData": data,
        }])

    # --- Suit loadout events ---

    def del_commander_suit_loadout(self, loadout_game_id: int):
        return self.send_events([{
            "eventName": "delCommanderSuitLoadout",
            "eventData": {"loadoutGameID": loadout_game_id},
        }])

    def set_commander_suit_loadout(self, **data):
        return self.send_events([{
            "eventName": "setCommanderSuitLoadout",
            "eventData": data,
        }])

    def update_commander_suit_loadout(self, **data):
        return self.send_events([{
            "eventName": "updateCommanderSuitLoadout",
            "eventData": data,
        }])

    # --- Travel events ---

    def add_commander_travel_land(self, starsystem_name: str, body_name: str):
        return self.send_events([{
            "eventName": "addCommanderTravelLand",
            "eventData": {
                "starsystemName": starsystem_name,
                "starsystemBodyName": body_name,
            },
        }])

    # --- Mission events ---

    def add_commander_mission(self, mission_name: str, mission_game_id: int, **extra):
        data: dict[str, Any] = {
            "missionName": mission_name,
            "missionGameID": mission_game_id,
        }
        data.update(extra)
        return self.send_events([{
            "eventName": "addCommanderMission",
            "eventData": data,
        }])

    def set_commander_mission_abandoned(self, mission_game_id: int):
        return self.send_events([{
            "eventName": "setCommanderMissionAbandoned",
            "eventData": {
                "missionGameID": mission_game_id,
            },
        }])

    def set_commander_mission_completed(self, mission_game_id: int):
        return self.send_events([{
            "eventName": "setCommanderMissionCompleted",
            "eventData": {
                "missionGameID": mission_game_id,
            },
        }])

    def set_commander_mission_failed(self, mission_game_id: int):
        return self.send_events([{
            "eventName": "setCommanderMissionFailed",
            "eventData": {
                "missionGameID": mission_game_id,
            },
        }])

    # --- Combat events ---

    def add_commander_combat_death(
        self, starsystem_name: str,
        opponent_name: str | None = None, opponent_ship_type: str | None = None,
        is_player: bool | None = None,
    ):
        data: dict[str, Any] = {"starsystemName": starsystem_name}
        if opponent_name is not None:
            data["opponentName"] = opponent_name
        if opponent_ship_type is not None:
            data["opponentShipType"] = opponent_ship_type
        if is_player is not None:
            data["isPlayer"] = is_player
        return self.send_events([{
            "eventName": "addCommanderCombatDeath",
            "eventData": data,
        }])

    def add_commander_combat_interdicted(
        self, starsystem_name: str, opponent_name: str,
        is_player: bool, combat_result: bool | None = None,
    ):
        data: dict[str, Any] = {
            "starsystemName": starsystem_name,
            "opponentName": opponent_name,
            "isPlayer": is_player,
        }
        if combat_result is not None:
            data["isSubmit"] = combat_result
        return self.send_events([{
            "eventName": "addCommanderCombatInterdicted",
            "eventData": data,
        }])

    def add_commander_combat_interdiction(
        self, starsystem_name: str, opponent_name: str,
        is_player: bool, combat_result: bool | None = None,
    ):
        data: dict[str, Any] = {
            "starsystemName": starsystem_name,
            "opponentName": opponent_name,
            "isPlayer": is_player,
        }
        if combat_result is not None:
            data["isSuccess"] = combat_result
        return self.send_events([{
            "eventName": "addCommanderCombatInterdiction",
            "eventData": data,
        }])

    def add_commander_combat_interdiction_escape(
        self, starsystem_name: str, opponent_name: str, is_player: bool,
    ):
        return self.send_events([{
            "eventName": "addCommanderCombatInterdictionEscape",
            "eventData": {
                "starsystemName": starsystem_name,
                "opponentName": opponent_name,
                "isPlayer": is_player,
            },
        }])

    def add_commander_combat_kill(
        self, starsystem_name: str,
        opponent_name: str | None = None, opponent_ship_type: str | None = None,
        is_player: bool | None = None,
    ):
        data: dict[str, Any] = {"starsystemName": starsystem_name}
        if opponent_name is not None:
            data["opponentName"] = opponent_name
        if opponent_ship_type is not None:
            data["opponentShipType"] = opponent_ship_type
        if is_player is not None:
            data["isPlayer"] = is_player
        return self.send_events([{
            "eventName": "addCommanderCombatKill",
            "eventData": data,
        }])

    # --- Community goals ---

    def get_community_goals_recent(self, starsystem_name: str | None = None):
        if starsystem_name is not None:
            event_data: dict[str, Any] | list = {"searchSystemName": starsystem_name}
        else:
            event_data = []
        return self.send_events([{
            "eventName": "getCommunityGoalsRecent",
            "eventData": event_data,
        }])
