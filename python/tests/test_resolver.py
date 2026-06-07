from elite_dangerous_sdk.data import (
    resolve_module, resolve_ship, resolve_ship_by_name,
    resolve_commodity, resolve_engineer, resolve_engineer_by_name,
    resolve_material, resolve_material_by_symbol,
    resolve_microresource, resolve_microresource_by_symbol,
    resolve_outfitting, resolve_shipyard,
)


class TestResolveModule:
    def test_resolves_fsd(self):
        mod = resolve_module(128064128)
        assert mod is not None
        assert mod["grp"] == "fsd"

    def test_unknown_returns_none(self):
        assert resolve_module(-1) is None


class TestResolveShip:
    def test_resolves_sidewinder(self):
        ship = resolve_ship(128049249)
        assert ship is not None
        assert "Sidewinder" in ship["properties"]["name"]

    def test_unknown_returns_none(self):
        assert resolve_ship(-1) is None


class TestResolveShipByName:
    def test_resolves_exact_name(self):
        ship = resolve_ship_by_name("Sidewinder")
        assert ship is not None

    def test_unknown_returns_none(self):
        assert resolve_ship_by_name("nonexistent") is None


class TestResolveCommodity:
    def test_resolves_gold(self):
        com = resolve_commodity("Gold")
        assert com is not None
        assert "Gold" in com["name"]

    def test_unknown_returns_none(self):
        assert resolve_commodity("xyz_invalid") is None


class TestResolveEngineer:
    def test_resolves_farseer(self):
        eng = resolve_engineer(300100)
        assert eng is not None
        assert "Farseer" in eng["name"]

    def test_unknown_returns_none(self):
        assert resolve_engineer(-1) is None


class TestResolveEngineerByName:
    def test_resolves_by_name(self):
        eng = resolve_engineer_by_name("Felicity Farseer")
        assert eng is not None

    def test_unknown_returns_none(self):
        assert resolve_engineer_by_name("nonexistent") is None


class TestResolveMaterial:
    def test_resolves_nickel(self):
        mat = resolve_material(128672319)
        assert mat is not None
        assert "Nickel" in mat["name"]

    def test_unknown_returns_none(self):
        assert resolve_material(-1) is None


class TestResolveMaterialBySymbol:
    def test_resolves_nickel(self):
        mat = resolve_material_by_symbol("Nickel")
        assert mat is not None

    def test_unknown_returns_none(self):
        assert resolve_material_by_symbol("xyz") is None


class TestResolveMicroresource:
    def test_resolves_healthpack(self):
        mr = resolve_microresource(128932270)
        assert mr is not None

    def test_unknown_returns_none(self):
        assert resolve_microresource(-1) is None


class TestResolveMicroresourceBySymbol:
    def test_resolves_healthpack(self):
        mr = resolve_microresource_by_symbol("healthpack")
        assert mr is not None

    def test_unknown_returns_none(self):
        assert resolve_microresource_by_symbol("xyz") is None


class TestResolveOutfitting:
    def test_resolves_sidewinder_armour(self):
        o = resolve_outfitting(128049250)
        assert o is not None

    def test_unknown_returns_none(self):
        assert resolve_outfitting(-1) is None


class TestResolveShipyard:
    def test_resolves_sidewinder(self):
        s = resolve_shipyard(128049249)
        assert s is not None

    def test_unknown_returns_none(self):
        assert resolve_shipyard(-1) is None
