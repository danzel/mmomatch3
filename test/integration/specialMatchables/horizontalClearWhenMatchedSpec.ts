///<reference path="../../../typings/jasmine/jasmine.d.ts"/>
import TestUtil = require('../../util/util');
import Type = require('../../../app/Simulation/type');

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

	it('is formed when 4 are matched vertically', () => {
		let simulation = TestUtil.prepareForTest([
			"19",
			"18",
			"71",
			"16",
		]);
		
		let transformCount = 0;
		simulation.disappearer.matchableTransformed.on(() => transformCount++);

		simulation.swapHandler.swap(playerId, simulation.grid.cells[0][1], simulation.grid.cells[1][1]);
		for (let i = 0; i < 4; i++) {
			simulation.update(1);
		}
		
		expect(transformCount).toBe(1);

		expect(simulation.grid.cells[0].length).toBe(1);
		expect(simulation.grid.cells[1].length).toBe(4);

		let m = simulation.grid.cells[0][0];
		expect(m.isDisappearing).toBe(false);
		expect(m.type).toBe(Type.HorizontalClearWhenMatched);
		expect(m.color).toBe(1);
	});
});