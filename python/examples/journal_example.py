"""
Example: Reading the player journal

This shows how to read all journal events, watch for new ones,
and read companion files like Status.json.
"""

from elite_dangerous_sdk.journal import (
    Journal,
    JournalWatcher,
    get_journal_directory,
    read_market_file,
    read_status_file,
)


# === Read all existing events ===
def read_all_events():
    journal = Journal()

    print(f"Reading from: {journal.directory}")

    for event in journal:
        if event.event == "FileHeader":
            print(f"Session started: v{event.gameversion} (build {event.build})")
        elif event.event == "LoadGame":
            print(f"Commander {event.Commander} in {event.Ship}")
        elif event.event == "FSDJump":
            print(f"Jumped to {event.StarSystem} ({event.JumpDist} ly)")
        elif event.event == "Docked":
            print(f"Docked at {event.StationName}")
        elif event.event == "Scan":
            print(f"Scanned {event.BodyName}")
        elif event.event == "Location":
            print(f"Location: {event.StarSystem}")


def watch_live():
    """Watch for live journal events."""
    directory = get_journal_directory()
    watcher = JournalWatcher(directory)

    print("Watching for new journal events...")
    for event in watcher.watch_events():
        print(f"[{event.event}] {event.timestamp}")


def read_companion_files():
    """Read Status.json and Market.json companion files."""
    directory = get_journal_directory()

    status = read_status_file(directory)
    if status:
        print(f"Status: Flags={status.Flags}, Cargo={status.Cargo}")
        print(f"Fuel: {status.Fuel.FuelMain}t / {status.Fuel.FuelReservoir}t")
        print(f"Pips: SYS={status.Pips[0]} ENG={status.Pips[1]} WEP={status.Pips[2]}")

    market = read_market_file(directory)
    if market:
        print(f"Market: {market.StarSystem} / {market.StationName}")
        print(f"{len(market.Items)} commodities listed")


# Run examples
# read_all_events()
# watch_live()
# read_companion_files()
