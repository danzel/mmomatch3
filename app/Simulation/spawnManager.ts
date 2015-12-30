import Grid = require('./grid')
import Matchable = require('./matchable')
import LiteEvent = require('../liteEvent')

class SpawnManager {
	matchableSpawned = new LiteEvent<Matchable>()
	
	constructor(private grid: Grid) {
	}
	
	update(dt: number){
		for (let x = 0; x < this.grid.width; x++){
			let column = this.grid.cells[x];
			
			while (column.length < this.grid.height){
				let y = this.grid.height;
				
				if (column.length > 0) {
					let last = column[column.length - 1];
					if (last.y >= y) {
						y = last.y + 1;
					}
				}
				
				let matchable = new Matchable(x, y);
			
				column.push(matchable);
				this.matchableSpawned.trigger(matchable);
			}
		}
	}
}

export = SpawnManager;