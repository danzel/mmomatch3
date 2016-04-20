import Detector = require('../detector');
import Matchable = require('../../matchable');
import Simulation = require('../../simulation');
import Type = require('../../type');

class GetThingToBottomDetector extends Detector {
	
	hasTriggered = false;
	
	constructor(private simulation: Simulation) {
		super();

		simulation.physics.matchableLanded.on(matchable => this.matchableLanded(matchable));
	}
	
	matchableLanded(matchable: Matchable) {
		if (matchable.type == Type.GetToBottom && matchable.y == 0) {
			this.hasTriggered = true;
			this.valueChanged.trigger();
			this.detected.trigger();
		}
	}

	update() {
		for (let x = 0; x < this.simulation.grid.width; x++) {
			let col = this.simulation.grid.cells[x];
			let m = col[0];
			if (m && m.yMomentum == 0) {
				this.matchableLanded(m);
			}
		}
	}

	getDetailsText(): string {
		return "Get the Robot to the bottom";
	}
}

export = GetThingToBottomDetector;