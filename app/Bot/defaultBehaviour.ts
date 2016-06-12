import Behaviour = require('./behaviour');
import BotHelper = require('./botHelper');
import InputApplier = require('../Simulation/inputApplier');
import MagicNumbers = require('../Simulation/magicNumbers');
import Simulation = require('../Simulation/simulation');

class DefaultBehaviour extends Behaviour {
	config = {
		delays: [
			{ seconds: 1, range: 2, variation: 0.2 },
			{ seconds: 2, range: 4, variation: 0.2 },
			{ seconds: 3, range: 10, variation: 0.3 }
		],

		startingDelay: 4,
		startingVariation: 0.8,

		noMoveDelay: 5,

		moveFailsToForceMove: 2
	}

	secondsToNextMove: number;
	setIndex = 0;
	setsFailedToMoveCount = 0;

	constructor(helper: BotHelper, simulation: Simulation, inputApplier: InputApplier) {
		super(helper, simulation, inputApplier);

		this.chooseStartingLocation();
		this.secondsToNextMove = this.calculateVariedTime(this.config.startingDelay, this.config.startingVariation);
	}

	/** (amount - variation) to (amount + variation) */
	protected calculateVariedTime(amount: number, variation: number): number {
		return (amount * (1 - variation)) + (Math.random() * amount * variation * 2);
	}

	update(dt: number): void {
		this.secondsToNextMove -= dt;
		if (this.secondsToNextMove > 0) {
			return;
		}

		this.tryDoMove();
	}

	tryDoMove(): void {
		let set = this.config.delays[this.setIndex];

		let moves = this.helper.findAllMovesInRange(this.lastPos.x, this.lastPos.y, set.range, set.range);

		if (moves.length > 0) {
			let m = moves[Math.floor(Math.random() * moves.length)];
			this.performMove(m);

			this.setIndex = 0;
			this.setsFailedToMoveCount = 0;
			this.secondsToNextMove = this.calculateVariedTime(this.config.delays[0].seconds, this.config.delays[0].variation);
		} else {
			this.setIndex++;

			if (this.setIndex == this.config.delays.length) {
				//Failed to make a move, reset
				this.chooseStartingLocation();
				this.setIndex = 0;
				this.secondsToNextMove = this.config.noMoveDelay;

				this.setsFailedToMoveCount++;
				if (this.setsFailedToMoveCount == this.config.moveFailsToForceMove) {
					this.forceMove();
					this.setsFailedToMoveCount = 0;
				}
			} else {
				this.secondsToNextMove = this.calculateVariedTime(this.config.delays[this.setIndex].seconds, this.config.delays[this.setIndex].variation);
			}
		}
	}

	forceMove(): void {
		let moves = this.helper.findAllMovesInRange(0, 0, this.simulation.grid.width, this.simulation.grid.height);

		if (moves.length > 0) {
			let m = moves[Math.floor(Math.random() * moves.length)];
			this.performMove(m);
			return;
		}
		console.warn("bot failed to forceMove")
	}

	protected chooseStartingLocation(): void {
		this.lastPos.x = Math.floor(Math.random() * this.simulation.grid.width);
		this.lastPos.y = Math.floor(Math.random() * this.simulation.grid.height) * MagicNumbers.matchableYScale;
	}
}

export = DefaultBehaviour;