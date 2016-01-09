import Grid = require('./grid');
import Matchable = require('./matchable');
import MatchChecker = require('./matchChecker');
import Physics = require('./physics');
import Swap = require('./swap');
import SwapHandler = require('./swapHandler');

class MatchPerformer {
	matchChecker: MatchChecker;
	
	constructor(matchChecker: MatchChecker, swapHandler: SwapHandler, physics: Physics) {
		this.matchChecker = matchChecker;

		swapHandler.swapOccurred.on(this.onSwapOccurred.bind(this));
		physics.matchableLanded.on(this.testForMatch.bind(this));
	}

	onSwapOccurred(swap: Swap) {
		this.testForMatch(swap.left);

		if (!swap.right.isDisappearing)
			this.testForMatch(swap.right);
	}

	private testForMatch(matchable: Matchable) {
		
		var matchDetails = this.matchChecker.testForMatch(matchable);
		
		if (matchDetails) {
			this.performMatch(matchable, matchDetails.horizontal, matchDetails.vertical);
		}
	}
	
	private performMatch(matchable: Matchable, horizontal: boolean, vertical: boolean) {

		if (horizontal) {
			this.matchChecker.scanLeft(matchable, (hit: Matchable) => hit.isDisappearing = true);
			this.matchChecker.scanRight(matchable, (hit: Matchable) => hit.isDisappearing = true);
		}
		if (vertical) {
			this.matchChecker.scanUp(matchable, (hit: Matchable) => hit.isDisappearing = true);
			this.matchChecker.scanDown(matchable, (hit: Matchable) => hit.isDisappearing = true);
		}

		matchable.isDisappearing = true;
	}
}

export = MatchPerformer;