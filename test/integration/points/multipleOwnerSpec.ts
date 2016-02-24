///<reference path="../../../typings/jasmine/jasmine.d.ts"/>
import ComboOwnership = require('../../../app/Simulation/Scoring/comboOwnership');
import ScoreTracker = require('../../../app/Simulation/Scoring/scoreTracker');
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
		let ownership = new ComboOwnership(simulation.grid, simulation.swapHandler, simulation.matchPerformer, simulation.quietColumnDetector);
		let scoreTracker = new ScoreTracker(ownership);

		simulation.update(1);
		simulation.swapHandler.swap(playerId1, simulation.grid.cells[2][0], simulation.grid.cells[2][1]);
		simulation.swapHandler.swap(playerId2, simulation.grid.cells[3][2], simulation.grid.cells[3][3]);
		for (let i = 0; i < 3; i++)
			simulation.update(1);

		let points =
			1 * scoreTracker.pointsPerMatchable * 3 +
			2 * scoreTracker.pointsPerMatchable * 4;

		expect(scoreTracker.points[playerId1]).toBe(points);
		expect(scoreTracker.points[playerId2]).toBe(points);
	});
});