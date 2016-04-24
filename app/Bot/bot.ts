import BotConfig = require('./botConfig');
import InputApplier = require('../Simulation/inputApplier');
import Simulation = require('../simulation/Simulation');

class Move {
	constructor(public x: number, public y: number, public direction: { x: number, y: number }) {
	}
}

class Bot {
	private lastPos = { x: 0, y: 0 };

	private secondsToNextMove: number;

	/** We always swap down or right, this influences the search loop below to avoid the bottom and right edges. This means we'll never swap with the very bottom right, lol oh well */
	private directions = [
		{ x: 1, y: 0 },
		{ x: 0, y: 1 },
	]

	constructor(private simulation: Simulation, private inputApplier: InputApplier, private config: BotConfig) {
		this.lastPos.x = Math.floor(Math.random() * simulation.grid.width);
		this.lastPos.y = Math.floor(Math.random() * simulation.grid.height);

		this.secondsToNextMove = (Math.random() + 0.5) * this.config.secondsBetweenMoves;
	}

	update(dt: number) {
		this.secondsToNextMove -= dt;
		if (this.secondsToNextMove > 0) {
			return;
		}
		this.secondsToNextMove = (Math.random() + 0.5) * this.config.secondsBetweenMoves;

		//todo; make a move
		console.log('make a move');

		let moves = new Array<Move>();

		for (let y = Math.max(this.lastPos.y - this.config.moveRange, 0); y < Math.min(this.lastPos.y + this.config.moveRange, this.simulation.grid.height - 1); y++) {
			for (let x = Math.max(this.lastPos.x - this.config.moveRange, 0); x < Math.min(this.lastPos.x + this.config.moveRange, this.simulation.grid.width - 1); x++) {
				for (var i = 0; i < this.directions.length; i++) {
					let d = this.directions[i];
					let left = this.simulation.grid.findMatchableAtPosition(x, y);
					let right = this.simulation.grid.findMatchableAtPosition(x + d.x, y + d.y);

					if (left && right) {
						if (this.simulation.inputVerifier.swapIsValid(left, right)) {
							moves.push({ x: x, y: y, direction: d });
						}
					}
				}
			}
		}
		
		if (moves.length > 0) {
			let m = moves[Math.floor(Math.random() * moves.length)];
			this.inputApplier.swapMatchable(this.simulation.grid.findMatchableAtPosition(m.x, m.y), this.simulation.grid.findMatchableAtPosition(m.x + m.direction.x, m.y + m.direction.y), m.direction)
			this.lastPos.x = m.x;
			this.lastPos.y = m.y;
		} else {
			this.lastPos.x = Math.floor(Math.random() * this.simulation.grid.width);
			this.lastPos.y = Math.floor(Math.random() * this.simulation.grid.height);
		}
	}
}

export = Bot;