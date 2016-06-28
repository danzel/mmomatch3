import Detector = require('../detector');
import GameEndType = require('../gameEndType');
import Simulation = require('../../simulation');

class GrowOverGridDetector extends Detector {
	constructor(simulation: Simulation, percentage: number) {
		super(GameEndType.LevelVictory);
	}
	update() {
		//TODO
	}

	getDetailsText(): string {
		return "todo"; //TODO
	}
}
export = GrowOverGridDetector;