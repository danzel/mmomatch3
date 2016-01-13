import LiteEvent = require('../liteEvent');
import Matchable = require('./matchable');
import Physics = require('./physics');

interface IGridHeight {
	height: number;
}

class QuietColumnDetector {
	gridHeight: number;

	quietColumns: Array<Matchable> = [];
	
	columnBecameQuiet = new LiteEvent<number>();
	
	constructor(gridHeight: IGridHeight, physics: Physics) {
		this.gridHeight = gridHeight.height;
		
		physics.matchableLanded.on(this.matchableLanded.bind(this));
	}
	
	matchableLanded(matchable: Matchable) {
		if (matchable.y == this.gridHeight - 1) {
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