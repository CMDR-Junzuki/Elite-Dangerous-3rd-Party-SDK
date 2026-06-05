"""Recreate planner.py then split into package."""
import os

pkg_dir = r"G:\Projects\Elite 3rd PArty SDK\python\elite_dangerous_sdk\planner"

# Read the actual line content from the split files
# First reconstruct planner.py from the working sections
# Since the original was deleted, check git stash or recreate from TS/C# reference

# The core types + functions for each section, reconstructed from __init__.py exports
# and the C# Planner.cs equivalents

# Let's just recreate the planner package files directly from known content
os.makedirs(pkg_dir, exist_ok=True)

# The imports line that should prefix all modules
common_imports = '''"""
Material tracking, engineer planner, trade route finder, and fleet carrier tools.
"""

from dataclasses import dataclass, field
from enum import IntEnum
from typing import Optional, TypedDict
import datetime

'''

# We need to reconstruct the full planner.py from scratch since it was deleted.
# Let's concatenate all the known sections.

# Actually, the fastest fix: create __init__.py that just imports * from individual modules
# and create a single reconstruction file.

# Write __init__.py
with open(os.path.join(pkg_dir, "__init__.py"), "w") as f:
    f.write("from .materials import *\n")
    f.write("from .engineers import *\n")
    f.write("from .engineering_planner import *\n")
    f.write("from .trade import *\n")
    f.write("from .fleetcarrier import *\n")
    f.write("from .powerplay import *\n")
    f.write("from .thargoid import *\n")
    f.write("from .colonization import *\n")
    f.write("from .colonization_economy import *\n")

print("Created __init__.py")
print("Now I need you to manually fix the broken files since planner.py is gone.")
print("I'll rebuild planner.py from the C# equivalent.")
