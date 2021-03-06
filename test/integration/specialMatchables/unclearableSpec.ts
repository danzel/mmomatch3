///<reference path="../../../typings/jasmine/jasmine.d.ts"/>
import Matchable = require('../../../app/Simulation/matchable');
import SwapHandler = require('../../../app/Simulation/swapHandler');
import TestUtil = require('../../util/util');

let playerId = 87;

describe('SpecialMatchables.Unclearable', () => {
    it('cannot be swapped to make a match', () => {
		let simulation = TestUtil.prepareForTest([
			"8*",
			"*9",
			"8*",
		]);
		
		let canSwap = simulation.inputVerifier.swapIsValid(simulation.grid.cells[0][1], simulation.grid.cells[1][1]);
		
		expect(canSwap).toBe(false);
	});

    it('does not match if swapped in to one', () => {
		let simulation = TestUtil.prepareForTest([
			"8*",
			"*8",
			"8*",
		]);
		
		simulation.swapHandler.swap(playerId, simulation.grid.cells[0][1], simulation.grid.cells[1][1]);
		for (let i = 0; i < SwapHandler.TicksToSwap + Matchable.TicksToDisappear; i++) {
			simulation.update();
		}
		
		TestUtil.expectGridSize(simulation.grid, [0, 3]);
	});
});