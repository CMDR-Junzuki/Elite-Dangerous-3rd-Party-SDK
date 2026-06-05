"""Tests for bitflag constants."""

from elite_dangerous_sdk.flags import Flags, Flags2, GuiFocus


def test_flags_values():
    assert Flags.DOCKED == 1
    assert Flags.LANDED == 2
    assert Flags.SUPERCRUISE == 16
    assert Flags.HARDPOINTS_DEPLOYED == 64
    assert Flags.FSD_CHARGING == 131072
    assert Flags.FSD_JUMPING == 268435456
    assert Flags.SRV_UNDER_SHIP == 536870912


def test_flags2_values():
    assert Flags2.ON_FOOT == 1
    assert Flags2.IN_TAXI == 2
    assert Flags2.IN_CQC == 524288


def test_gui_focus_values():
    assert GuiFocus.NO_FOCUS == 0
    assert GuiFocus.INTERNAL_PANEL == 1
    assert GuiFocus.GALAXY_MAP == 6
    assert GuiFocus.FSS == 9
    assert GuiFocus.CODEX == 11


def test_flags_count():
    assert len(Flags._ALL) == 30
    assert Flags.SRV_UNDER_SHIP == 1 << 29
