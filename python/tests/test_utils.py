"""Tests for the elite_dangerous_sdk utils module."""

from elite_dangerous_sdk.utils import listify, Coords, distance, sphere_search, parse_bitflags


def test_listify_sparse():
    result = listify({"0": "a", "2": "c"})
    assert result == ["a", None, "c"]


def test_listify_none():
    assert listify(None) == []


def test_listify_array():
    assert listify(["a", "b"]) == ["a", "b"]


def test_coords_distance():
    a = Coords(0, 0, 0)
    b = Coords(100, 0, 0)
    assert distance(a, b) == 100


def test_sphere_search():
    center = Coords(0, 0, 0)
    systems = [Coords(10, 0, 0), Coords(100, 0, 0), Coords(5, 5, 5)]
    result = sphere_search(center, 20, systems)
    assert len(result) == 2


def test_parse_bitflags():
    flags = {"Docked": 1, "Landed": 2, "Supercruise": 16}
    result = parse_bitflags(17, flags)
    assert "Docked" in result
    assert "Supercruise" in result
    assert "Landed" not in result
