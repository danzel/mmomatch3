import Matchable = require('./matchable');

interface XY {
	x: number;
	y: number;
}

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

	findMatchableById(id: number) : Matchable {
		for (let x = 0; x < this.width; x++) {
			let col = this.cells[x];
			for (let y = 0; y < col.length; y++) {
				if (col[y].id == id) {
					return col[y];
				}
			}
		}
		
		return null;
	}
	
	findMatchableAtPosition(positionX: number, positionY: number) {
		let col = this.cells[positionX];
		for (let i = Math.min(positionY, col.length - 1); i >= 0 && col[i].y >= positionY; i--) {
			if (col[i].y == positionY) {
				return col[i];
			}
		}
	}
	
}

export = Grid;