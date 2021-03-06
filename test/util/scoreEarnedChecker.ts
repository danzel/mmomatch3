///<reference path="../../typings/jasmine/jasmine.d.ts"/>
import PointsScoreTracker = require('../../app/Simulation/Scoring/ScoreTrackers/pointsScoreTracker');
import Simulation = require('../../app/Simulation/simulation');

interface Score {
	playerId: number;
	points: number;
}

class ScoreEarnedChecker {
	scores = new Array<Score>();
	
	constructor(simulation: Simulation) {
		new PointsScoreTracker(simulation.comboOwnership).playerEarnedPoints.on(score => this.scores.push(score));
	}
	
	expectScore(points: number, playerId?: number) {
		if (this.scores.length == 0) {
			expect("there to be some more scores").toBe(true);
			return;
		}
		
		expect(this.scores[0].points).toBe(points);
		if (playerId) {
			expect(this.scores[0].playerId).toBe(playerId);
		}
		this.scores.shift();
	}
	
	expectNoMoreScores() {
		expect(this.scores).toEqual([]);
	}
}

export = ScoreEarnedChecker;