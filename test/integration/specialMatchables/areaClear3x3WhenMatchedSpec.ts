///<reference path="../../../typings/jasmine/jasmine.d.ts"/>
import Color = require('../../../app/Simulation/color');
import OwnershipMatchChecker = require('../../util/ownershipMatchChecker');
import ScoreEarnedChecker = require('../../util/scoreEarnedChecker');
import TestUtil = require('../../util/util');
import Type = require('../../../app/Simulation/type');

let playerId = 87;

describe('SpecialMatchables.AreaClear3x3WhenMatched', () => {
	it('is formed when a T match is performed, and clears everything next to it when matched', () => {
		let simulation = TestUtil.prepareForTest([
			"711243",
			"112134",
			"821711",
		]);

		let willTransformCount = 0;
		simulation.matchableTransformer.matchableTransforming.on(() => willTransformCount++);
		let transformCount = 0;
		simulation.disappearer.matchableTransformed.on(() => transformCount++);

		new OwnershipMatchChecker(simulation.comboOwnership);
		let scoreEarnedChecker = new ScoreEarnedChecker(simulation.scoreTracker);

		//Swap to form it
		simulation.swapHandler.swap(playerId, simulation.grid.cells[2][1], simulation.grid.cells[3][1]);
		for (let i = 0; i < 4; i++) {
			simulation.update();
		}

		expect(transformCount).toBe(1);
		TestUtil.expectGridQuiet(simulation);
		scoreEarnedChecker.expectScore(50);
		TestUtil.expectGridSize(simulation.grid, [2, 2, 1, 3, 3, 3]);

		//Check the matchable looks right
		let m = simulation.grid.cells[2][0];
		expect(m.isDisappearing).toBe(false);
		expect(m.type).toBe(Type.AreaClear3x3WhenMatched);
		expect(m.color).toBe(1);

		expect(willTransformCount).toBe(1);
		expect(transformCount).toBe(1);

		//Now match with the other 1s
		expect(simulation.inputVerifier.swapIsValid(simulation.grid.cells[2][0], simulation.grid.cells[3][0])).toBe(true);
		simulation.swapHandler.swap(playerId, simulation.grid.cells[2][0], simulation.grid.cells[3][0]);
		for (let i = 0; i < 4; i++) {
			simulation.update();
		}

		//Check the grid, only 5,6,7,8s should remain
		TestUtil.expectGridSize(simulation.grid, [2, 2, 0, 1, 1, 2]);

		TestUtil.expectGridQuiet(simulation);
		scoreEarnedChecker.expectScore(60);
		scoreEarnedChecker.expectNoMoreScores();
	});
});