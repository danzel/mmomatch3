import Detector = require('../detector');
import GameEndType = require('../gameEndType');
import Language = require('../../../Language');
import Matchable = require('../../matchable');
import Simulation = require('../../simulation');
import Type = require('../../type');

class GrowOverGridDetector extends Detector {
	grownAmount: number;

	constructor(private simulation: Simulation, public totalAmountRequired: number) {
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
		this.grownAmount = 0;
		this.simulation.grid.cells.forEach(col => col.forEach(m => {
			if (m.type == Type.GrowOverGrid) {
				this.increment();
			}
		}));
	}

	private matchableSpawned(matchable: Matchable): void {
		if (matchable.type == Type.GrowOverGrid) {
			this.increment();
			//Only one is spawned, so don't listen for more
			this.simulation.spawnManager.matchableSpawned.off(this.matchableSpawned);
		}
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