import Color = require('./color');
import LiteEvent = require('../liteEvent');
import Match = require('./match');
import MatchPerformer = require('./matchPerformer');

class SimulationStats {
	matchesByColor = new Array<number>(Color.Max);

	matchesByColorUpdated = new LiteEvent<void>();

	constructor(private matchPerformer: MatchPerformer) {
		for (let i = 0; i < Color.Max; i++) {
			this.matchesByColor[i] = 0;
		}
		
		matchPerformer.matchPerformed.on(match => this.matchPerformed(match));
	}

	matchPerformed(match: Match) {
		match.matchables.forEach(m => {
			if (m.color != Color.None) {
				this.matchesByColor[m.color]++;
			}
		})

		this.matchesByColorUpdated.trigger();
	}
}

export = SimulationStats;