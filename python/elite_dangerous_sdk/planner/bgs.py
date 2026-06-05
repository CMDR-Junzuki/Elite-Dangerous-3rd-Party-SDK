from __future__ import annotations

from dataclasses import dataclass, field
from typing import Optional


FACTION_STATES = [
    "None", "Boom", "Bust", "CivilUnrest", "CivilWar", "Conflict",
    "Election", "Expansion", "Famine", "Investment", "Lockdown",
    "Outbreak", "Retreat", "War", "InfrastructureFailure",
    "NaturalDisaster", "PirateAttack", "TerroristAttack", "Blight",
    "Drought", "Flood", "Plague", "LabourDemand", "PublicHoliday",
    "TechnologicalLeap", "TradeAgreement", "UnderRepair", "Colonisation",
]


@dataclass
class FactionPresence:
    name: str = ""
    faction_state: str = ""
    influence: float = 0.0
    allegiance: str = ""
    government: str = ""
    active_states: Optional[list[str]] = None
    pending_states: Optional[list[str]] = None
    recovering_states: Optional[list[str]] = None


@dataclass
class Conflict:
    type: str = ""
    status: str = ""
    faction1: str = ""
    faction2: str = ""
    faction1_won_days: Optional[int] = None
    faction2_won_days: Optional[int] = None
    faction1_stake: Optional[str] = None
    faction2_stake: Optional[str] = None


@dataclass
class SystemBgsData:
    system: str = ""
    system_address: Optional[int] = None
    population: int = 0
    allegiance: str = ""
    government: str = ""
    security: str = ""
    economy: str = ""
    second_economy: Optional[str] = None
    factions: list[FactionPresence] = field(default_factory=list)
    conflicts: Optional[list[Conflict]] = None


STATE_DESCRIPTIONS = {
    "None": "No active state",
    "Boom": "Economic growth, increased trade profits",
    "Bust": "Economic decline, reduced trade profits",
    "CivilUnrest": "Increased bounties, decreased security",
    "CivilWar": "Conflict between factions in same system",
    "Conflict": "Active combat between factions",
    "Election": "Peaceful competition for influence",
    "Expansion": "Faction expanding to new systems",
    "Famine": "Food shortages, decreased influence",
    "Investment": "Increased investment in system development",
    "Lockdown": "Increased security, reduced crime",
    "Outbreak": "Health crisis, decreased influence",
    "Retreat": "Faction losing presence in system",
    "War": "Open warfare between factions",
    "InfrastructureFailure": "Reduced station services",
    "NaturalDisaster": "Damage from natural causes",
    "PirateAttack": "Increased pirate activity",
    "TerroristAttack": "Increased security responses",
    "Colonisation": "New colony being established",
    "TechnologicalLeap": "Advanced tech development",
    "UnderRepair": "Recovering from damage",
}


def get_state_description(state: str) -> str:
    return STATE_DESCRIPTIONS.get(state, state)


POSITIVE_STATES = {
    "Boom", "Expansion", "Investment", "TechnologicalLeap",
    "TradeAgreement", "Colonisation", "Election",
}


def is_positive_state(state: str) -> bool:
    return state in POSITIVE_STATES


NEGATIVE_STATES = {
    "Bust", "CivilUnrest", "Famine", "Lockdown", "Outbreak",
    "Retreat", "NaturalDisaster", "PirateAttack", "InfrastructureFailure",
}


def is_negative_state(state: str) -> bool:
    return state in NEGATIVE_STATES


def predict_conflict_winner(
    conflict: Conflict,
    factions: list[FactionPresence],
) -> Optional[str]:
    f1 = next((f for f in factions if f.name == conflict.faction1), None)
    f2 = next((f for f in factions if f.name == conflict.faction2), None)
    if not f1 or not f2:
        return None
    if f1.influence > f2.influence:
        return f1.name
    if f2.influence > f1.influence:
        return f2.name
    return None
