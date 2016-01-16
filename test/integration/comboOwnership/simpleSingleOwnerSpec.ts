///<reference path="../../../typings/jasmine/jasmine.d.ts"/>
import ComboOwnership = require('../../../app/Simulation/Scoring/comboOwnership');
import Grid = require('../../../app/Simulation/grid');
import QuietColumnDetector = require('../../../app/Simulation/quietColumnDetector');
import MatchableFactory = require('../../../app/Simulation/matchableFactory');
import NeverSpawnManager = require('../../util/neverSpawnManager');
import OwnershipMatchChecker = require('../../util/ownershipMatchChecker');
import OwnedMatch = require('../../../app/Simulation/Scoring/ownedMatch');
import Simulation = require('../../../app/Simulation/simulation');
import TestUtil = require('../../util/util');

//TODO: We'll need to handle swaps made over a hole, meaning one drops down (and then gets matched)

let playerId1 = 99;

describe('ComboOwnership.simpleSingleOwner', () => {
    it('gives ownership of a single horizontal swap', () => {

		let simulation = TestUtil.prepareForTest([
			"1211"
		]);
		let ownership = new ComboOwnership(simulation.grid, simulation.swapHandler, simulation.matchPerformer, new QuietColumnDetector(simulation.grid, simulation.physics));

		let ownershipChecker = new OwnershipMatchChecker(ownership);

		simulation.update(1);
		simulation.swapHandler.swap(playerId1, simulation.grid.cells[0][0], simulation.grid.cells[1][0]);
		simulation.update(1);

		ownershipChecker.verifyMatch(3, [playerId1]);
		ownershipChecker.verifyNoRemainingMatches()
	});

    it('gives ownership of a single vertical swap', () => {

		let simulation = TestUtil.prepareForTest([
			"1",
			"2",
			"1",
			"1"
		]);
		let ownership = new ComboOwnership(simulation.grid, simulation.swapHandler, simulation.matchPerformer, new QuietColumnDetector(simulation.grid, simulation.physics));

		let ownershipChecker = new OwnershipMatchChecker(ownership);

		simulation.update(1);
		simulation.swapHandler.swap(playerId1, simulation.grid.cells[0][2], simulation.grid.cells[0][3]);
		simulation.update(1);

		ownershipChecker.verifyMatch(3, [playerId1]);
		ownershipChecker.verifyNoRemainingMatches();
	});

    it('gives ownership of a double combo', () => {

		let simulation = TestUtil.prepareForTest([
			"3223",
			"1211"
		]);
		let ownership = new ComboOwnership(simulation.grid, simulation.swapHandler, simulation.matchPerformer, new QuietColumnDetector(simulation.grid, simulation.physics));

		let ownershipChecker = new OwnershipMatchChecker(ownership);

		simulation.update(1);
		simulation.swapHandler.swap(playerId1, simulation.grid.cells[0][0], simulation.grid.cells[1][0]);
		for (let i = 0; i < 4; i++)
			simulation.update(1);

		ownershipChecker.verifyMatch(3, [playerId1]);
		ownershipChecker.verifyMatch(3, [playerId1]);
		ownershipChecker.verifyNoRemainingMatches();
	});

    it('gives ownership of a complicated combo', () => {

		//Match 2,3,4
		let simulation = TestUtil.prepareForTest([
			"3    ",
			"2    ",
			"2 4  ",
			"13344",
			"21212"
		]);
		let ownership = new ComboOwnership(simulation.grid, simulation.swapHandler, simulation.matchPerformer, new QuietColumnDetector(simulation.grid, simulation.physics));

		let ownershipChecker = new OwnershipMatchChecker(ownership);

		simulation.update(1);
		simulation.swapHandler.swap(playerId1, simulation.grid.cells[0][0], simulation.grid.cells[0][1]);
		for (let i = 0; i < 4; i++)
			simulation.update(1);

		ownershipChecker.verifyMatch(3, [playerId1]);
		ownershipChecker.verifyMatch(3, [playerId1]);
		ownershipChecker.verifyMatch(3, [playerId1]);
		ownershipChecker.verifyNoRemainingMatches();
	});
});
