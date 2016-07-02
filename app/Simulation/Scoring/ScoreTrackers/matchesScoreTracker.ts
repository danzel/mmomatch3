import ComboOwnership = require('../comboOwnership');
import Language = require('../../../Language');
import OwnedMatch = require('../ownedMatch');
import Score = require('../score');
import ScoreTracker = require('../scoreTracker');

class MatchesScoreTracker extends ScoreTracker {
	constructor(comboOwnership: ComboOwnership) {
		super(Language.t('animals'));
		comboOwnership.ownedMatchPerformed.on((data) => { this.ownedMatchPerformed(data); });
	}

	private ownedMatchPerformed(data: OwnedMatch) {
		for (let i = 0; i < data.players.length; i++) {
			var playerId = data.players[i];

			this.points[playerId] = (this.points[playerId] || 0) + data.match.matchables.length;
			//Could move total matches in to here instead of matchPerformer

			this.playerEarnedPoints.trigger(new Score(playerId, data.match.matchables.length));
		}
	}
}
export = MatchesScoreTracker;