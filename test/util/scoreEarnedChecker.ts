///<reference path="../../typings/jasmine/jasmine.d.ts"/>
import ScoreTracker = require('../../app/Simulation/Scoring/scoreTracker');

interface Score {
	playerId: number;
	points: number;
}

class ScoreEarnedChecker {
	scores = new Array<Score>();
	
	constructor(scoreTracker: ScoreTracker) {
		scoreTracker.playerEarnedPoints.on(score => this.scores.push(score));
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