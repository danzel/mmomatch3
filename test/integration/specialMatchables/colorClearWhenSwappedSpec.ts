///<reference path="../../../typings/jasmine/jasmine.d.ts"/>
import Color = require('../../../app/Simulation/color');
import OwnershipMatchChecker = require('../../util/ownershipMatchChecker');
import ScoreEarnedChecker = require('../../util/scoreEarnedChecker');
import TestUtil = require('../../util/util');
import Type = require('../../../app/Simulation/type');

let playerId = 87;

describe('SpecialMatchables.ColorClearWhenMatched', () => {
	it('is formed when 5 are matched vertically, and clears all of a color when swapped with one', () => {
		let simulation = TestUtil.prepareForTest([
			"1256",
			"1878",
			"7192",
			"1829",
			"1227",
		]);

		let willTransformCount = 0;
		simulation.matchableTransformer.matchableTransforming.on(() => willTransformCount++);
		let transformCount = 0;
		simulation.disappearer.matchableTransformed.on(() => transformCount++);

		new OwnershipMatchChecker(simulation.comboOwnership);
		let scoreEarnedChecker = new ScoreEarnedChecker(simulation.scoreTracker);

		//Swap to form it down the left column
		simulation.swapHandler.swap(playerId, simulation.grid.cells[0][2], simulation.grid.cells[1][2]);
		for (let i = 0; i < 4; i++) {
			simulation.update();
		}

		expect(transformCount).toBe(1);
		TestUtil.expectGridQuiet(simulation);
		scoreEarnedChecker.expectScore(50);
		TestUtil.expectGridSize(simulation.grid, [1, 5, 5, 5]);

		//Check the matchable looks right
		let m = simulation.grid.cells[0][0];
		expect(m.isDisappearing).toBe(false);
		expect(m.type).toBe(Type.ColorClearWhenSwapped);
		expect(m.color).toBe(Color.None);
		expect(willTransformCount).toBe(1);
		expect(transformCount).toBe(1);


		//Now swap with a 2 to clear them all
		expect(simulation.inputVerifier.swapIsValid(simulation.grid.cells[0][0], simulation.grid.cells[1][0])).toBe(true);
		simulation.swapHandler.swap(playerId, simulation.grid.cells[0][0], simulation.grid.cells[1][0]);
		for (let i = 0; i < 4; i++) {
			simulation.update();
		}

		//Check the grid, only 5,6,7,8s should remain
		TestUtil.expectGridSize(simulation.grid, [0, 3, 3, 4]);

		TestUtil.expectGridQuiet(simulation);
		scoreEarnedChecker.expectScore(60);
		scoreEarnedChecker.expectNoMoreScores();
	});

	it('is formed when 5 are matched horizontally which also makes a T', () => {
		let simulation = TestUtil.prepareForTest([
			"  1  ",
			"  1  ",
			"11211",
			"88188",
		]);

		simulation.swapHandler.swap(playerId, simulation.grid.cells[2][0], simulation.grid.cells[2][1]);
		for (let i = 0; i < 4; i++) {
			simulation.update();
		}
		
		let result = simulation.grid.cells[2][1];
		expect(result.type).toBe(Type.ColorClearWhenSwapped);
	});
});