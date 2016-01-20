import ComboOwnership = require('./comboOwnership');
import OwnedMatch = require('./ownedMatch');

class ScoreTracker {
	points: { [playerId: number]: number } = {};

	constructor(comboOwnership: ComboOwnership) {
		comboOwnership.ownedMatchPerformed.on(this.ownedMatchPerformed.bind(this));
	}

	ownedMatchPerformed(data: OwnedMatch) {
		for (let i = 0; i < data.players.length; i++) {
			var playerId = data.players[i];
			if (!this.points[playerId]) {
				this.points[playerId] = data.matchables.length;
			}
			else {
				this.points[playerId] += data.matchables.length;
			}
		}
		
		this.debugPrint();
	}

	debugPrint() {
		let list = [];

		for (let i in this.points) {
			list.push({ playerId: i, points: this.points[i] });
		}
		
		list.sort((a, b) => b.points - a.points);
		
		for (let i = 0; i < list.length; i++) {
			var p = list[i];
			console.log(i + ": " + p.playerId + ' @ ' + p.points);
		}
	}
}

export = ScoreTracker;