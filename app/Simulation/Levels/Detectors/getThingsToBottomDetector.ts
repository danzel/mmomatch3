import Detector = require('../detector');
import Matchable = require('../../matchable');
import Simulation = require('../../simulation');
import Swap = require('../../swap');
import Type = require('../../type');

class GetThingsToBottomDetector extends Detector {
	amount: number;

	constructor(private simulation: Simulation, private totalAmount: number) {
		super();
		this.amount = totalAmount;

		simulation.physics.matchableLanded.on(matchable => this.checkMatchable(matchable));
		simulation.swapHandler.swapOccurred.on(swap => this.swapOccurred(swap));
	}

	private checkMatchable(matchable: Matchable) {
		if (matchable.type == Type.GetToBottom && matchable.y == 0) {
			this.amount--;
			this.valueChanged.trigger();
			if (this.amount == 0) {
				this.detected.trigger();
			}
		}
	}

	private swapOccurred(swap: Swap) {
		this.checkMatchable(swap.left);
		this.checkMatchable(swap.right);
	}

	update() {
		this.amount = this.totalAmount;

		for (let x = 0; x < this.simulation.grid.width; x++) {
			let col = this.simulation.grid.cells[x];
			let m = col[0];
			if (m && m.yMomentum == 0) {
				this.checkMatchable(m);
			}
		}
	}

	getDetailsText(): string {
		return "Get " + this.totalAmount + " Robots to the bottom";
	}
}

export = GetThingsToBottomDetector;