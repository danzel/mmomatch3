import DefaultBehaviour = require('./defaultBehaviour');
import Type = require('../Simulation/type');

class GetThingsToBottomBehaviour extends DefaultBehaviour {
	chooseStartingLocation(): void {
		//Find a position under a robot
		
		let positions = new Array<{ x: number, y: number }>();

		for (var x = 0; x < this.simulation.grid.width; x++) {
			let col = this.simulation.grid.cells[x];
			for (var y = 1; y < col.length; y++) {
				if (col[y].type == Type.GetToBottom) {
					positions.push({ x, y });
				}
			}
		}
		
		if (positions.length == 0) {
			super.chooseStartingLocation();
			return;
		}
		
		let i = Math.floor(Math.random() * positions.length);
		let pos = positions[i];
		
		this.lastPos.x = pos.x;
		this.lastPos.y = Math.floor(Math.random() * pos.y);
	}
}

export = GetThingsToBottomBehaviour;