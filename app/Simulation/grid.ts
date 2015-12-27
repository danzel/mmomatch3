import Matchable = require('./matchable');

class Grid {
	
	width: number
	height: number
	cells: Array<Array<Matchable>>
	 
	constructor(width: number, height: number) {
		this.width = width;
		this.height = height;
		this.cells = new Array<Array<Matchable>>(width);

		for (var i = 0; i < width; i++){
			this.cells[i] = new Array<Matchable>(0);
		}
	}
}

export = Grid;