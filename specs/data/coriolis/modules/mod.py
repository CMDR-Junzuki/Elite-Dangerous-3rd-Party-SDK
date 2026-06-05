import json
import os

def rof_to_fireint(module: dict):
    rof = module.get('rof', None)
    if rof is not None:
        del module['rof']
        module['fireint'] = 1 / rof
    return module

if __name__ == "__main__":
    for root, _, files in os.walk('./hardpoints'):
        for f in files:
            hardpoint_groups = None
            path = os.path.join(root, f)
            with open(path) as fp:
                hardpoint_groups = json.load(fp)

            hardpoint_groups = { k: list(map(rof_to_fireint, v)) for k, v in hardpoint_groups.items() }
            with open(path, 'w') as fp:
                json.dump(hardpoint_groups, fp, indent=2)
