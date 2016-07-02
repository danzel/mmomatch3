import ComboOwnership = require('../comboOwnership');
import Language = require('../../../Language');
import OwnedMatch = require('../ownedMatch');
import Score = require('../score');
import ScoreTracker = require('../scoreTracker');

class PointsScoreTracker extends ScoreTracker {
	pointsPerMatchable = 10;

	playerComboSize: { [playerId: number]: number } = {};

	constructor(comboOwnership: ComboOwnership) {
		super(Language.t('points'));
		comboOwnership.ownedMatchPerformed.on((data) => { this.ownedMatchPerformed(data); });
		comboOwnership.playerNoLongerInCombo.on((playerId) => this.playerNoLongerInCombo(playerId));
	}

	private ownedMatchPerformed(data: OwnedMatch) {
		for (let i = 0; i < data.players.length; i++) {
			var playerId = data.players[i];

			let comboSize = (this.playerComboSize[playerId] || 0) + 1;
			let points = comboSize * this.pointsPerMatchable * data.match.matchables.length;
			//console.log('player', playerId, 'comboSize', comboSize, 'size', data.matchables.length, '=', points)

			this.playerComboSize[playerId] = comboSize;
			this.points[playerId] = (this.points[playerId] || 0) + points;
			this.totalPoints += points;

			this.playerEarnedPoints.trigger(new Score(playerId, points));
		}

		//this.debugPrint();
	}

	private playerNoLongerInCombo(playerId: number) {
		this.playerComboSize[playerId] = 0;
	}
}
export = PointsScoreTracker;