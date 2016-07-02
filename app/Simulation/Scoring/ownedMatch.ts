import Match = require('../match');

class OwnedMatch {
	constructor(public players: Array<number>, public match: Match) {
	}
}

export = OwnedMatch;