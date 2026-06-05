import json
import os
from typing import Optional, Dict, List, Any

_data_dir = os.path.join(os.path.dirname(__file__), '..', '..', '..', 'specs', 'data', 'json')


def _load(name: str) -> List[Dict[str, Any]]:
    path = os.path.join(_data_dir, f"{name}.json")
    if os.path.exists(path):
        with open(path, encoding="utf-8") as f:
            return json.load(f)
    return []


def _load_dict(name: str) -> Dict[str, Any]:
    path = os.path.join(_data_dir, f"{name}.json")
    if os.path.exists(path):
        with open(path, encoding="utf-8") as f:
            return json.load(f)
    return {}


commodities = _load("commodity")
commodities_by_id = {int(c["id"]): c for c in commodities if c.get("id")}
commodities_by_symbol = {c.get("symbol", ""): c for c in commodities if c.get("symbol")}

shipyard = _load("shipyard")
shipyard_by_id = {int(s["id"]): s for s in shipyard if s.get("id")}

outfitting = _load("outfitting")
outfitting_by_id = {int(o["id"]): o for o in outfitting if o.get("id")}

engineers = _load("engineers")
engineers_by_id = {int(e["id"]): e for e in engineers if e.get("id")}

material = _load("material")
material_by_id = {int(m["id"]): m for m in material if m.get("id")}
material_by_symbol = {m.get("symbol", ""): m for m in material if m.get("symbol")}

microresources = _load("microresources")
microresources_by_id = {int(m["id"]): m for m in microresources if m.get("id")}
microresources_by_symbol = {m.get("symbol", ""): m for m in microresources if m.get("symbol")}

economy = _load("economy")
economy_by_id = {e.get("id", ""): e for e in economy if e.get("id")}

government = _load("government")
government_by_id = {g.get("id", ""): g for g in government if g.get("id")}

systemallegiance = _load("systemallegiance")
systemallegiance_by_name = {a.get("Name", ""): a for a in systemallegiance if a.get("Name")}

security = _load("security")
security_by_id = {s.get("id", ""): s for s in security if s.get("id")}

factionstate = _load("factionstate")
factionstate_by_id = {f.get("id", ""): f for f in factionstate if f.get("id")}

passengers = _load("passengers")
passengers_by_name = {p.get("name", ""): p for p in passengers if p.get("name")}

rare_commodity = _load("rare_commodity")
rare_commodity_by_id = {int(r["id"]): r for r in rare_commodity if r.get("id")}
rare_commodity_by_symbol = {r.get("symbol", ""): r for r in rare_commodity if r.get("symbol")}

rings = _load("rings")
rings_by_name = {r.get("name", ""): r for r in rings if r.get("name")}

crimes = _load("crimes")
crimes_by_id = {c.get("id", ""): c for c in crimes if c.get("id")}

dockingdeniedreasons = _load("dockingdeniedreasons")

bundles = _load("bundles")
bundles_by_id = {int(b["id"]): b for b in bundles if b.get("id")}

sku = _load("sku")
sku_by_sku = {s.get("sku", ""): s for s in sku if s.get("sku")}

terraformingstate = _load("terraformingstate")
terraformingstate_by_name = {t.get("name", ""): t for t in terraformingstate if t.get("name")}

combatrank = _load("combatrank")
combatrank_by_number = {int(r["number"]): r for r in combatrank if r.get("number")}

traderank = _load("TradeRank")
traderank_by_number = {int(r["number"]): r for r in traderank if r.get("number")}

explorationrank = _load("ExplorationRank")
explorationrank_by_number = {int(r["number"]): r for r in explorationrank if r.get("number")}

cqcrank = _load("CQCRank")
cqcrank_by_number = {int(r["number"]): r for r in cqcrank if r.get("number")}

empererank = _load("EmpireRank")
empererank_by_number = {int(r["number"]): r for r in empererank if r.get("number")}

federationrank = _load("FederationRank")
federationrank_by_number = {int(r["number"]): r for r in federationrank if r.get("number")}

happiness = _load("happiness")
happiness_by_id = {h.get("id", ""): h for h in happiness if h.get("id")}

factionids = _load("factionids")
factionids_by_id = {f.get("id", ""): f for f in factionids if f.get("id")}
