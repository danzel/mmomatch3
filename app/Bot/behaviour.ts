import BotHelper = require('./botHelper');
import InputApplier = require('../Simulation/inputApplier');
import MagicNumbers = require('../Simulation/magicNumbers');
import Matchable = require('../Simulation/matchable');
import Move = require('./move');
import Simulation = require('../Simulation/simulation');

abstract class Behaviour {
	lastPos = { x: 0, y: 0 };

	constructor(protected helper: BotHelper, protected simulation: Simulation, protected inputApplier: InputApplier) {

	}

	abstract update(dt: number): void;

	performMoveIfValid(move: Move) {
		let left = this.simulation.grid.findMatchableAtPosition(move.x, move.y);
		let right = this.simulation.grid.findMatchableAtPosition(move.x + move.direction.x, move.y + move.direction.y * MagicNumbers.matchableYScale);

		if (this.helper.inputVerifier.swapIsValid(left, right)) {
			this.performMoveActual(move, left, right);
		}
	}

	performMove(move: Move): void {
		let left = this.simulation.grid.findMatchableAtPosition(move.x, move.y);
		let right = this.simulation.grid.findMatchableAtPosition(move.x + move.direction.x, move.y + move.direction.y * MagicNumbers.matchableYScale);

		this.performMoveActual(move, left, right);
	}

	private performMoveActual(move: Move, left: Matchable, right: Matchable) {
		this.inputApplier.swapMatchable(left, right, move.direction)

		this.lastPos.x = move.x;
		this.lastPos.y = move.y;
	}
}

export = Behaviour;