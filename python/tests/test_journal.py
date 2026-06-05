"""Tests for Journal reader."""

import json
from dataclasses import asdict
from pathlib import Path
from unittest.mock import patch, MagicMock

from elite_dangerous_sdk.journal import (
    get_default_journal_dir, list_journal_files, JournalReader, JournalOptions, JOURNAL_RE,
    parse_line, parse_with_bigint, parse_with_lossy_integers,
    stringify_event, stringify_bigint_json, is_event_type,
)
from elite_dangerous_sdk.journal_watcher import JournalWatcher
from elite_dangerous_sdk import (
    FileHeader, Docked, FSDJump, Scan, Status, Location, Market,
    FactionState, Conflict, StationEconomy, ConflictFaction,
)
from elite_dangerous_sdk.journal_types import Status_Fuel, Market_Item


# --- Parser tests ---

def test_parse_line_parses_json():
    result = parse_line('{"event":"FSDJump","StarSystem":"Sol"}')
    assert result["event"] == "FSDJump"
    assert result["StarSystem"] == "Sol"


def test_parse_line_bigint():
    raw = '{"MarketID": 128666431, "event":"Docked"}'
    result = parse_line(raw)
    assert result["MarketID"] == 128666431
    assert isinstance(result["MarketID"], int)


def test_parse_with_bigint_marks():
    raw = '{"event":"FSDJump","MarketID": 128666431}'
    result = parse_with_bigint(raw)
    assert result["_bigint"] is True
    assert result["event"] == "FSDJump"


def test_parse_with_lossy_integers():
    result = parse_with_lossy_integers('{"event":"FSDJump"}')
    assert result["event"] == "FSDJump"


def test_stringify_event():
    event = {"event": "FSDJump", "StarSystem": "Sol"}
    result = stringify_event(event)
    assert json.loads(result) == event


def test_stringify_bigint_json():
    event = {"event": "Docked", "MarketID": 9007199254740992}
    result = stringify_bigint_json(event)
    parsed = json.loads(result)
    assert parsed["MarketID"] == "9007199254740992"


def test_is_event_type_returns_true():
    assert is_event_type({"event": "FSDJump"}, "FSDJump") is True


def test_is_event_type_returns_false():
    assert is_event_type({"event": "FSDJump"}, "Scan") is False


# --- JournalOptions tests ---

def test_journal_options_default():
    opts = JournalOptions()
    assert opts.directory is None
    assert opts.position is None


def test_journal_options_with_string():
    reader = JournalReader("C:\\custom\\dir")
    assert str(reader.directory) == "C:\\custom\\dir"
    assert reader._position is None


def test_journal_options_start_position():
    reader = JournalReader(JournalOptions(position="start"))
    assert reader._position == {"file": "", "offset": 0}


def test_journal_options_dict_position():
    pos = {"file": "Journal.2024-01-01T000000_01.log", "offset": 100}
    reader = JournalReader(JournalOptions(position=pos))
    assert reader._position == pos


# --- JournalWatcher tests ---

def test_journal_watcher_instantiate():
    watcher = JournalWatcher("C:\\test")
    assert watcher.directory == "C:\\test"
    assert watcher._running is False


def test_journal_watcher_has_stop():
    watcher = JournalWatcher("C:\\test")
    watcher.stop()
    assert watcher._running is False


def test_journal_pattern():
    assert JOURNAL_RE.match("Journal.2024-01-15T120456_01.log")
    assert not JOURNAL_RE.match("Status.json")
    assert not JOURNAL_RE.match("Journal.bad.log")


@patch("elite_dangerous_sdk.journal.os.environ.get")
def test_get_default_journal_dir_env_var(mock_env):
    mock_env.return_value = "C:\\custom\\journal"
    result = get_default_journal_dir()
    assert str(result) == "C:\\custom\\journal"


@patch("elite_dangerous_sdk.journal.Path.home")
def test_get_default_journal_dir_windows(mock_home):
    mock_env = patch("elite_dangerous_sdk.journal.os.environ.get", return_value=None)
    mock_os = patch("elite_dangerous_sdk.journal.os.name", return_value="nt")
    mock_home.return_value = Path("C:\\Users\\TestCmdr")

    with mock_env, mock_os:
        result = get_default_journal_dir()
        assert "Saved Games" in str(result)
        assert "Elite Dangerous" in str(result)


def test_list_journal_files_nonexistent():
    result = list_journal_files(Path("C:\\nonexistent_path_xyz"))
    assert result == []


@patch("elite_dangerous_sdk.journal.Path.stat")
@patch("elite_dangerous_sdk.journal.Path.exists")
def test_list_journal_files_filters(mock_exists, mock_stat):
    mock_exists.return_value = True
    mock_stat.return_value.st_mtime = 1000

    with patch("elite_dangerous_sdk.journal.Path.glob") as mock_glob:
        mock_file_ok = MagicMock(spec=Path)
        mock_file_ok.name = "Journal.2024-01-15T120456_01.log"
        mock_file_ok.stat.return_value.st_mtime = 1000

        mock_file_bad = MagicMock(spec=Path)
        mock_file_bad.name = "Status.json"
        mock_file_bad.stat.return_value.st_mtime = 1000

        mock_glob.return_value = [mock_file_ok, mock_file_bad]

        result = list_journal_files(Path("C:\\test"))
        assert len(result) == 1
        assert "Journal" in result[0].name


def test_journal_reader_read_status_not_found(tmp_path):
    reader = JournalReader(JournalOptions(directory=str(tmp_path), position="start"))
    assert reader.read_status() is None


def test_journal_reader_read_status_valid(tmp_path):
    data = {"event": "Status", "flags": 1}
    (tmp_path / "Status.json").write_text(json.dumps(data))
    reader = JournalReader(JournalOptions(directory=str(tmp_path), position="start"))
    result = reader.read_status()
    assert result["event"] == "Status"
    assert result["flags"] == 1


def test_journal_reader_read_status_invalid_json(tmp_path):
    (tmp_path / "Status.json").write_text("not json")
    reader = JournalReader(JournalOptions(directory=str(tmp_path), position="start"))
    assert reader.read_status() is None


def test_journal_reader_read_market(tmp_path):
    data = {"market": []}
    (tmp_path / "Market.json").write_text(json.dumps(data))
    reader = JournalReader(JournalOptions(directory=str(tmp_path), position="start"))
    result = reader.read_market()
    assert result["market"] == []


def test_journal_reader_read_outfitting(tmp_path):
    data = {"outfitting": []}
    (tmp_path / "Outfitting.json").write_text(json.dumps(data))
    reader = JournalReader(JournalOptions(directory=str(tmp_path), position="start"))
    result = reader.read_outfitting()
    assert result["outfitting"] == []


def test_journal_reader_read_shipyard(tmp_path):
    data = {"shipyard": []}
    (tmp_path / "Shipyard.json").write_text(json.dumps(data))
    reader = JournalReader(JournalOptions(directory=str(tmp_path), position="start"))
    result = reader.read_shipyard()
    assert result["shipyard"] == []


def test_journal_reader_read_cargo(tmp_path):
    data = {"cargo": []}
    (tmp_path / "Cargo.json").write_text(json.dumps(data))
    reader = JournalReader(JournalOptions(directory=str(tmp_path), position="start"))
    result = reader.read_cargo()
    assert result["cargo"] == []


def test_journal_reader_read_events_empty(tmp_path):
    reader = JournalReader(JournalOptions(directory=str(tmp_path), position="start"))
    events = list(reader.read_events())
    assert events == []


def test_journal_reader_read_events(tmp_path):
    log_file = tmp_path / "Journal.2024-01-15T120456_01.log"
    log_file.write_text(
        '{"event":"FSDJump","StarSystem":"Sol"}\n'
        '{"event":"Scan","BodyName":"Earth"}\n'
    )

    reader = JournalReader(JournalOptions(directory=str(tmp_path), position="start"))
    events = list(reader.read_events())
    assert len(events) == 2
    assert events[0]["event"] == "FSDJump"
    assert events[1]["BodyName"] == "Earth"


def test_journal_reader_skips_empty_lines(tmp_path):
    log_file = tmp_path / "Journal.2024-01-15T120456_01.log"
    log_file.write_text(
        '{"event":"FSDJump"}\n\n\n{"event":"Scan"}\n'
    )

    reader = JournalReader(JournalOptions(directory=str(tmp_path), position="start"))
    events = list(reader.read_events())
    assert len(events) == 2


def test_journal_reader_skips_bad_json_lines(tmp_path):
    log_file = tmp_path / "Journal.2024-01-15T120456_01.log"
    log_file.write_text(
        '{"event":"FSDJump"}\n'
        'not json\n'
        '{"event":"Scan"}\n'
    )

    reader = JournalReader(JournalOptions(directory=str(tmp_path), position="start"))
    events = list(reader.read_events())
    assert len(events) == 2


def test_journal_reader_position_tracking(tmp_path):
    log_file = tmp_path / "Journal.2024-01-15T120456_01.log"
    log_file.write_text(
        '{"event":"FSDJump"}\n'
        '{"event":"Scan"}\n'
    )

    reader = JournalReader(JournalOptions(directory=str(tmp_path), position="start"))
    list(reader.read_events())
    assert reader.position is not None
    assert reader.position["file"] == str(log_file)
    assert reader.position["offset"] > 0


def test_journal_reader_resume_from_position(tmp_path):
    log_file = tmp_path / "Journal.2024-01-15T120456_01.log"
    log_file.write_text(
        '{"event":"FSDJump"}\n'
        '{"event":"Scan"}\n'
    )

    reader = JournalReader(JournalOptions(directory=str(tmp_path), position="start"))
    reader.position = {"file": str(log_file), "offset": 20}
    events = list(reader.read_events())
    assert len(events) == 1
    assert events[0]["event"] == "Scan"


def test_journal_reader_default_position_end(tmp_path):
    log_file = tmp_path / "Journal.2024-01-15T120456_01.log"
    log_file.write_text(
        '{"event":"FSDJump"}\n'
        '{"event":"Scan"}\n'
    )

    reader = JournalReader(JournalOptions(directory=str(tmp_path)))
    events = list(reader.read_events())
    assert events == []


def test_journal_reader_explicit_end_position(tmp_path):
    log_file = tmp_path / "Journal.2024-01-15T120456_01.log"
    log_file.write_text(
        '{"event":"FSDJump"}\n'
        '{"event":"Scan"}\n'
    )

    reader = JournalReader(JournalOptions(directory=str(tmp_path), position="end"))
    events = list(reader.read_events())
    assert events == []


class TestTypedEvents:

    def test_file_header_creation(self):
        fh = FileHeader(timestamp="2024-01-15T12:00:00Z", part=1)
        assert fh.timestamp == "2024-01-15T12:00:00Z"
        assert fh.part == 1
        assert fh.event == "FileHeader"
        assert fh.build is None

    def test_docked_creation(self):
        docked = Docked(timestamp="2024-01-15T12:00:00Z", MarketID=128666431, StarSystem="Sol", StationName="Dock", StationType="Coriolis")
        assert docked.StationName == "Dock"
        assert docked.StationType == "Coriolis"
        assert docked.StarSystem == "Sol"
        assert docked.MarketID == 128666431

    def test_fsd_jump_creation(self):
        fsd = FSDJump(timestamp="2024-01-15T12:00:00Z", StarSystem="Sol", StarPos=[0.0, 0.0, 0.0], JumpDist=10.5)
        assert fsd.StarSystem == "Sol"
        assert fsd.StarPos == [0.0, 0.0, 0.0]
        assert fsd.JumpDist == 10.5

    def test_scan_creation(self):
        scan = Scan(timestamp="2024-01-15T12:00:00Z", BodyName="Earth", BodyID=1, DistanceFromArrivalLS=100.0, StarSystem="Sol")
        assert scan.BodyName == "Earth"
        assert scan.BodyID == 1
        assert scan.DistanceFromArrivalLS == 100.0
        assert scan.StarSystem == "Sol"

    def test_event_discriminator_default(self):
        fh = FileHeader(timestamp="x", part=1)
        assert fh.event == "FileHeader"
        docked = Docked(timestamp="x", MarketID=1, StarSystem="x", StationName="x", StationType="x")
        assert docked.event == "Docked"
        fsd = FSDJump(timestamp="x", StarSystem="x", StarPos=[], JumpDist=1.0)
        assert fsd.event == "FSDJump"

    def test_optional_fields_default_to_none(self):
        fh = FileHeader(timestamp="x", part=1)
        assert fh.build is None
        assert fh.gameversion is None
        assert fh.language is None
        assert fh.odyssey is None
        docked = Docked(timestamp="x", MarketID=1, StarSystem="x", StationName="x", StationType="x")
        assert docked.ActiveFine is None
        assert docked.CockpitBreach is None

    def test_shared_types_creation(self):
        econ = StationEconomy(Name="Agriculture", Share=0.5)
        assert econ.Name == "Agriculture"
        assert econ.Share == 0.5
        faction = FactionState(Name="Fed", FactionState="None", Government="Democracy", Influence=0.5, Allegiance="Federation")
        assert faction.Name == "Fed"
        assert faction.Government == "Democracy"
        conflict = Conflict(WarType="war", Status="active", Faction1=ConflictFaction(Name="A", Stake="S1", WonDays=1), Faction2=ConflictFaction(Name="B", Stake="S2", WonDays=2))
        assert conflict.WarType == "war"
        assert conflict.Status == "active"
        assert conflict.Faction1.Name == "A"
        assert conflict.Faction2.Name == "B"

    def test_status_creation(self):
        fuel = Status_Fuel(FuelMain=50.0, FuelReservoir=25.0)
        status = Status(timestamp="2024-01-15T12:00:00Z", Flags=1, Pips=[2, 4, 6], Fuel=fuel, Cargo=0.0, FireGroup=1, GuiFocus=0)
        assert status.Flags == 1
        assert status.Pips == [2, 4, 6]
        assert status.Fuel.FuelMain == 50.0
        assert status.Fuel.FuelReservoir == 25.0

    def test_location_creation(self):
        loc = Location(timestamp="2024-01-15T12:00:00Z", StarSystem="Sol", StarPos=[0.0, 0.0, 0.0])
        assert loc.StarSystem == "Sol"
        assert loc.StarPos == [0.0, 0.0, 0.0]
        assert loc.Body is None

    def test_market_creation(self):
        item = Market_Item(Name="Hydrogen", BuyPrice=100, SellPrice=120, MeanPrice=110, StockBracket=2, DemandBracket=2, Stock=1000, Demand=100, StatusFlags="OK")
        market = Market(timestamp="2024-01-15T12:00:00Z", MarketID=128666431, StationName="Station", StationType="Coriolis", StarSystem="Sol", Items=[item])
        assert market.MarketID == 128666431
        assert market.StationName == "Station"
        assert market.StationType == "Coriolis"
        assert market.StarSystem == "Sol"
        assert market.Items[0].Name == "Hydrogen"
