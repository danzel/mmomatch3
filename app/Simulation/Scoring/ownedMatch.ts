import Matchable = require('../matchable');

class OwnedMatch {
	players: Array<number>;
	matchables: Array<Matchable>;
	
	constructor(players: Array<number>, matchables: Array<Matchable>) {
		this.players = players;
		this.matchables = matchables;
	}
}

export = OwnedMatch;