import Grid = require('../Simulation/grid');
import InputVerifier = require('../Simulation/inputVerifier');
import Move = require('./move');

class BotHelper {
	/** We always swap down or right, this influences the search loop below to avoid the bottom and right edges. This means we'll never swap with the very bottom right, lol oh well */
	private directions = [
		{ x: 1, y: 0 },
		{ x: 0, y: 1 },
	];

	constructor(private grid: Grid, private inputVerifier: InputVerifier) {
	}

	findAllMovesInRange(startX: number, startY: number, rangeX: number, rangeY: number): Array<Move> {
		let moves = new Array<Move>();

		for (let y = Math.max(startY - rangeY, 0); y <= Math.min(startY + rangeY, this.grid.height - 2); y++) {
			for (let x = Math.max(startX - rangeX, 0); x <= Math.min(startX + rangeX, this.grid.width - 2); x++) {
				for (var i = 0; i < this.directions.length; i++) {
					let d = this.directions[i];
					let left = this.grid.findMatchableAtPosition(x, y);
					let right = this.grid.findMatchableAtPosition(x + d.x, y + d.y);

					if (left && right) {
						if (this.inputVerifier.swapIsValid(left, right)) {
							moves.push({ x: x, y: y, direction: d });
						}
					}
				}
			}
		}
		
		return moves;
	}
}

export = BotHelper;