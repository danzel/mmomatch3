import Grid = require('./grid');
import LiteEvent = require('../liteEvent');
import Matchable = require('./matchable');

class Physics {
	/** Used by updateMovement */
	private landed = new Array<Matchable>();
	private boundSubUpdateMovement: (matchable: Matchable, dt: number, maxY: number, above: Matchable) => void;
	
	matchableLanded = new LiteEvent<Matchable>();

	constructor(private grid: Grid) {
		this.boundSubUpdateMovement = this.subUpdateMovement.bind(this);
	}

	updateMovement(dt: number) {
		this.landed.length = 0;
		this.update(dt, this.boundSubUpdateMovement);
		
		for (let i = 0; i < this.landed.length; i++) {
			this.matchableLanded.trigger(this.landed[i]);
		}
	}

	private subUpdateMovement(matchable: Matchable, dt: number, maxY: number, above: Matchable) {
		matchable.y = Math.max(maxY, matchable.y - dt * matchable.yMomentum);
		
		//Stop when we hit the one below us and follow its speed
		if (above) {
			if (matchable.y < above.y + 1) {
				matchable.y = above.y + 1;
				matchable.yMomentum = above.yMomentum;
			}
		}

		if (matchable.y == maxY) {
			matchable.yMomentum = 0;
			this.landed.push(matchable);
		}
	}

	updateMomentum(dt: number) {
		this.update(dt, this.subUpdateMomentum);
	}

	private subUpdateMomentum(matchable: Matchable, dt: number, maxY: number, above: Matchable) {
		matchable.yMomentum += dt * 100;
	}
	
	private update(dt: number, callback: (matchable: Matchable, dt: number, maxY: number, above: Matchable) => void) {
		for (let x = 0; x < this.grid.width; x++) {
			var col = this.grid.cells[x];
			let holesBelow = 0;
			for (let y = 0; y < col.length; y++) {
				while (this.grid.isHole(x, y + holesBelow)) {
					holesBelow++;
				}

				let maxY = y + holesBelow;
				let matchable = col[y];
				
				if (matchable.y > maxY && !matchable.beingSwapped && !matchable.isDisappearing) {
					callback(matchable, dt, maxY, y > 0 ? col[y - 1] : null);
				}
			}
		}
	}
}

export = Physics;