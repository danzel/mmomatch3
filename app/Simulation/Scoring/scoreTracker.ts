import ComboOwnership = require('./comboOwnership');
import LiteEvent = require('../../liteEvent');
import OwnedMatch = require('./ownedMatch');

class ScoreTracker {
	pointsPerMatchable = 10;
	points: { [playerId: number]: number } = {};
	totalPoints: number = 0;
	
	playerEarnedPoints = new LiteEvent<number>();
	
	private playerComboSize: { [playerId: number]: number } = {};

	constructor(comboOwnership: ComboOwnership) {
		comboOwnership.ownedMatchPerformed.on((data) => { this.ownedMatchPerformed(data); });
		comboOwnership.playerNoLongerInCombo.on((playerId) => this.playerNoLongerInCombo(playerId));
	}

	private ownedMatchPerformed(data: OwnedMatch) {
		for (let i = 0; i < data.players.length; i++) {
			var playerId = data.players[i];

			let comboSize = (this.playerComboSize[playerId] || 0) + 1;
			let points = comboSize * this.pointsPerMatchable * data.matchables.length;

			this.playerComboSize[playerId] = comboSize;
			this.points[playerId] = (this.points[playerId] || 0) + points;
			this.totalPoints += points;
			
			this.playerEarnedPoints.trigger(playerId);
		}

		//this.debugPrint();
	}

	private playerNoLongerInCombo(playerId: number) {
		this.playerComboSize[playerId] = 0;
	}

	debugPrint() {
		let list: any = [];

		for (let i in this.points) {
			list.push({ playerId: i, points: this.points[i] });
		}

		list.sort((a: any, b: any) => b.points - a.points);

		for (let i = 0; i < list.length; i++) {
			var p = list[i];
			console.log(i + ": " + p.playerId + ' @ ' + p.points);
		}
	}
}

export = ScoreTracker;