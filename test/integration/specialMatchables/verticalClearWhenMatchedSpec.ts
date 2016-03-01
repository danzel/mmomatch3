///<reference path="../../../typings/jasmine/jasmine.d.ts"/>
import OwnershipMatchChecker = require('../../util/ownershipMatchChecker');
import ScoreEarnedChecker = require('../../util/scoreEarnedChecker');
import TestUtil = require('../../util/util');
import Type = require('../../../app/Simulation/type');

let playerId = 87;

describe('SpecialMatchables.VerticalClearWhenMatched', () => {
	it('is formed when 4 are matched horizontally, and clears vertically when matched', () => {
		let simulation = TestUtil.prepareForTest([
			"7987",
			"9718",
			"1189",
			"1711"
		]);

		let transformCount = 0;
		simulation.disappearer.matchableTransformed.on(() => transformCount++);
		new OwnershipMatchChecker(simulation.comboOwnership);
		let scoreEarnedChecker = new ScoreEarnedChecker(simulation.scoreTracker);

		//Swap to form it in the bottom row
		simulation.swapHandler.swap(playerId, simulation.grid.cells[1][0], simulation.grid.cells[1][1]);
		for (let i = 0; i < 4; i++) {
			simulation.update(1);
		}

		expect(transformCount).toBe(1);
		TestUtil.expectGridQuiet(simulation);
		scoreEarnedChecker.expectScore(40);
		TestUtil.expectGridSize(simulation.grid, [3, 4, 3, 3]);

		//Check the matchable looks right
		let m = simulation.grid.cells[1][0];
		expect(m.isDisappearing).toBe(false);
		expect(m.type).toBe(Type.VerticalClearWhenMatched);
		expect(m.color).toBe(1);
		
		
		//Now swap to match the VerticalClearWhenMatched
		simulation.swapHandler.swap(playerId, simulation.grid.cells[2][0], simulation.grid.cells[2][1]);
		for (let i = 0; i < 4; i++) {
			simulation.update(1);
		}
		
		//Check the grid, all of the second column is cleared, which don't match
		TestUtil.expectGridSize(simulation.grid, [2, 0, 2, 3]);

		TestUtil.expectGridQuiet(simulation);
		scoreEarnedChecker.expectScore(60);
		scoreEarnedChecker.expectNoMoreScores();
	});
});