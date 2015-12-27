import Grid = require('./grid')
import Matchable = require('./matchable')
import LiteEvent = require('../liteEvent')

class SpawnManager {
	matchableSpawned = new LiteEvent<Matchable>()
	
	constructor(private grid: Grid) {
	}
	
	update(dt: number){
		for (var x = 0; x < this.grid.width; x++){
			var column = this.grid.cells[x];
			
			while (column.length < this.grid.height){
				//Hack 0 to make them spawn on grid, should be what is commented out
				let y = 0;//this.grid.height;
				
				if (column.length > 0) {
					let last = column[column.length - 1];
					if (last.y >= y) {
						y = last.y + 1;
					}
				}
				
				var matchable = new Matchable(x, y);
			
				column.push(matchable);
				this.matchableSpawned.trigger(matchable);
			}
		}
	}
}

export = SpawnManager;