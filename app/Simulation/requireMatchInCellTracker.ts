import ComboOwnership = require('./Scoring/comboOwnership');
import LiteEvent = require('../liteEvent');
import OwnedMatch = require('./Scoring/ownedMatch');
import RequireMatch = require('./requireMatch');

class RequireMatchInCellTracker {
	requirements = new Array<RequireMatch>();
	requirementMet = new LiteEvent<{ requirement: RequireMatch, players: Array<number> }>();
	requirementPartiallyMet = new LiteEvent<RequireMatch>();

	constructor(comboOwnership: ComboOwnership) {
		comboOwnership.ownedMatchPerformed.on((data) => { this.ownedMatchPerformed(data); });
	}

	private ownedMatchPerformed(match: OwnedMatch) {
		for (let i = 0; i < match.match.matchables.length; i++) {
			let m = match.match.matchables[i];

			for (let j = 0; j < this.requirements.length; j++) {
				let r = this.requirements[j];

				if (r.x == m.x && r.y == m.y) {
					r.amount--;

					if (r.amount == 0) {
						this.requirements.splice(j, 1);
						this.requirementMet.trigger({ requirement: r, players: match.players });
						j--;
					} else {
						this.requirementPartiallyMet.trigger(r);
					}
				}
			}
		}
	}
}

export = RequireMatchInCellTracker;