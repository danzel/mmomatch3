import GrowOverGridTransformer = require('../../growOverGridTransformer')
import OwnedMatch = require('../ownedMatch');
import Score = require('../score');
import ScoreTracker = require('../scoreTracker');

class GrowOverGridScoreTracker extends ScoreTracker {
	constructor(growOverGridTransformer: GrowOverGridTransformer) {
		super('todo');

		growOverGridTransformer.matchablesTransforming.on(match => this.matchablesTransforming(match));
	}

	matchablesTransforming(match: OwnedMatch): void {
		match.players.forEach(playerId => {
			this.points[playerId] = (this.points[playerId] || 0) + match.match.matchables.length;
			this.playerEarnedPoints.trigger(new Score(playerId, match.match.matchables.length));
		})
	}
}

export = GrowOverGridScoreTracker;