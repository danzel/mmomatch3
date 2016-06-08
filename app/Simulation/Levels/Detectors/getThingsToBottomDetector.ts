import Detector = require('../detector');
import GameEndType = require('../gameEndType');
import Matchable = require('../../matchable');
import Simulation = require('../../simulation');
import Swap = require('../../swap');
import Type = require('../../type');

class GetThingsToBottomDetector extends Detector {
	amount: number;

	constructor(private simulation: Simulation, private totalAmount: number) {
		super(GameEndType.LevelVictory);
		this.amount = totalAmount;

		simulation.spawnManager.matchableSpawned.on(matchable => this.matchableSpawned(matchable));
		simulation.disappearer.matchableDisappeared.on(matchable => this.checkMatchable(matchable));
	}

	private matchableSpawned(matchable: Matchable) {
		if (matchable.type == Type.GetToBottom) {
			this.amount++;
			this.valueChanged.trigger();
		}
	}

	private checkMatchable(matchable: Matchable) {
		if (matchable.type == Type.GetToBottom) {
			this.amount--;
			this.valueChanged.trigger();
			if (this.amount == 0) {
				this.detected.trigger();
			}
			return true;
		}
		return false;
	}

	update() {
		this.amount = 0;
		let anyOnGrid = false;

		this.simulation.grid.cells.forEach(col => col.forEach(m => {
			anyOnGrid = true;
			if (m.type == Type.GetToBottom) {
				this.amount++;
			}
		}));
		
		if (anyOnGrid && this.amount == 0) {
			this.detected.trigger();
		}
	}

	getDetailsText(): string {
		return "Get " + this.totalAmount + " Robots to the bottom";
	}
}

export = GetThingsToBottomDetector;