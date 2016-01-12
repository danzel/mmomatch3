import Matchable = require('../matchable');
import MatchPerformer = require('../matchPerformer');
import Swap = require('../swap');
import SwapHandler = require('../swapHandler');

/**
 * Tracks whenever a player interacts with the grid
 * and remembers that any combos as a result of that interaction should give them points
 */
class ComboOwnership {
	constructor(private swapHandler: SwapHandler, private matchPerformer: MatchPerformer) {
		
		//TODO: Need to know when a swap happens and who caused it.
		//TODO: Need to clear ownership after a swap?
		swapHandler.swapStarted.on(this.swapStarted.bind(this));
		
		//TODO: Need to know when a match happens to push ownership to those that fall down because of it
		matchPerformer.matchPerformed.on(this.matchPerformed.bind(this));
		
	}
	
	private swapStarted(swap: Swap) {
		//When a swap happens this gives ownership until the swap finishes and the resulting match happens (if any match)
	}
	
	private matchPerformed(match: Array<Matchable>) {
		//TODO: Cascade or forget or something.. This is before they start disappearing
		
		//When a match happens, the player gets ownership in that column from that height until the column is quiet again
	}
}

export = ComboOwnership;