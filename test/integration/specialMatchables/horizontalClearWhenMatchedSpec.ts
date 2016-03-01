///<reference path="../../../typings/jasmine/jasmine.d.ts"/>
import TestUtil = require('../../util/util');
import Type = require('../../../app/Simulation/type');

let playerId = 87;

describe('SpecialMatchables.HorizontalClearWhenMatched', () => {
	it('is formed when 4 are matched vertically, and clears horizontally when matched', () => {
		let simulation = TestUtil.prepareForTest([
			"1987",
			"1878",
			"7119",
			"1197",
		]);

		let transformCount = 0;
		simulation.disappearer.matchableTransformed.on(() => transformCount++);

		//Swap to form it down the left column
		simulation.swapHandler.swap(playerId, simulation.grid.cells[0][1], simulation.grid.cells[1][1]);
		for (let i = 0; i < 4; i++) {
			simulation.update(1);
		}

		expect(transformCount).toBe(1);
		//Check the grid
		TestUtil.expectGridSize(simulation.grid, [1, 4, 4, 4]);

		//Check the matchable looks right
		let m = simulation.grid.cells[0][0];
		expect(m.isDisappearing).toBe(false);
		expect(m.type).toBe(Type.HorizontalClearWhenMatched);
		expect(m.color).toBe(1);
		
		
		//Now swap to match the HorizontalClearWhenMatched
		simulation.swapHandler.swap(playerId, simulation.grid.cells[2][0], simulation.grid.cells[2][1]);
		for (let i = 0; i < 4; i++) {
			simulation.update(1);
		}
		
		//Check the grid, one is cleared in the last column that doesn't match
		TestUtil.expectGridSize(simulation.grid, [0, 3, 3, 3]);
	});
});