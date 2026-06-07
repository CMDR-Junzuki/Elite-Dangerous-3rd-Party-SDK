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


STATE_EFFECTS = {
    "Boom": {"influence_trend": "positive", "affected_activities": ["trade", "passenger_missions"], "description": "Economic growth, increased trade profits"},
    "Bust": {"influence_trend": "negative", "affected_activities": ["trade"], "description": "Economic decline, reduced trade profits"},
    "CivilUnrest": {"influence_trend": "negative", "affected_activities": ["bounty", "security"], "description": "Increased bounties, decreased security"},
    "CivilWar": {"influence_trend": "negative", "affected_activities": ["conflict_zones"], "description": "Conflict between factions in same system"},
    "Election": {"influence_trend": "positive", "affected_activities": ["missions"], "description": "Peaceful competition for influence"},
    "Expansion": {"influence_trend": "positive", "affected_activities": ["trade", "exploration"], "description": "Faction expanding to new systems"},
    "Famine": {"influence_trend": "negative", "affected_activities": ["trade", "missions"], "description": "Food shortages, decreased influence"},
    "Investment": {"influence_trend": "positive", "affected_activities": ["trade", "exploration"], "description": "Increased investment in system development"},
    "Lockdown": {"influence_trend": "negative", "affected_activities": ["crime", "black_market"], "description": "Increased security, reduced crime"},
    "Outbreak": {"influence_trend": "negative", "affected_activities": ["trade", "missions"], "description": "Health crisis, decreased influence"},
    "Retreat": {"influence_trend": "negative", "affected_activities": ["all"], "description": "Faction losing presence in system"},
    "War": {"influence_trend": "negative", "affected_activities": ["conflict_zones"], "description": "Open warfare between factions"},
    "PirateAttack": {"influence_trend": "negative", "affected_activities": ["security", "trade"], "description": "Increased pirate activity"},
    "InfrastructureFailure": {"influence_trend": "negative", "affected_activities": ["station_services"], "description": "Reduced station services"},
    "NaturalDisaster": {"influence_trend": "negative", "affected_activities": ["all"], "description": "Damage from natural causes"},
    "Blight": {"influence_trend": "negative", "affected_activities": ["trade"], "description": "Agricultural crisis"},
    "Drought": {"influence_trend": "negative", "affected_activities": ["trade"], "description": "Water shortages"},
    "Flood": {"influence_trend": "negative", "affected_activities": ["trade", "stations"], "description": "Widespread flooding"},
    "Plague": {"influence_trend": "negative", "affected_activities": ["all"], "description": "Deadly disease outbreak"},
    "LabourDemand": {"influence_trend": "positive", "affected_activities": ["missions"], "description": "Increased demand for workers"},
    "PublicHoliday": {"influence_trend": "positive", "affected_activities": ["trade", "passenger_missions"], "description": "Celebration boosting local economy"},
    "TechnologicalLeap": {"influence_trend": "positive", "affected_activities": ["exploration", "missions"], "description": "Advanced tech development"},
    "TradeAgreement": {"influence_trend": "positive", "affected_activities": ["trade"], "description": "Increased trade opportunities"},
    "TerroristAttack": {"influence_trend": "negative", "affected_activities": ["security", "all"], "description": "Increased security responses"},
    "UnderRepair": {"influence_trend": "neutral", "affected_activities": ["station_services"], "description": "Recovering from damage"},
    "Colonisation": {"influence_trend": "positive", "affected_activities": ["trade", "missions"], "description": "New colony being established"},
}


def faction_state_effect(state: str) -> dict:
    return STATE_EFFECTS.get(state, {
        "influence_trend": "neutral",
        "affected_activities": [],
        "description": state,
    })


def influence_effect(action: str, params: dict) -> dict:
    if action == "mission_completed":
        reward = params.get("reward", 0)
        if reward >= 4000000:
            return {"influence_delta": 0.02, "confidence": "medium", "breakdown": "High-value mission (~4M+ CR): ~2.0% influence"}
        if reward >= 1000000:
            return {"influence_delta": 0.01, "confidence": "medium", "breakdown": "Medium-value mission (~1M CR): ~1.0% influence"}
        return {"influence_delta": 0.004, "confidence": "medium", "breakdown": "Standard mission: ~0.4% influence"}
    if action == "bounty":
        amount = params.get("amount", 0)
        delta = min(amount / 1000000, 0.04)
        return {"influence_delta": delta, "confidence": "low", "breakdown": f"Bounty voucher ({amount:,} CR): ~{delta * 100:.1f}% influence"}
    if action == "bonds":
        bond_amount = params.get("amount", 0)
        bond_delta = min(bond_amount / 2000000, 0.03)
        return {"influence_delta": bond_delta, "confidence": "low", "breakdown": f"Combat bonds ({bond_amount:,} CR): ~{bond_delta * 100:.1f}% influence"}
    if action == "exploration":
        systems = params.get("systems", 1)
        first_disc = params.get("firstDiscoveries", 0)
        delta = systems * 0.002 + first_disc * 0.008
        capped = min(delta, 0.05)
        return {"influence_delta": capped, "confidence": "low", "breakdown": f"Exploration data ({systems} systems, {first_disc} first discoveries): ~{capped * 100:.1f}% influence"}
    if action == "trade":
        profit = params.get("profit", 0)
        trade_delta = min(profit / 5000000, 0.03)
        return {"influence_delta": trade_delta, "confidence": "low", "breakdown": f"Trade profit ({profit:,} CR): ~{trade_delta * 100:.1f}% influence"}
    if action == "murder":
        count = params.get("count", 1)
        return {"influence_delta": -(count * 0.002), "confidence": "low", "breakdown": f"Ship destroyed ({count}): ~-{count * 0.2:.1f}% influence"}
    return {"influence_delta": 0, "confidence": "low", "breakdown": "Unknown action"}


def analyze_conflict(
    conflict: Conflict,
    factions: list[FactionPresence],
) -> Optional[dict]:
    f1 = next((f for f in factions if f.name == conflict.faction1), None)
    f2 = next((f for f in factions if f.name == conflict.faction2), None)
    if not f1 or not f2:
        return None

    f1_won = conflict.faction1_won_days or 0
    f2_won = conflict.faction2_won_days or 0
    pred = predict_conflict_winner(conflict, factions)
    influence_gap = abs(f1.influence - f2.influence)

    analysis = f"{conflict.faction1} ({f1.influence * 100:.1f}%) vs {conflict.faction2} ({f2.influence * 100:.1f}%) in a {conflict.status} {conflict.type}"
    if f1_won > 0 or f2_won > 0:
        analysis += f" | Days won: {f1_won}-{f2_won}"
    if pred:
        analysis += f" | {pred} predicted to win"
        if influence_gap > 0.05:
            analysis += " (significant influence advantage)"
        elif influence_gap > 0.02:
            analysis += " (moderate influence advantage)"
        else:
            analysis += " (close contest)"

    return {
        "predicted_winner": pred,
        "faction1_won_days": f1_won,
        "faction2_won_days": f2_won,
        "faction1_advantage": f1.influence - f2.influence,
        "faction2_advantage": f2.influence - f1.influence,
        "status": conflict.status,
        "analysis": analysis,
    }


def expansion_targets(
    current_system: SystemBgsData,
    nearby_systems: list[SystemBgsData],
    faction_name: str,
) -> list[dict]:
    results = []
    for sys in nearby_systems:
        if sys.system == current_system.system:
            continue

        existing = next((f for f in (sys.factions or []) if f.name == faction_name), None)
        if existing:
            continue

        reasons = []
        score = 0

        if sys.population > 1000000:
            score += 30
            reasons.append("High population")
        elif sys.population > 100000:
            score += 15
            reasons.append("Medium population")
        else:
            score += 5

        if sys.government in ("Democracy", "Confederacy"):
            score += 10
            reasons.append("Compatible government")

        if sys.economy in ("Agriculture", "Extraction", "Refinery"):
            score += 10
            reasons.append("Primary economy")

        non_native = [f for f in (sys.factions or []) if f.allegiance != current_system.allegiance]
        if non_native:
            avg_opp = sum(f.influence for f in non_native) / len(non_native)
            if avg_opp < 0.1:
                score += 15
                reasons.append("Weak opposing factions present")

        results.append({
            "system": sys.system,
            "population": sys.population,
            "government": sys.government,
            "economy": sys.economy,
            "score": score,
            "reasons": reasons,
        })

    results.sort(key=lambda r: -r["score"])
    return results


def retreat_risk(faction_presence: FactionPresence) -> dict:
    inf = faction_presence.influence
    in_retreat = faction_presence.faction_state == "Retreat"

    if in_retreat and inf < 0.025:
        risk_level = "critical"
    elif in_retreat and inf < 0.05:
        risk_level = "high"
    elif in_retreat:
        risk_level = "medium"
    elif inf < 0.01:
        risk_level = "critical"
    elif inf < 0.025:
        risk_level = "high"
    elif inf < 0.05:
        risk_level = "medium"
    elif inf < 0.075:
        risk_level = "low"
    else:
        risk_level = "none"

    analysis = f"{faction_presence.name} at {inf * 100:.1f}% influence"
    if in_retreat:
        analysis += " and in Retreat state"
    analysis += f": {risk_level} retreat risk"

    return {
        "risk_level": risk_level,
        "influence": inf,
        "in_retreat_state": in_retreat,
        "analysis": analysis,
    }
