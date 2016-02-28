///<reference path="../../../typings/jasmine/jasmine.d.ts"/>
import TestUtil = require('../../util/util');

let playerId1 = 99;

describe('Points.singleOwner', () => {
    it('gives points for a combo match', () => {
		let simulation = TestUtil.prepareForTest([
			"8218",
			"1122"
		]);

		simulation.update(1);
		simulation.swapHandler.swap(playerId1, simulation.grid.cells[2][0], simulation.grid.cells[2][1]);
		for (let i = 0; i < 4; i++)
			simulation.update(1);

		let points =
			1 * simulation.scoreTracker.pointsPerMatchable * 3 +
			2 * simulation.scoreTracker.pointsPerMatchable * 3;

		expect(simulation.scoreTracker.points[playerId1]).toBe(points);
		TestUtil.expectGridQuiet(simulation);
	});
	
	it('doesnt combo if there is a time break between', () => {
		let simulation = TestUtil.prepareForTest([
			"88182",
			"11228"
		]);

		simulation.update(1);
		simulation.swapHandler.swap(playerId1, simulation.grid.cells[2][0], simulation.grid.cells[2][1]);
		for (let i = 0; i < 3; i++)
			simulation.update(1);
		simulation.swapHandler.swap(playerId1, simulation.grid.cells[4][0], simulation.grid.cells[4][1]);
		for (let i = 0; i < 3; i++)
			simulation.update(1);

		let points =
			1 * simulation.scoreTracker.pointsPerMatchable * 3 +
			1 * simulation.scoreTracker.pointsPerMatchable * 3;

		expect(simulation.scoreTracker.points[playerId1]).toBe(points);
		TestUtil.expectGridQuiet(simulation);
	});

	it('combos if two unrelated matches happen a the same time', () => {
		let simulation = TestUtil.prepareForTest([
			"8819298",
			"1199822"
		]);

		simulation.update(1);
		simulation.swapHandler.swap(playerId1, simulation.grid.cells[2][0], simulation.grid.cells[2][1]);
		simulation.swapHandler.swap(playerId1, simulation.grid.cells[4][0], simulation.grid.cells[4][1]);
		for (let i = 0; i < 3; i++)
			simulation.update(1);

		let points =
			1 * simulation.scoreTracker.pointsPerMatchable * 3 +
			2 * simulation.scoreTracker.pointsPerMatchable * 3;

		expect(simulation.scoreTracker.points[playerId1]).toBe(points);
		TestUtil.expectGridQuiet(simulation);
	});
});