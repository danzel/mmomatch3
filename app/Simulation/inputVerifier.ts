import Simulation = require('./simulation');

class InputVerifier {
	private simulation: Simulation;
	
	constructor(simulation: Simulation) {
		this.simulation = simulation;
	}
	
	swapIsValid(x: number, y: number, xTarget: number, yTarget: number) : boolean {
		if (!this.posIsValid(x, y))
			return false;
		if (!this.posIsValid(xTarget, yTarget))
			return false;
		
		if (x == xTarget) { //y swap
			if (yTarget == y + 1 || yTarget == y - 1)
				return true;
		}
		else if (y == yTarget) { //x swap
			if (xTarget == x + 1 || xTarget == x - 1)
				return true;
		}
		return false;
	}
	
	private posIsValid(x: number, y: number) : boolean {
		if (!this.isInt(x) || !this.isInt(y))
			return false;
		
		//Check we are on the grid
		if (x < 0 || y < 0 || x >= this.simulation.grid.width || y >= this.simulation.grid.height)
			return false;
		
		//And that this pos exists and isn't moving
		var col = this.simulation.grid.cells[x];
		if (col.length < y)
			return false;
		if (col[y].isMoving)
			return false;
		
		return true;
	}
	
	private isInt(n: number) : boolean {
		return n === +n && n === (n|0)
	}
}

export = InputVerifier;