import Grid = require('./grid');
import LiteEvent = require('../liteEvent');
import Match = require('./match');
import Matchable = require('./matchable');
import MatchChecker = require('./matchChecker');
import MatchType = require('./matchType');
import Physics = require('./physics');
import Swap = require('./swap');
import SwapHandler = require('./swapHandler');

class MatchPerformer {
	private matchChecker: MatchChecker;

	/** Fired whenever a matchable starts disappearing */
	matchPerformed = new LiteEvent<Match>();

	constructor(matchChecker: MatchChecker, swapHandler: SwapHandler, physics: Physics) {
		this.matchChecker = matchChecker;

		swapHandler.swapOccurred.on(this.onSwapOccurred.bind(this));
		physics.matchableLanded.on(this.testForMatch.bind(this));
	}

	private onSwapOccurred(swap: Swap) {
		let didSwap = this.testForMatch(swap.left);

		if (!swap.right.isDisappearing) {
			didSwap = this.testForMatch(swap.right) || didSwap;
		}
		
		//TODO: Only if swaps making a match is required
		if (!didSwap) {
			throw new Error("Swapped " + swap.left.x + "," + swap.left.y + " " + swap.right.x + "," + swap.right.y + " and there was no match!");
		}
	}

	private testForMatch(matchable: Matchable): boolean {
		var matchDetails = this.matchChecker.testForMatch(matchable);

		if (matchDetails) {
			this.performMatch(matchable, matchDetails.horizontal, matchDetails.vertical);
			return true;
		}
		
		return false;
	}

	private performMatch(matchable: Matchable, horizontal: boolean, vertical: boolean) {
		let matched = [matchable];

		if (horizontal) {
			this.matchChecker.scanLeft(matchable, (hit: Matchable) => { matched.push(hit); hit.isDisappearing = true });
			this.matchChecker.scanRight(matchable, (hit: Matchable) => { matched.push(hit); hit.isDisappearing = true });
		}
		if (vertical) {
			this.matchChecker.scanUp(matchable, (hit: Matchable) => { matched.push(hit); hit.isDisappearing = true });
			this.matchChecker.scanDown(matchable, (hit: Matchable) => { matched.push(hit); hit.isDisappearing = true });
		}

		matchable.isDisappearing = true;
		
		this.matchPerformed.trigger(new Match(MatchType.Normal, matched));
	}
}

export = MatchPerformer;