import Detector = require('../detector');
import GameEndType = require('../gameEndType');
import Language = require('../../../Language');
import Simulation = require('../../simulation');

class SwapsDetector extends Detector {

	/** Sort of a hack. If the game is started but it is already over (aka been deserialized after game over) we need to detect that without waiting for the grid to go quiet as it may already be */
	private isInitialCheck = true;

	swapsRemaining: number;

	constructor(private simulation: Simulation, public totalSwaps: number) {
		super(GameEndType.LevelFailure);

		this.swapsRemaining = totalSwaps;

		simulation.swapHandler.swapStarted.on(() => this.update());
	}

	update() {
		if (this.swapsRemaining > 0) {
			this.swapsRemaining = Math.max(0, this.totalSwaps - this.simulation.swapHandler.totalSwapsCount);
			this.valueChanged.trigger();

			if (this.swapsRemaining == 0) {
				this.simulation.inputVerifier.inputDisabled = true;

				if (this.isInitialCheck) {
					this.detected.trigger();
				} else {
					this.simulation.quietColumnDetector.gridBecameQuiet.on(() => {
						this.detected.trigger();
					});
				}
			}

			this.isInitialCheck = false;
		}
	}

	getDetailsText(): string {
		return Language.t('within x moves', { num: this.totalSwaps });
	}
}

export = SwapsDetector;