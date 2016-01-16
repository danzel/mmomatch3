import Grid = require('./grid');
import LiteEvent = require('../liteEvent');
import Matchable = require('./matchable');
import Physics = require('./physics');

class QuietColumnDetector {
	quietColumns: Array<Matchable> = [];
	
	columnBecameQuiet = new LiteEvent<number>();
	
	constructor(private grid: Grid, physics: Physics) {
		physics.matchableLanded.on(this.matchableLanded.bind(this));
	}
	
	matchableLanded(matchable: Matchable) {
		//If we land and we are in our correct place and there is nothing above us
		let col = this.grid.cells[matchable.x];
		if (matchable.y == col.indexOf(matchable) && matchable.y == col.length - 1) {
			this.quietColumns.push(matchable);
		}
	}
	
	lateUpdate(dt: number) {
		for (let i = 0; i < this.quietColumns.length; i++) {

			//If this matchable immediately gets matched then we shouldn't say its column is quiet
			let m = this.quietColumns[i];
			if (!m.isDisappearing) {
				this.columnBecameQuiet.trigger(this.quietColumns[i].x);
			}
		}
		this.quietColumns.length = 0;
	}
}

export = QuietColumnDetector;