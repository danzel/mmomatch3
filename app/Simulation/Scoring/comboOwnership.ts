import LiteEvent = require('../../liteEvent');
import Matchable = require('../matchable');
import MatchPerformer = require('../matchPerformer');
import OwnedMatch = require('./ownedMatch');
import Physics = require('../physics');
import QuietColumnDetector = require('../quietColumnDetector');
import Swap = require('../swap');
import SwapHandler = require('../swapHandler');

interface IGridWidth {
	width: number;
}

class Owner {
	y: number;
	playerId: number;

	constructor(y: number, playerId: number) {
		this.y = y;
		this.playerId = playerId;
	}
}

/**
 * Tracks whenever a player interacts with the grid
 * and remembers that any combos as a result of that interaction should give them points
 */
class ComboOwnership {
	private ownersByColumn: Array<Array<Owner>>;

	ownedMatchPerformed = new LiteEvent<OwnedMatch>();

	constructor(gridWidth: IGridWidth, swapHandler: SwapHandler, matchPerformer: MatchPerformer, quietColumnDetector: QuietColumnDetector) {
		
		//TODO: Need to know when a swap happens and who caused it.
		//TODO: Need to clear ownership after a swap?
		swapHandler.swapStarted.on(this.swapStarted.bind(this));
		swapHandler.swapOccurred.on(this.swapOccurred.bind(this));
		
		//TODO: Need to know when a match happens to push ownership to those that fall down because of it
		matchPerformer.matchPerformed.on(this.matchPerformed.bind(this));

		quietColumnDetector.columnBecameQuiet.on(this.columnBecameQuiet.bind(this));

		this.ownersByColumn = [];
		for (let i = 0; i < gridWidth.width; i++) {
			this.ownersByColumn.push([]);
		}
	}

	//When a swap happens this gives ownership until the swap finishes and the resulting match happens (if any match)
	private swapStarted(swap: Swap) {
		
		//Optimization: For a vertical swap we only need to add one
		//TODO: playerId
		this.ownersByColumn[swap.left.x].push(new Owner(swap.left.y, swap.playerId));
		this.ownersByColumn[swap.right.x].push(new Owner(swap.right.y, swap.playerId));
	}

	private swapOccurred(swap: Swap) {
		//TODO: This should happen in a late update
		//TODO: Forget about the swap? - We will when the become quiet, but they might not cause a match so that might not happen
	}

	//When a match happens, the player gets ownership in that column from that height until the column is quiet again
	private matchPerformed(matches: Array<Matchable>) {
		//Calculate owners
		var owners = {};
		for (let i = 0; i < matches.length; i++) {
			let match = matches[i];
			let ownersInCol = this.ownersByColumn[match.x];

			for (let j = 0; j < ownersInCol.length; j++) {
				let owner = ownersInCol[j];
				if (owner.y <= match.y && !owners[owner.playerId]) {
					owners[owner.playerId] = true;
				}
			}
		}
		
		//Re-record them in the owners list if needed
		//Optimization: Don't need to add multiple if they are in the same column
		//Optimization: Don't need to add again if there is already a better (stricter) match for this player in this column
		for (let i = 0; i < matches.length; i++) {
			var m = matches[i]
			let ownersInCol = this.ownersByColumn[m.x];
			for (let key in owners) {
				ownersInCol.push(new Owner(m.y, key));
			}
		}		


		//Fire a match with owners event
		var ownersArray: Array<number> = [];
		for (let key in owners) {
			ownersArray.push(parseInt(key, 10));
		}
		
		this.ownedMatchPerformed.trigger(new OwnedMatch(ownersArray, matches));
	}
	
	private columnBecameQuiet(x: number) {
		this.ownersByColumn[x].length = 0;
	}
}

export = ComboOwnership;