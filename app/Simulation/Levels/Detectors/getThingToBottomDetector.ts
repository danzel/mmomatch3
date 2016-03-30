import Detector = require('../detector');
import Simulation = require('../../simulation');
import Type = require('../../type');

class GetThingToBottomDetector extends Detector {
	constructor(private simulation: Simulation) {
		super();

		simulation.quietColumnDetector.columnBecameQuiet.on(col => this.columnBecameQuiet(col));
	}

	private columnBecameQuiet(colIndex: number) {
		let col = this.simulation.grid.cells[colIndex];

		if (col.length > 1 && col[0].type == Type.GetToBottom) {
			this.valueChanged.trigger();
			this.detected.trigger();
		}
	}

	update() {
		for (let i = 0; i < this.simulation.grid.cells.length; i++) {
			this.columnBecameQuiet(i);
		}
	}

	getDetailsText(): string {
		return "Get the thing to the bottom";
	}
}

export = GetThingToBottomDetector;