import Detector = require('../detector');
import GameEndType = require('../gameEndType');
import Simulation = require('../../simulation');

class NoMovesDetector extends Detector {
	hasTriggered = false;

	haveRanSinceQuiet = false;

	constructor(private simulation: Simulation) {
		super(GameEndType.NoMovesFailure);

		simulation.frameCompleted.on(() => {
			this.update();
		});
	}

	update() {
		if (this.hasTriggered) {
			return;
		}
		if (this.simulation.quietColumnDetector.gridIsQuiet) {
			if (!this.haveRanSinceQuiet) {
				if (!this.gridHasValidMove()) {
					this.hasTriggered = true;
					this.detected.trigger();
				}
				this.haveRanSinceQuiet = true;
			}
		} else {
			this.haveRanSinceQuiet = false;
		}
	}

	private gridHasValidMove(): boolean {
		//Don't trigger on an empty grid (aka just before we spawn everything)
		let gridIsEmpty = true;

		for (var x = 0; x < this.simulation.grid.width; x++) {
			let col = this.simulation.grid.cells[x];
			for (var y = 0; y < col.length; y++) {
				gridIsEmpty = false;
				if (x < this.simulation.grid.width - 1) {
					//Check can swap right
					let here = col[y];
					let right = this.simulation.grid.findMatchableAtPosition(x + 1, y);
					if (this.simulation.inputVerifier.swapIsValid(here, right)) {
						return true;
					}
				}
				if (y < col.length - 1) {
					//Check can swap up
					let here = col[y];
					let up = col[y + 1];
					if (this.simulation.inputVerifier.swapIsValid(here, up)) {
						return true;
					}
				}
			}
		}

		if (gridIsEmpty) {
			return true;
		}

		return false;
	}

	getDetailsText(): string {
		return ""
	}
}

export = NoMovesDetector;