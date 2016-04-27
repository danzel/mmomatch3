import LiteEvent = require('../../liteEvent');
import Score = require('./score');

abstract class ScoreTracker {
	points: { [playerId: number]: number } = {};
	totalPoints = 0;

	playerEarnedPoints = new LiteEvent<Score>();

	constructor(public headingText: string) {
	}

	debugPrint() {
		let list: any = [];

		for (let i in this.points) {
			list.push({ playerId: i, points: this.points[i] });
		}

		list.sort((a: any, b: any) => b.points - a.points);

		console.log('total: ' + this.totalPoints);
		for (let i = 0; i < list.length; i++) {
			var p = list[i];
			console.log(i + ": " + p.playerId + ' @ ' + p.points);
		}
	}
}

export = ScoreTracker;