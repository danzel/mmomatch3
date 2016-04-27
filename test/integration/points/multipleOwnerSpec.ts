///<reference path="../../../typings/jasmine/jasmine.d.ts"/>
import PointsScoreTracker = require('../../../app/Simulation/Scoring/ScoreTrackers/pointsScoreTracker');
import TestUtil = require('../../util/util');

let playerId1 = 99;
let playerId2 = 97;

describe('Points.multipleOwner', () => {
    it('gives both players points for a combo they both caused', () => {
		let simulation = TestUtil.prepareForTest([
			"898298",
			"989389",
			"891298",
			"113233"
		]);
		simulation.scoreTracker = new PointsScoreTracker(simulation.comboOwnership);

		simulation.update();
		simulation.swapHandler.swap(playerId1, simulation.grid.cells[2][0], simulation.grid.cells[2][1]);
		simulation.swapHandler.swap(playerId2, simulation.grid.cells[3][2], simulation.grid.cells[3][3]);
		for (let i = 0; i < 3; i++)
			simulation.update();

		let points =
			1 * (<PointsScoreTracker>(simulation.scoreTracker)).pointsPerMatchable * 3 +
			2 * (<PointsScoreTracker>(simulation.scoreTracker)).pointsPerMatchable * 4;

		expect(simulation.scoreTracker.points[playerId1]).toBe(points);
		expect(simulation.scoreTracker.points[playerId2]).toBe(points);
	});
});