import BotLimitations = require('./botLimitations');
import Grid = require('../Simulation/grid');
import InputVerifier = require('../Simulation/inputVerifier');
import MagicNumbers = require('../Simulation/magicNumbers');
import Move = require('./move');

class BotHelper {
	/** We always swap down or right, this influences the search loop below to avoid the bottom and right edges. This means we'll never swap with the very bottom right, lol oh well */
	private directions = [
		{ x: 1, y: 0 },
		{ x: 0, y: 1 },
	];

	constructor(private grid: Grid, public inputVerifier: InputVerifier, private limitations: BotLimitations) {
	}

	findAllMovesInRange(startX: number, startY: number, rangeX: number, rangeY: number): Array<Move> {
		let moves = new Array<Move>();

		rangeY *= MagicNumbers.matchableYScale;

		for (let y = this.limitations.yMin; y <= this.limitations.yMax * MagicNumbers.matchableYScale; y += MagicNumbers.matchableYScale) {
			for (let x = this.limitations.xMin; x <= this.limitations.xMax; x++) {
				for (var i = 0; i < this.directions.length; i++) {
					let d = this.directions[i];
					let left = this.grid.findMatchableAtPosition(x, y);
					let right = this.grid.findMatchableAtPosition(x + d.x, y + d.y * MagicNumbers.matchableYScale);

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