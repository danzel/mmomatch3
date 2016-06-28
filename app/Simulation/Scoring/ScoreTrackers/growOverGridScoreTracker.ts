import ScoreTracker = require('../scoreTracker');

class GrowOverGridScoreTracker extends ScoreTracker {
	constructor() {
		super('todo');
		console.log('todo: ScoreTracker'); //TODO
	}
}

export = GrowOverGridScoreTracker;