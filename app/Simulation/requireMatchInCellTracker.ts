import Match = require('./match');
import MatchPerformer = require('./matchPerformer');
import LiteEvent = require('../liteEvent');
import RequireMatch = require('./requireMatch');

class RequireMatchInCellTracker {
	requirements = new Array<RequireMatch>();
	requirementMet = new LiteEvent<RequireMatch>();

	constructor(matchPerformer: MatchPerformer) {
		matchPerformer.matchPerformed.on((match) => this.matchPerformed(match));
	}

	private matchPerformed(match: Match) {
		for (let i = 0; i < match.matchables.length; i++) {
			let m = match.matchables[i];

			for (let j = 0; j < this.requirements.length; j++) {
				let r = this.requirements[j];

				if (r.x == m.x && r.y == m.y) {
					r.amount--;

					if (r.amount == 0) {
						this.requirementMet.trigger(r);
						this.requirements.splice(j, 1);
						j--;
					}
				}
			}
		}
	}
}

export = RequireMatchInCellTracker;