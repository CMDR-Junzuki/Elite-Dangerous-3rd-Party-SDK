const Modules = require('../modules');
const Ships = require('../ships');
const Modifications = require('../modifications');

describe('JSON Data', () => {
	const shipProperties = [
		'name',
		'manufacturer',
		'class',
		'hullCost',
		'speed',
		'boost',
		'boostEnergy',
		'baseShieldStrength',
		'baseArmour',
		'hardness',
		'hullMass',
		'masslock',
		'pipSpeed',
		'pitch',
		'roll',
		'yaw',
		'crew'
	];

	const edIDs = {};
	const eddbIDs = {};

	it('has an up-to-date distribution', () => {
		const dist = require('../dist');
		expect(dist.Ships).toEqual(Ships, 'Distribution ships does not match. Did you run `npm start`?');
		expect(dist.Modules).toEqual(Modules, 'Distribution modules does not match. Did you run `npm start`?');
	});

	it('has valid standard modules', () => {
		const ids = {};
		for (const s in Modules.standard) {
			const group = Modules.standard[s];
			for (let i = 0; i < group.length; i++) {
				const id = group[i].id;
				expect(ids[id]).toBeFalsy('ID already exists: ' + id);
				expect(group[i].edID > 0).toBeTruthy('Standard module ' + id + ' is missing E:D ID');
				expect(group[i].eddbID > 0).toBeTruthy('Standard module ' + id + ' is missing EDDB ID');
				if (s != 'ft' && s != 'pas') {
					expect(group[i].integrity).toBeDefined('Standard module ' + id + ' is missing integrity');
				}
				expect(group[i].grp).toBeDefined(`No group defined, Type: ${s}, ID: ${id}, Index: ${i}`);
        expect(eddbIDs[group[i].eddbID]).toBeFalsy(`EDDB ID [${group[i].eddbID}] already exists: ${group[i].grp}:${id} ${group[i].name ? group[i].name : ''}`);
        expect(edIDs[group[i].edID]).toBeFalsy(`E:D ID [${group[i].edID}] already exists: ${group[i].grp}:${id} ${group[i].name ? group[i].name : ''}`);
				if (group[i].eddbID) {
					eddbIDs[group[i].eddbID] = true;
				}
				if (group[i].edID) {
					edIDs[group[i].edID] = true;
				}
				ids[id] = true;
			}
		}
	});

	it('has valid hardpoints', () => {
		const ids = {};

		for (const g in Modules.hardpoints) {
			const group = Modules.hardpoints[g];
			for (let i = 0; i < group.length; i++) {
				const id = group[i].id;
				expect(ids[id]).toBeFalsy('ID already exists: ' + id);
				expect(group[i].grp).toBeDefined('Hardpoint has no group defined, ID:' + id);
				expect(group[i].mass).toBeDefined(`Hardpoint ${group[i].grp}:${id} ${group[i].name ? group[i].name : ''} is missing mass`);
				expect(group[i].integrity).toBeDefined(`Hardpoint ${group[i].grp}:${id} ${group[i].name ? group[i].name : ''} is missing integrity`);
				expect(group[i].eddbID > 0).toBeTruthy(`Hardpoint ${group[i].grp}:${id} ${group[i].name ? group[i].name : ''} is missing EDDB ID`);
				expect(group[i].edID > 0).toBeTruthy(`Hardpoint ${group[i].grp}:${id} ${group[i].name ? group[i].name : ''} is missing E:D ID`);
				expect(eddbIDs[group[i].eddbID]).toBeFalsy(`EDDB ID [${group[i].eddbID}] already exists: ${group[i].grp}:${id} ${group[i].name ? group[i].name : ''}`);
				expect(edIDs[group[i].edID]).toBeFalsy(`E:D ID [${group[i].edID}] already exists: ${group[i].grp}:${id} ${group[i].name ? group[i].name : ''}`);
				if (group[i].eddbID) {
					eddbIDs[group[i].eddbID] = true;
				}
				if (group[i].edID) {
					edIDs[group[i].edID] = true;
				}
				if (group[i].damage) {
					expect(group[i].damage).toBeDefined(`Hardpoint ${group[i].grp}:${id} ${group[i].name ? group[i].name : ''} is missing damage`);
					expect(group[i].damagedist).toBeDefined(`Hardpoint ${group[i].grp}:${id} ${group[i].name ? group[i].name : ''} is missing damage distribution`);
					if (group[i].grp != 'po') {
						expect(group[i].thermload).toBeDefined(`Hardpoint ${group[i].grp}:${id} ${group[i].name ? group[i].name : ''} is missing thermload`);
						expect(group[i].breachmin).toBeDefined(`Hardpoint ${group[i].grp}:${id} ${group[i].name ? group[i].name : ''} is missing breachmin`);
						expect(group[i].breachmax).toBeDefined(`Hardpoint ${group[i].grp}:${id} ${group[i].name ? group[i].name : ''} is missing breachmax`);
						expect(group[i].breachdmg).toBeDefined(`Hardpoint ${group[i].grp}:${id} ${group[i].name ? group[i].name : ''} is missing breachdmg`);
						expect(group[i].piercing).toBeDefined(`Hardpoint ${group[i].grp}:${id} ${group[i].name ? group[i].name : ''} is missing piercing`);
						expect(group[i].distdraw).toBeDefined(`Hardpoint ${group[i].grp}:${id} ${group[i].name ? group[i].name : ''} is missing distdraw`);
					}
				}
				if ((group[i].ammo || group[i].reload || group[i].clip) && g != 'hs' && g != 'ec') {
					expect(group[i].ammo).toBeDefined(`Hardpoint ${group[i].grp}:${id} ${group[i].name ? group[i].name : ''} is missing ammo`);
					expect(group[i].clip).toBeDefined(`Hardpoint ${group[i].grp}:${id} ${group[i].name ? group[i].name : ''} is missing clip`);
					expect(group[i].reload).toBeDefined(`Hardpoint ${group[i].grp}:${id} ${group[i].name ? group[i].name : ''} is missing reload`);
				}
				ids[id] = true;
			}
		}
	});

	it('has valid internal modules', () => {
		const ids = {};

		for (const g in Modules.internal) {
			const group = Modules.internal[g];
			for (let i = 0; i < group.length; i++) {
				const id = group[i].id;
				expect(group[i].grp).toBeDefined(`No group defined, ID: ${id}`);
				expect(ids[id]).toBeFalsy('ID already exists: ' + id);
				expect(group[i].eddbID > 0).toBeTruthy(`${group[i].grp}:${id} ${group[i].name ? group[i].name : ''} is missing EDDB ID`);
				expect(group[i].edID > 0).toBeTruthy(`${group[i].grp}:${id} ${group[i].name ? group[i].name : ''} is missing E:D ID`);
				if (group[i].grp != 'ft') { // Standard and Internal Fuel tanks have the same IDs
					expect(eddbIDs[group[i].eddbID]).toBeFalsy(`EDDB ID [${group[i].eddbID}] already exists:  ${id}`);
					expect(edIDs[group[i].edID]).toBeFalsy(`E:D ID [${group[i].edID}] already exists:  ${id}`);
				}
				if (group[i].eddbID) {
					eddbIDs[group[i].eddbID] = true;
				}
				if (group[i].edID) {
					edIDs[group[i].edID] = true;
				}
				ids[id] = true;
			}
		}
	});

	it('has data for every ship', () => {
		const bulkheadIds = {};

		for (const s in Ships) {
			for (let p = 0; p < shipProperties.length; p++) {
				expect(Ships[s].properties[shipProperties[p]]).toBeDefined(shipProperties[p] + ' is missing for ' + s);
			}
			expect(Ships[s].eddbID > 0).toBeTruthy(s + ' is missing EDDB ID');
			expect(Ships[s].edID > 0).toBeTruthy(s + ' is missing E:D ID');
			expect(edIDs[Ships[s].edID]).toBeFalsy(`${s} E:D ID [${Ships[s].edID}] already exists`);
			expect(Ships[s].slots.standard.length).toEqual(7, s + ' is missing standard slots');
			expect(Ships[s].defaults.standard.length).toEqual(7, s + ' is missing standard defaults');
			expect(Ships[s].slots.hardpoints.length).toEqual(Ships[s].defaults.hardpoints.length, s + ' hardpoint slots and defaults dont match');
			expect(Ships[s].slots.internal.length).toEqual(Ships[s].defaults.internal.length, s + ' internal slots and defaults dont match');
			expect(Ships[s].retailCost).toBeGreaterThan(Ships[s].properties.hullCost, s + ' has invalid retail cost');
			expect(Ships[s].bulkheads).toBeDefined(s + ' is missing bulkheads');
			expect(Ships[s].bulkheads.length).toEqual(5, s + ' is missing bulkheads');
			if (Ships[s].edID) {
				edIDs[Ships[s].edID] = true;
			}

			for (let i = 0; i < Ships[s].bulkheads.length; i++) {
				const b = Ships[s].bulkheads[i];
				expect(b.id).toBeDefined(`${s} bulkhead [${i}] is missing an ID`);
				expect(bulkheadIds[b.id]).toBeFalsy(`${s} bulkhead [${i} - ${b.id}] ID already exists`);
				expect(b.eddbID > 0).toBeTruthy(`${s} bulkhead [${i} - ${b.id}] is missing EDDB ID`);
				expect(eddbIDs[b.eddbID]).toBeFalsy(`EDDB ID [${b.eddbID}] already exists: ${s} bulkhead [${i} - ${b.id}]`);
				expect(b.edID > 0).toBeTruthy(`${s} bulkhead [${i} - ${b.id}] is missing E:D ID`);
				expect(edIDs[b.edID]).toBeFalsy(`E:D ID [${b.edID}] already exists: ${s} bulkhead [${i} - ${b.id}]`);
				if (b.eddbID) {
					eddbIDs[b.eddbID] = true;
				}
				if (b.edID) {
					edIDs[b.edID] = true;
				}
				bulkheadIds[b.id] = true;
			}
		}
	});

	it('has valid blueprints', () => {
		const ids = {};
		const names = {};

		for (const blueprintname in Modifications.blueprints) {
			const blueprint = Modifications.blueprints[blueprintname];
			expect(names[blueprintname]).toBeFalsy('Name already exists: ' + blueprintname);
			names[blueprintname] = true;
			expect(ids[blueprint.id]).toBeFalsy('ID already exists: ' + blueprint.id);
			ids[blueprint.id] = true;
			expect(blueprint.name).toBeDefined('Blueprint has no name, ID:' + blueprint.id);
			expect(blueprint.grades).toBeDefined('Blueprint has no grades, ID:' + blueprint.id);

			grades = {};
			for (const grade in blueprint.grades) {
				expect(grades[grade]).toBeFalsy('Grade already exists: ' + grade + ' for ' + blueprintname);
				grades[grade] = true;

				const blueprintgrade = blueprint.grades[grade];
				expect(blueprintgrade.components).toBeDefined('Blueprint grade ' + grade + ' has no components for ' + blueprintname);
				expect(blueprintgrade.features).toBeDefined('Blueprint grade ' + grade + ' has no features for ' + blueprintname);
			}
		}
	});

	it('has valid modifications', () => {
		const ids = {};

		for (const k in Modifications.modifications) {
			const modification = Modifications.modifications[k];
			expect(ids[modification.id]).toBeFalsy('ID already exists: ' + modification.id);
			expect(modification.name).toBeDefined('Modification has no name, ID:' + modification.id);
			expect(modification.type).toBeDefined('Modification has no type, ID:' + modification.id);
			expect(modification.method).toBeDefined('Modification has no method, ID:' + modification.id);
			ids[modification.id] = true;
		}
	});

	it('has valid module modifications', () => {
		for (const m in Modifications.modules) {
			const module = Modifications.modules[m];
			for (const bp in module.blueprints) {
				expect(Modifications.blueprints[bp]).toBeDefined('Missing ' + bp + ' for ' + m);
				for (const grade in module.blueprints[bp].grades) {
					expect(Modifications.blueprints[bp].grades[grade]).toBeDefined('Missing ' + bp + ' grade ' + grade + ' for ' + m);
				}
			}
		}
	});

	it('has valid specials', () => {
		const ids = {};

		for (const k in Modifications.specials) {
			const special = Modifications.specials[k];
			expect(ids[special.id]).toBeFalsy('ID already exists: ' + special.id);
			expect(special.name).toBeDefined('Special has no name, ID:' + special.id);
			ids[special.id] = true;
		}
	});
});
