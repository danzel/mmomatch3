///<reference path="../../../typings/jasmine/jasmine.d.ts"/>
import Grid = require('../../../app/Simulation/grid');
import Matchable = require('../../../app/Simulation/matchable');
import MatchableFactory = require('../../../app/Simulation/matchableFactory');
import NeverSpawnManager = require('../../util/neverSpawnManager');
import OwnershipMatchChecker = require('../../util/ownershipMatchChecker');
import OwnedMatch = require('../../../app/Simulation/Scoring/ownedMatch');
import QuietColumnDetector = require('../../../app/Simulation/quietColumnDetector');
import Simulation = require('../../../app/Simulation/simulation');
import SwapHandler = require('../../../app/Simulation/swapHandler');
import TestUtil = require('../../util/util');

let playerId1 = 99;
let playerId2 = 95;

describe('ComboOwnership.stopOwning', () => {
    it('stops ownership after a fall', () => {

		let simulation = TestUtil.prepareForTest([
			"2255",
			"1121"
		]);

		let ownershipChecker = new OwnershipMatchChecker(simulation.comboOwnership);

		simulation.update();
		simulation.swapHandler.swap(playerId1, simulation.grid.cells[2][0], simulation.grid.cells[3][0]);
		for (let i = 0; i < SwapHandler.TicksToSwap + Matchable.TicksToDisappear + 1; i++) {
			simulation.update();
		}

		//At this stage everything should have stopped moving, so ownership from the first match should be cleared
		simulation.swapHandler.swap(playerId2, simulation.grid.cells[2][0], simulation.grid.cells[3][0]);
		for (let i = 0; i < SwapHandler.TicksToSwap + 1; i++) {
			simulation.update();
		}

		ownershipChecker.verifyMatch(3, [playerId1]);
		ownershipChecker.verifyMatch(3, [playerId2]);

		ownershipChecker.verifyNoRemainingMatches()
	});

    it('stops ownership when half the swap doesnt match', () => {

		//Match 1, then 2 by the other player
		let simulation = TestUtil.prepareForTest([
			"   2  ",
			"223244",
			"441311"
		]);

		let ownershipChecker = new OwnershipMatchChecker(simulation.comboOwnership);

		simulation.update();
		simulation.swapHandler.swap(playerId1, simulation.grid.cells[2][0], simulation.grid.cells[3][0]); //1
		for (let i = 0; i < SwapHandler.TicksToSwap + Matchable.TicksToDisappear + 1; i++) {
			simulation.update();
		}
		simulation.swapHandler.swap(playerId2, simulation.grid.cells[2][1], simulation.grid.cells[3][1]); //2
		for (let i = 0; i < SwapHandler.TicksToSwap + Matchable.TicksToDisappear; i++) {
			simulation.update();
		}

		ownershipChecker.verifyMatch(3, [playerId1]);
		ownershipChecker.verifyMatch(3, [playerId2]);
		ownershipChecker.verifyNoRemainingMatches();
		TestUtil.expectGridQuiet(simulation);
	});
});