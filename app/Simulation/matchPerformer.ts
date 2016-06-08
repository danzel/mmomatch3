import Grid = require('./grid');
import LiteEvent = require('../liteEvent');
import Match = require('./match');
import Matchable = require('./matchable');
import MatchChecker = require('./matchChecker');
import MatchType = require('./matchType');
import Physics = require('./physics');
import SpecialMatchPerformer = require('./specialMatchPerformer');
import Swap = require('./swap');
import SwapHandler = require('./swapHandler');
import Type = require('./type');

class MatchPerformer {
	private matchChecker: MatchChecker;

	/** Fired whenever a matchable starts disappearing */
	matchPerformed = new LiteEvent<Match>();
	swapDidntCauseAMatch = new LiteEvent<Swap>();

	totalMatchablesMatched = 0;
	
	constructor(matchChecker: MatchChecker, swapHandler: SwapHandler, physics: Physics, private specialMatchPerformer: SpecialMatchPerformer) {
		this.matchChecker = matchChecker;

		swapHandler.swapOccurred.on(this.onSwapOccurred.bind(this));
		physics.matchableLanded.on(this.testForMatch.bind(this));
	}

	private onSwapOccurred(swap: Swap) {

		let specialMatch = this.specialMatchPerformer.tryPerformSwapMatch(swap);
		if (specialMatch) {
			this.triggerMatch(specialMatch);
			return;
		}

		let didSwap = this.testForMatch(swap.left);

		if (!swap.right.isDisappearing) {
			didSwap = this.testForMatch(swap.right) || didSwap;
		}
		
		//TODO: Only if swaps making a match is required
		if (!didSwap) {
			this.swapDidntCauseAMatch.trigger(swap);
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

		let matchType: MatchType;
		if (horizontal) {
			matchType = MatchType.NormalHorizontal;
			this.matchChecker.scanLeft(matchable, (hit: Matchable) => { matched.push(hit); hit.isDisappearing = true });
			this.matchChecker.scanRight(matchable, (hit: Matchable) => { matched.push(hit); hit.isDisappearing = true });
		}
		if (vertical) {
			matchType = MatchType.NormalVertical;
			this.matchChecker.scanUp(matchable, (hit: Matchable) => { matched.push(hit); hit.isDisappearing = true });
			this.matchChecker.scanDown(matchable, (hit: Matchable) => { matched.push(hit); hit.isDisappearing = true });
		}

		if (horizontal && vertical) {
			matchType = MatchType.NormalCross;
		}
		if (matched.length == 1 && matchable.type == Type.GetToBottom) {
			matchType = MatchType.GetToBottom;
		}

		matchable.isDisappearing = true;

		let match = new Match(matchType, matched);
		this.triggerMatch(match);
	}

	private triggerMatch(match: Match) {
		this.specialMatchPerformer.applyToMatch(match);
		this.totalMatchablesMatched += match.matchables.length;
		this.matchPerformed.trigger(match);
	}
}

export = MatchPerformer;