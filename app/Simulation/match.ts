import Matchable = require('./matchable');
import MatchType = require('./matchType');

class Match {
	constructor(public matchType: MatchType, public matchables: Array<Matchable>) {
	}
}

export = Match;