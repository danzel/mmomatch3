///<reference path="../../typings/jasmine/jasmine.d.ts"/>
import ComboOwnership = require('../../app/Simulation/Scoring/comboOwnership');
import Grid = require('../../app/Simulation/grid');
import QuietColumnDetector = require('../../app/Simulation/quietColumnDetector');
import MatchableFactory = require('../../app/Simulation/matchableFactory');
import NeverSpawnManager = require('../util/neverSpawnManager');
import OwnedMatch = require('../../app/Simulation/Scoring/ownedMatch');
import Simulation = require('../../app/Simulation/simulation');
import TestUtil = require('../util/util');

function prepareForTest(gridConfig: Array<string>) : Simulation {
	var grid = new Grid(gridConfig[0].length, gridConfig.length);
	TestUtil.populateGrid(grid, gridConfig);
	var matchableFactory = new MatchableFactory();
	var simulation = new Simulation(grid, new NeverSpawnManager(this.grid, matchableFactory), matchableFactory);
	
	return simulation;
}


describe('ComboOwnership', () => {
    it('gives ownership of a single swap', () => {
		
		let playerId = 99;
		let simulation = prepareForTest(["111"]);
		let ownership = new ComboOwnership(simulation.grid, simulation.swapHandler, simulation.matchPerformer, new QuietColumnDetector(simulation.grid, simulation.physics));

		let matches: Array<OwnedMatch> = [];
		ownership.ownedMatchPerformed.on(function(data) {
			matches.push(data)
		})
		
		simulation.update(1);
		simulation.swapHandler.swap(playerId, simulation.grid.cells[0][0], simulation.grid.cells[1][0]);
		simulation.update(1);
		
		expect(matches.length).toBe(1);
		
		var match = matches[0];
		
		expect(match.matchables.length).toBe(3);
		expect(match.players.length).toBe(1);
		expect(match.players[0]).toBe(playerId);
	});
});