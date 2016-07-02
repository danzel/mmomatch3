import LiteEvent = require('../../liteEvent');
import Match = require('../match');
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
	private ownerMatchCount: { [playerId: number]: number } = {};

	ownedMatchPerformed = new LiteEvent<OwnedMatch>();
	playerNoLongerInCombo = new LiteEvent<number>();

	constructor(gridWidth: IGridWidth, swapHandler: SwapHandler, matchPerformer: MatchPerformer, quietColumnDetector: QuietColumnDetector) {
		
		swapHandler.swapStarted.on((swap) => this.swapStarted(swap));
		
		matchPerformer.matchPerformed.on(match => this.matchPerformed(match));

		quietColumnDetector.columnBecameQuiet.on(column => this.columnBecameQuiet(column));

		this.ownersByColumn = [];
		for (let i = 0; i < gridWidth.width; i++) {
			this.ownersByColumn.push([]);
		}
	}
	
	/** For tests */
	isPlayerInCombo(playerId: number): boolean {
		return this.ownerMatchCount[playerId] != 0;
	}

	//When a swap happens this gives ownership until the swap finishes and the resulting match happens (if any match)
	private swapStarted(swap: Swap) {
		
		//Optimisation: For a vertical swap we only need to add one
		this.ownersByColumn[swap.left.x].push(new Owner(swap.left.y, swap.playerId));
		this.ownersByColumn[swap.right.x].push(new Owner(swap.right.y, swap.playerId));

		this.ownerMatchCount[swap.playerId] = (this.ownerMatchCount[swap.playerId] || 0) + 2;
	}

	//When a match happens, the player gets ownership in that column from that height until the column is quiet again
	private matchPerformed(match: Match) {
		let matches = match.matchables;
		
		//Calculate owners
		let owners: { [playerId: number]: boolean } = {};
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
		//Optimisation: Don't need to add multiple if they are in the same column
		//Optimisation: Don't need to add again if there is already a better (stricter) match for this player in this column
		for (let i = 0; i < matches.length; i++) {
			let m = matches[i]
			let ownersInCol = this.ownersByColumn[m.x];
			for (let key in owners) {
				ownersInCol.push(new Owner(m.y, parseInt(key, 10)));
				this.ownerMatchCount[key]++;
			}
		}		


		//Fire a match with owners event
		let ownersArray: Array<number> = [];
		for (let key in owners) {
			ownersArray.push(parseInt(key, 10));
		}

		this.ownedMatchPerformed.trigger(new OwnedMatch(ownersArray, match));
	}

	private columnBecameQuiet(x: number) {
		let col = this.ownersByColumn[x];
		for (var i = 0; i < col.length; i++) {
			var owner = col[i];
			this.ownerMatchCount[owner.playerId]--;
			if (this.ownerMatchCount[owner.playerId] == 0) {
				this.playerNoLongerInCombo.trigger(owner.playerId);
			}
		}
		col.length = 0;
	}
	
	/** Only for packetGenerator */
	getComboOwners(): Array<Array<Owner>> {
		return this.ownersByColumn;
	}
	/** Only for packetGenerator */
	addComboOwner(x: number, y: number, playerId: number) {
		this.ownersByColumn[x].push(new Owner(y, playerId));

		this.ownerMatchCount[playerId] = (this.ownerMatchCount[playerId] || 0) + 1;
	}
}

export = ComboOwnership;