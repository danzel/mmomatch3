import Grid = require('./grid');
import LiteEvent = require('../liteEvent');
import MagicNumbers = require('./magicNumbers');
import Matchable = require('./matchable');

class Physics {
	/** Used by updateMovement */
	private landed = new Array<Matchable>();
	private boundSubUpdateMovement: (matchable: Matchable, maxY: number, above: Matchable) => void;
	
	matchableLanded = new LiteEvent<Matchable>();

	constructor(private grid: Grid) {
		this.boundSubUpdateMovement = this.subUpdateMovement.bind(this);
	}

	updateMovement() {
		this.landed.length = 0;
		this.update(this.boundSubUpdateMovement);
		
		for (let i = 0; i < this.landed.length; i++) {
			this.matchableLanded.trigger(this.landed[i]);
		}
	}

	private subUpdateMovement(matchable: Matchable, maxY: number, above: Matchable) {
		matchable.y = Math.max(maxY, matchable.y - matchable.yMomentum);
		
		//Stop when we hit the one below us and follow its speed
		if (above) {
			if (matchable.y < above.y + MagicNumbers.matchableYScale) {
				matchable.y = above.y + MagicNumbers.matchableYScale;
				matchable.yMomentum = above.yMomentum;
			}
		}

		if (matchable.y == maxY) {
			matchable.yMomentum = 0;
			this.landed.push(matchable);
		}
	}

	updateMomentum() {
		this.update(this.subUpdateMomentum);
	}

	private subUpdateMomentum(matchable: Matchable, maxY: number, above: Matchable) {
		matchable.yMomentum += 16;
	}
	
	private update(callback: (matchable: Matchable, maxY: number, above: Matchable) => void) {
		for (let x = 0; x < this.grid.width; x++) {
			var col = this.grid.cells[x];
			let holesBelow = 0;
			for (let y = 0; y < col.length; y++) {
				while (this.grid.isHole(x, (y + holesBelow) * MagicNumbers.matchableYScale)) {
					holesBelow++;
				}

				let maxY = (y + holesBelow) * MagicNumbers.matchableYScale;
				let matchable = col[y];
				
				if (matchable.y > maxY && !matchable.beingSwapped && !matchable.isDisappearing) {
					callback(matchable, maxY, y > 0 ? col[y - 1] : null);
				}
			}
		}
	}
}

export = Physics;