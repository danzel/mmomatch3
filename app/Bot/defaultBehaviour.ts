import Behaviour = require('./behaviour');
import BotHelper = require('./botHelper');
import InputApplier = require('../Simulation/inputApplier');
import Simulation = require('../Simulation/simulation');

class DefaultBehaviour extends Behaviour {
	config = {
		range: 10,
		secondsBetweenMoves: 3
	}
	
	secondsToNextMove: number;
	
	constructor(helper: BotHelper, simulation: Simulation, inputApplier: InputApplier) {
		super(helper, simulation, inputApplier);

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



		let moves = this.helper.findAllMovesInRange(this.lastPos.x, this.lastPos.y, this.config.range);

		if (moves.length > 0) {
			let m = moves[Math.floor(Math.random() * moves.length)];
			this.performMove(m);
		} else {
			this.lastPos.x = Math.floor(Math.random() * this.simulation.grid.width);
			this.lastPos.y = Math.floor(Math.random() * this.simulation.grid.height);
		}
	}
}

export = DefaultBehaviour;