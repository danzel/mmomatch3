///<reference path="../../../typings/jasmine/jasmine.d.ts"/>
import Grid = require('../../../app/Simulation/grid');
import QuietColumnDetector = require('../../../app/Simulation/quietColumnDetector');
import Matchable = require('../../../app/Simulation/matchable');
import MatchableFactory = require('../../../app/Simulation/matchableFactory');
import NeverSpawnManager = require('../../util/neverSpawnManager');
import OwnershipMatchChecker = require('../../util/ownershipMatchChecker');
import OwnedMatch = require('../../../app/Simulation/Scoring/ownedMatch');
import Simulation = require('../../../app/Simulation/simulation');
import SwapHandler = require('../../../app/Simulation/swapHandler');
import TestUtil = require('../../util/util');

let playerId1 = 99;

describe('ComboOwnership.simpleSingleOwner', () => {
    it('gives ownership of a single horizontal swap', () => {

		let simulation = TestUtil.prepareForTest([
			"1211"
		]);

		let ownershipChecker = new OwnershipMatchChecker(simulation.comboOwnership);

		simulation.update();
		simulation.swapHandler.swap(playerId1, simulation.grid.cells[0][0], simulation.grid.cells[1][0]);
		for (let i = 0; i < SwapHandler.TicksToSwap + Matchable.TicksToDisappear; i++) {
			simulation.update();
		}

		ownershipChecker.verifyMatch(3, [playerId1]);
		ownershipChecker.verifyNoRemainingMatches();
		expect(simulation.comboOwnership.isPlayerInCombo(playerId1)).toBe(false);
	});

    it('gives ownership of a single vertical swap', () => {

		let simulation = TestUtil.prepareForTest([
			"1",
			"2",
			"1",
			"1"
		]);

		let ownershipChecker = new OwnershipMatchChecker(simulation.comboOwnership);

		simulation.update();
		simulation.swapHandler.swap(playerId1, simulation.grid.cells[0][2], simulation.grid.cells[0][3]);
		for (let i = 0; i < SwapHandler.TicksToSwap + Matchable.TicksToDisappear + 19; i++) {
			simulation.update();
		}

		ownershipChecker.verifyMatch(3, [playerId1]);
		ownershipChecker.verifyNoRemainingMatches();
		expect(simulation.comboOwnership.isPlayerInCombo(playerId1)).toBe(false);
	});

    it('gives ownership of a double combo', () => {

		let simulation = TestUtil.prepareForTest([
			"3223",
			"1211"
		]);

		let ownershipChecker = new OwnershipMatchChecker(simulation.comboOwnership);

		simulation.update();
		simulation.swapHandler.swap(playerId1, simulation.grid.cells[0][0], simulation.grid.cells[1][0]);
		for (let i = 0; i < SwapHandler.TicksToSwap + Matchable.TicksToDisappear * 2 + 21; i++) {
			simulation.update();
		}

		ownershipChecker.verifyMatch(3, [playerId1]);
		ownershipChecker.verifyMatch(3, [playerId1]);
		ownershipChecker.verifyNoRemainingMatches();
		expect(simulation.comboOwnership.isPlayerInCombo(playerId1)).toBe(false);
	});

    it('gives ownership of a complicated combo', () => {

		//Match 2,3,4
		let simulation = TestUtil.prepareForTest([
			"2    ",
			"1    ",
			"1 3  ",
			"82233",
			"19898"
		]);

		let ownershipChecker = new OwnershipMatchChecker(simulation.comboOwnership);

		simulation.update();
		simulation.swapHandler.swap(playerId1, simulation.grid.cells[0][0], simulation.grid.cells[0][1]);
		for (let i = 0; i < SwapHandler.TicksToSwap + Matchable.TicksToDisappear * 3 + 28; i++) {
			simulation.update();
		}

		ownershipChecker.verifyMatch(3, [playerId1]);
		ownershipChecker.verifyMatch(3, [playerId1]);
		ownershipChecker.verifyMatch(3, [playerId1]);
		ownershipChecker.verifyNoRemainingMatches();
		TestUtil.expectGridQuiet(simulation);
		expect(simulation.comboOwnership.isPlayerInCombo(playerId1)).toBe(false);
	});
});
