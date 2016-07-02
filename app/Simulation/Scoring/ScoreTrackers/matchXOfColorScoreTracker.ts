import ComboOwnership = require('../comboOwnership');
import Language = require('../../../Language');
import OwnedMatch = require('../ownedMatch');
import Score = require('../score');
import ScoreTracker = require('../scoreTracker');

class MatchXOfColorScoreTracker extends ScoreTracker {
	constructor(comboOwnership: ComboOwnership) {
		super(Language.t('pigs/pugs'));
		comboOwnership.ownedMatchPerformed.on((data) => { this.ownedMatchPerformed(data); });
	}

	private ownedMatchPerformed(data: OwnedMatch) {
		for (let i = 0; i < data.players.length; i++) {
			var playerId = data.players[i];

			let points = 0;
			let desiredColor = (playerId % 2 == 1) ? 5 : 3;

			for (var j = 0; j < data.match.matchables.length; j++) {
				let m = data.match.matchables[j];
				if (m.color == desiredColor) {
					points++;
				}
			}

			if (points > 0) {
				this.points[playerId] = (this.points[playerId] || 0) + points;
				//Could move total matches by color in to here instead of ?????
				this.playerEarnedPoints.trigger(new Score(playerId, data.match.matchables.length));
			}
		}
	}
}
export = MatchXOfColorScoreTracker;