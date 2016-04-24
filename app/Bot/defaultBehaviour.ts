import Behaviour = require('./behaviour');
import BotHelper = require('./botHelper');
import InputApplier = require('../Simulation/inputApplier');
import Simulation = require('../Simulation/simulation');

class DefaultBehaviour extends Behaviour {
	config = {
		delays: [
			{ seconds: 1, range: 2, variation: 0.2 },
			{ seconds: 2, range: 4, variation: 0.2 },
			{ seconds: 3, range: 10, variation: 0.3 }
		],

		startingDelay: 4,
		startingVariation: 1,

		noMoveDelay: 5
	}
	
	secondsToNextMove: number;
	setIndex = 0;
	
	constructor(helper: BotHelper, simulation: Simulation, inputApplier: InputApplier) {
		super(helper, simulation, inputApplier);

		this.chooseStartingLocation();
		this.secondsToNextMove = this.calculateVariedTime(this.config.startingDelay, this.config.startingVariation);
	}
	
	protected calculateVariedTime(amount: number, variation: number): number {
		return (amount * (1 - variation)) + (Math.random() * amount * variation * 2);
	}
	
	update(dt: number) {
		this.secondsToNextMove -= dt;
		if (this.secondsToNextMove > 0) {
			return;
		}
		
		let set = this.config.delays[this.setIndex];

		let moves = this.helper.findAllMovesInRange(this.lastPos.x, this.lastPos.y, set.range);

		if (moves.length > 0) {
			let m = moves[Math.floor(Math.random() * moves.length)];
			this.performMove(m);
			
			this.setIndex = 0;
			this.secondsToNextMove = this.calculateVariedTime(this.config.delays[0].seconds, this.config.delays[0].variation);
		} else {
			this.setIndex++;
			
			if (this.setIndex == this.config.delays.length) {
				//Failed to make a move, reset
				this.chooseStartingLocation();
				this.setIndex = 0;
				this.secondsToNextMove = this.config.noMoveDelay;
			} else {
				this.secondsToNextMove = this.calculateVariedTime(this.config.delays[this.setIndex].seconds, this.config.delays[this.setIndex].variation);
			}
		}
	}
	
	protected chooseStartingLocation(): void {
		this.lastPos.x = Math.floor(Math.random() * this.simulation.grid.width);
		this.lastPos.y = Math.floor(Math.random() * this.simulation.grid.height);
	}
}

export = DefaultBehaviour;