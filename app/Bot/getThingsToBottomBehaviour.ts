import BotHelper = require('./botHelper');
import DefaultBehaviour = require('./defaultBehaviour');
import InputApplier = require('../Simulation/inputApplier');
import Simulation = require('../Simulation/simulation');
import Type = require('../Simulation/type');

class GetThingsToBottomBehaviour extends DefaultBehaviour {
	private moveCount = 0;
	
	
	constructor(helper: BotHelper, simulation: Simulation, inputApplier: InputApplier) {
		super(helper, simulation, inputApplier);

		this.config.delays = [
			{ seconds: 1, range: 2, variation: 0.2 },
			{ seconds: 1, range: 3, variation: 0.2 }
		];
	}

	tryDoMove(): void {
		
		//Periodically look under robots againm otherwise we'll start matching above them
		this.moveCount++;
		if (this.moveCount == 5) {
			this.moveCount = 0;
			this.chooseStartingLocation();
		}
		
		super.tryDoMove();
	}
	chooseStartingLocation(): void {
		//Find a position under a robot

		let positions = new Array<{ x: number, y: number }>();

		for (var x = 0; x < this.simulation.grid.width; x++) {
			let col = this.simulation.grid.cells[x];
			for (var y = 1; y < col.length; y++) {
				if (col[y].type == Type.GetToBottom) {
					positions.push({ x, y });
				}
			}
		}

		if (positions.length == 0) {
			super.chooseStartingLocation();
			return;
		}

		let i = Math.floor(Math.random() * positions.length);
		let pos = positions[i];

		this.lastPos.x = pos.x;
		this.lastPos.y = Math.floor(Math.random() * pos.y);
	}
}

export = GetThingsToBottomBehaviour;