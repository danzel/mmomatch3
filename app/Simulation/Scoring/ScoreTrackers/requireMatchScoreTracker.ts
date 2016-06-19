import Language = require('../../../Language');
import RequireMatch = require('../../requireMatch');
import RequireMatchInCellTracker = require('../../requireMatchInCellTracker');
import Score = require('../score');
import ScoreTracker = require('../scoreTracker');

class MatchesScoreTracker extends ScoreTracker {
	constructor(matchTracker: RequireMatchInCellTracker) {
		super(Language.t('rescues'));
		matchTracker.requirementMet.on(match => this.requirementMet(match));
	}

	private requirementMet(data: { requirement: RequireMatch, players: Array<number> }) {
		for (let i = 0; i < data.players.length; i++) {
			var playerId = data.players[i];

			this.points[playerId] = (this.points[playerId] || 0) + 1;

			this.playerEarnedPoints.trigger(new Score(playerId, 1));
		}
	}
}
export = MatchesScoreTracker;