import Detector = require('../detector');
import GameEndType = require('../gameEndType');
import Matchable = require('../../matchable');
import Simulation = require('../../simulation');
import Type = require('../../type');

class GrowOverGridDetector extends Detector {
	growAmount: number;

	constructor(private simulation: Simulation, private amountRequired: number) {
		super(GameEndType.LevelVictory);
		this.matchableSpawned = this.matchableSpawned.bind(this);

		simulation.spawnManager.matchableSpawned.on(this.matchableSpawned);

		simulation.disappearer.matchableTransformed.on(m => {
			if (m.type == Type.GrowOverGrid) {
				this.increment();
			}
		})
	}

	update() {
		this.growAmount = 0;
		this.simulation.grid.cells.forEach(col => col.forEach(m => {
			if (m.type == Type.GrowOverGrid) {
				this.increment();
			}
		}));
	}

	matchableSpawned(matchable: Matchable): void {
		if (matchable.type == Type.GrowOverGrid) {
			this.increment();
			//Only one is spawned, so don't listen for more
			this.simulation.spawnManager.matchableSpawned.off(this.matchableSpawned);
		}
	}

	increment() {
		this.growAmount++;
		this.valueChanged.trigger();

		if (this.growAmount == this.amountRequired) {
			this.detected.trigger();
		}
	}

	getDetailsText(): string {
		return "todo"; //TODO
	}
}
export = GrowOverGridDetector;