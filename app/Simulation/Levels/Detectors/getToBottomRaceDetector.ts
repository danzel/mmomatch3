import Detector = require('../detector');
import GameEndType = require('../gameEndType');
import Language = require('../../../Language');
import Matchable = require('../../matchable');
import Simulation = require('../../simulation');
import Swap = require('../../swap');
import Type = require('../../type');

class GetToBottomRaceDetector extends Detector {
	constructor(private simulation: Simulation, public isVictory: boolean, private matchableType: Type) {
		super(isVictory ? GameEndType.TeamVictory : GameEndType.TeamDefeat);

		simulation.disappearer.matchableDisappeared.on(matchable => this.checkMatchable(matchable));
	}

	private checkMatchable(matchable: Matchable) {
		if (matchable.type == this.matchableType) {
			this.detected.trigger();
		}
	}

	update() {
		let anyOnGrid = false;
		let foundOurType = false;

		this.simulation.grid.cells.forEach(col => col.forEach(m => {
			anyOnGrid = true;
			if (m.type == this.matchableType) {
				foundOurType = true;
			}
		}));

		if (anyOnGrid && !foundOurType) {
			this.detected.trigger();
		}
	}

	getDetailsText(): string {
		let type = this.isButterfly() ? 'butterfly' : 'bee';
		return Language.t((this.isVictory ? '' : 'before ') + type + ' to bottom');
	}

	isButterfly(): boolean {
		return this.matchableType == Type.GetToBottomRace1;
	}
}

export = GetToBottomRaceDetector;