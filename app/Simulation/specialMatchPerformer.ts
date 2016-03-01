import Disappearer = require('./disappearer');
import Grid = require('./grid');
import Match = require('./match');
import Matchable = require('./matchable');
import MatchChecker = require('./matchChecker');
import MatchPerformer = require('./matchPerformer');
import MatchType = require('./matchType');
import Type = require('./type');

/** Handles the special effects that happen when a matchable of not-normal type is matched/disappeared */
class SpecialMatchPerformer {
	constructor(private grid: Grid, private matchChecker: MatchChecker, private matchPerformer: MatchPerformer, disappearer: Disappearer) {
		matchPerformer.matchPerformed.on((match) => this.matchPerformed(match));
	}

	private matchPerformed(match: Match) {
		let matchables = match.matchables;

		for (let i = 0; i < matchables.length; i++) {
			let m = matchables[i];

			switch (m.type) {
				case Type.Normal:
					break;
				case Type.HorizontalClearWhenMatched:
					this.horizontalClear(m);
					break;
				case Type.VerticalClearWhenMatched:
					this.verticalClear(m);
					break;
				default:
					throw new Error("Don't know what to do when a Type " + Type[m.type] + " is matched");
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
			this.matchPerformer.matchPerformed.trigger(new Match(MatchType.HorizontalClear, matched));
		}
	}

	private verticalClear(source: Matchable) {
		let matched = new Array<Matchable>();

		let col = this.grid.cells[source.x];
		for (let y = 0; y < col.length; y++) {
			let hit = col[y];

			if (this.matchChecker.matchableIsAbleToMatch(hit)) {
				hit.isDisappearing = true;
				matched.push(hit);
			}
		}

		if (matched.length > 0) {
			this.matchPerformer.matchPerformed.trigger(new Match(MatchType.HorizontalClear, matched));
		}
	}
}

export = SpecialMatchPerformer;