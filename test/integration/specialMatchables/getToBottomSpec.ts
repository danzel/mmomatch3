///<reference path="../../../typings/jasmine/jasmine.d.ts"/>
import Color = require('../../../app/Simulation/color');
import Matchable = require('../../../app/Simulation/matchable');
import OwnershipMatchChecker = require('../../util/ownershipMatchChecker');
import ScoreEarnedChecker = require('../../util/scoreEarnedChecker');
import SwapHandler = require('../../../app/Simulation/swapHandler');
import TestUtil = require('../../util/util');
import Type = require('../../../app/Simulation/type');

let playerId = 87;

describe('SpecialMatchables.GetToBottom', () => {
	it('disappears when it gets to the bottom', () => {
		let simulation = TestUtil.prepareForTest([
			"4B59",
			"5148",
			"6198",
			"1763",
		]);

		new OwnershipMatchChecker(simulation.comboOwnership);
		let scoreEarnedChecker = new ScoreEarnedChecker(simulation);

		//Swap to drop it to the bottom
		simulation.swapHandler.swap(playerId, simulation.grid.cells[0][0], simulation.grid.cells[1][0]);
		for (let i = 0; i < SwapHandler.TicksToSwap+ Matchable.TicksToDisappear * 2 + 18; i++) {
			simulation.update();
		}

		TestUtil.expectGridQuiet(simulation);
		scoreEarnedChecker.expectScore(30);
		scoreEarnedChecker.expectScore(20);
		TestUtil.expectGridSize(simulation.grid, [4, 0, 4, 4]);

		scoreEarnedChecker.expectNoMoreScores();
	});
	
	it('cannot be swapped to the bottom if that doesnt make a match', () => {
		let simulation = TestUtil.prepareForTest([
			"B",
			"1",
		]);

		expect(simulation.inputVerifier.swapIsValid(simulation.grid.cells[0][0], simulation.grid.cells[0][1])).toBe(false);
	});
});