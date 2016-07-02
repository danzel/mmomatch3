import Detector = require('../detector');
import GameEndType = require('../gameEndType');
import Language = require('../../../Language');
import Simulation = require('../../simulation');
import Type = require('../../type');

class GrowOverGridDetector extends Detector {
	grownAmount: number;

	constructor(private simulation: Simulation, public totalAmountRequired: number) {
		super(GameEndType.LevelVictory);

		simulation.spawnManager.matchableSpawned.on(m => {
			if (m.type == Type.GrowOverGrid) {
				this.increment();
			}
		});

		simulation.disappearer.matchableTransformed.on(m => {
			if (m.type == Type.GrowOverGrid) {
				this.increment();
			}
		})
	}

	update() {
		this.grownAmount = 0;
		this.simulation.grid.cells.forEach(col => col.forEach(m => {
			if (m.type == Type.GrowOverGrid) {
				this.increment();
			}
		}));
	}

	private increment() {
		this.grownAmount++;
		this.valueChanged.trigger();

		if (this.grownAmount == this.totalAmountRequired) {
			this.detected.trigger();
		}
	}

	getDetailsText(): string {
		return Language.t('growplantx', { num: this.totalAmountRequired });
	}
}
export = GrowOverGridDetector;