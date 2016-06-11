///<reference path="../../../typings/jasmine/jasmine.d.ts"/>
import Matchable = require('../../../app/Simulation/matchable');
import PointsScoreTracker = require('../../../app/Simulation/Scoring/ScoreTrackers/pointsScoreTracker');
import SwapHandler = require('../../../app/Simulation/swapHandler');
import TestUtil = require('../../util/util');

let playerId1 = 99;

describe('Points.singleOwner', () => {
    it('gives points for a combo match', () => {
		let simulation = TestUtil.prepareForTest([
			"8218",
			"1122"
		]);
		simulation.scoreTracker = new PointsScoreTracker(simulation.comboOwnership);

		simulation.update();
		simulation.swapHandler.swap(playerId1, simulation.grid.cells[2][0], simulation.grid.cells[2][1]);
		for (let i = 0; i < SwapHandler.TicksToSwap + Matchable.TicksToDisappear * 2 + 21; i++) {
			simulation.update();
		}

		let points =
			1 * (<PointsScoreTracker>(simulation.scoreTracker)).pointsPerMatchable * 3 +
			2 * (<PointsScoreTracker>(simulation.scoreTracker)).pointsPerMatchable * 3;

		expect(simulation.scoreTracker.points[playerId1]).toBe(points);
		TestUtil.expectGridQuiet(simulation);
	});
	
	it('doesnt combo if there is a time break between', () => {
		let simulation = TestUtil.prepareForTest([
			"88182",
			"11228"
		]);
		simulation.scoreTracker = new PointsScoreTracker(simulation.comboOwnership);

		simulation.update();
		simulation.swapHandler.swap(playerId1, simulation.grid.cells[2][0], simulation.grid.cells[2][1]);
		for (let i = 0; i < SwapHandler.TicksToSwap + Matchable.TicksToDisappear + 11; i++) {
			simulation.update();
		}
		simulation.swapHandler.swap(playerId1, simulation.grid.cells[4][0], simulation.grid.cells[4][1]);
		for (let i = 0; i < SwapHandler.TicksToSwap + Matchable.TicksToDisappear + 11; i++) {
			simulation.update();
		}

		let points =
			1 * (<PointsScoreTracker>(simulation.scoreTracker)).pointsPerMatchable * 3 +
			1 * (<PointsScoreTracker>(simulation.scoreTracker)).pointsPerMatchable * 3;

		expect(simulation.scoreTracker.points[playerId1]).toBe(points);
		TestUtil.expectGridQuiet(simulation);
	});

	it('combos if two unrelated matches happen a the same time', () => {
		let simulation = TestUtil.prepareForTest([
			"8819298",
			"1199822"
		]);
		simulation.scoreTracker = new PointsScoreTracker(simulation.comboOwnership);

		simulation.update();
		simulation.swapHandler.swap(playerId1, simulation.grid.cells[2][0], simulation.grid.cells[2][1]);
		simulation.swapHandler.swap(playerId1, simulation.grid.cells[4][0], simulation.grid.cells[4][1]);
		for (let i = 0; i < SwapHandler.TicksToSwap + Matchable.TicksToDisappear + 11; i++) {
			simulation.update();
		}

		let points =
			1 * (<PointsScoreTracker>(simulation.scoreTracker)).pointsPerMatchable * 3 +
			2 * (<PointsScoreTracker>(simulation.scoreTracker)).pointsPerMatchable * 3;

		expect(simulation.scoreTracker.points[playerId1]).toBe(points);
		TestUtil.expectGridQuiet(simulation);
	});
});