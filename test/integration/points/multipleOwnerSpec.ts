///<reference path="../../../typings/jasmine/jasmine.d.ts"/>
import Matchable = require('../../../app/Simulation/matchable');
import PointsScoreTracker = require('../../../app/Simulation/Scoring/ScoreTrackers/pointsScoreTracker');
import SwapHandler = require('../../../app/Simulation/swapHandler');
import TestUtil = require('../../util/util');

let playerId1 = 99;
let playerId2 = 97;

describe('Points.multipleOwner', () => {
    it('gives both players points for a combo they both caused', () => {
		let simulation = TestUtil.prepareForTest([
			"   3 ",
			"   3 ",
			"   3 ",
			"   3 ",
			"28222", //ignore the obvious 3 in a row
			"11319 "
		]);
		simulation.scoreTracker = new PointsScoreTracker(simulation.comboOwnership);

		simulation.comboOwnership.ownedMatchPerformed.on(c => console.log('m', c.match.matchables.length, c.players))

		simulation.update();
		simulation.swapHandler.swap(playerId1, simulation.grid.cells[2][0], simulation.grid.cells[3][0]);
		simulation.swapHandler.swap(playerId2, simulation.grid.cells[0][1], simulation.grid.cells[1][1]);
		while (!simulation.quietColumnDetector.gridIsQuiet) {
			simulation.update();
		}

		let pointsPer = (<PointsScoreTracker>(simulation.scoreTracker)).pointsPerMatchable;
		let pointsP1 =
			1 * pointsPer * 4 +
			2 * pointsPer * 3 +
			3 * pointsPer * 5;

		let pointsP2 =
			1 * pointsPer * 4 +
			2 * pointsPer * 5;


		expect(simulation.scoreTracker.points[playerId1]).toBe(pointsP1);
		expect(simulation.scoreTracker.points[playerId2]).toBe(pointsP2);
	});
});