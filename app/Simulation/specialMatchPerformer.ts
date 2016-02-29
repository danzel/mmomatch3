import Disappearer = require('./disappearer');
import Grid = require('./grid');
import Matchable = require('./matchable');
import MatchChecker = require('./matchChecker');
import MatchPerformer = require('./matchPerformer');
import Type = require('./type');

/** Handles the special effects that happen when a matchable of not-normal type is matched/disappeared */
class SpecialMatchPerformer {
	constructor(private grid: Grid, private matchChecker: MatchChecker, private matchPerformer: MatchPerformer, disappearer: Disappearer) {
		matchPerformer.matchPerformed.on((matchables) => this.matchPerformed(matchables));
	}
	
	private matchPerformed(matchables: Array<Matchable>) {
		for (let i = 0; i < matchables.length; i++) {
			let m = matchables[i];
			
			if (m.type == Type.HorizontalClearWhenMatched) {
				this.horizontalClear(m);
			}
		}
	}
	
	private horizontalClear(source: Matchable) {
		let matched = new Array<Matchable>();
		
		for (let x = 0; x < this.grid.width; x++) {
			let hit = this.grid.findMatchableAtPosition(x, source.y);
			
			if (hit && this.matchChecker.matchableIsAbleToMatch(hit)) {
				hit.isDisappearing = true;
				matched.push(hit);
			}
		}
		
		if (matched.length > 0) {
			this.matchPerformer.matchPerformed.trigger(matched);
		}
	}
}

export = SpecialMatchPerformer;