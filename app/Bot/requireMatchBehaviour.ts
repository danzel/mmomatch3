import BotHelper = require('./botHelper');
import DefaultBehaviour = require('./defaultBehaviour');
import InputApplier = require('../Simulation/inputApplier');
import Simulation = require('../Simulation/simulation');

class RequireMatchBehaviour extends DefaultBehaviour {

	constructor(helper: BotHelper, simulation: Simulation, inputApplier: InputApplier) {
		super(helper, simulation, inputApplier);

		this.config.delays = [
			{ seconds: 1, range: 2, variation: 0.2 },
			{ seconds: 1, range: 3, variation: 0.2 }
		];
	}

	tryDoMove(): void {
		//Only try do a move if we are near a requireMatch
		let range = 3;
		let minX = this.lastPos.x - range;
		let maxX = this.lastPos.x + range;
		
		let minY = this.lastPos.y - range;
		let maxY = this.lastPos.y + range;

		let positions = this.simulation.requireMatchInCellTracker.requirements;
		for (var i = 0; i < positions.length; i++) {
			let p = positions[i];
			
			if (p.x >= minX && p.x < maxX && p.y >= minY && p.y < maxY) {
				super.tryDoMove();
				return;
			}
		}
		
		//Otherwise, find another one
		this.chooseStartingLocation();
	}

	chooseStartingLocation(): void {
		//Find a require
		let positions = this.simulation.requireMatchInCellTracker.requirements;

		if (positions.length == 0) {
			super.chooseStartingLocation();
			return;
		}

		let i = Math.floor(Math.random() * positions.length);
		let pos = positions[i];

		this.lastPos.x = pos.x;
		this.lastPos.y = pos.y + 1;
	}
}

export = RequireMatchBehaviour;