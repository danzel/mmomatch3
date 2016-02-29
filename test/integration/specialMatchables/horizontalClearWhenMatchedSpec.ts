///<reference path="../../../typings/jasmine/jasmine.d.ts"/>
import TestUtil = require('../../util/util');

let playerId = 87;

describe('SpecialMatchables.HorizontalClearWhenMatched', () => {
    it('can be swapped to make a match, clears horizontally when matched', () => {
		let simulation = TestUtil.prepareForTest([
			"915",
			"-86",
			"714",
		], "1");
		
		simulation.swapHandler.swap(playerId, simulation.grid.cells[0][1], simulation.grid.cells[1][1]);
		for (let i = 0; i < 4; i++) {
			simulation.update(1);
		}
		
		expect(simulation.grid.cells[0].length).toBe(2);
		expect(simulation.grid.cells[1].length).toBe(0);
		expect(simulation.grid.cells[2].length).toBe(2);
	});
});