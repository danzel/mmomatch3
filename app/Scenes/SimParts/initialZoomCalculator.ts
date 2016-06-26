import LevelDef = require('../../Simulation/Levels/levelDef');
import MagicNumbers = require('../../Simulation/magicNumbers');
import Simulation = require('../../Simulation/simulation');
import Type = require('../../Simulation/type');
import VictoryType = require('../../Simulation/Levels/victoryType');

class InitialZoomCalculator {
	static getZoomInTarget(simulation: Simulation, level: LevelDef): { x: number, y: number } {

		if (level.victoryType == VictoryType.GetThingsToBottom) {
			let things = new Array<{ x: number, y: number }>();

			simulation.grid.cells.forEach(col => col.forEach((m, index) => {
				if (m.type == Type.GetToBottom) {
					things.push({ x: m.x, y: index });
				}
			}));

			if (things.length > 0) {
				let idx = Math.floor(Math.random() * things.length);
				let t = things[idx];

				return t;
			}
		}
		if (level.victoryType == VictoryType.GetToBottomRace) {
			let res: {x: number, y: number };
			simulation.grid.cells.forEach(col => col.forEach((m, index) => {
				if (m.type == level.victoryValue) {
					res = { x: m.x, y: index };
				}
			}));
			if (res) {
				return res;
			}
		}

		if (level.victoryType == VictoryType.RequireMatch && simulation.requireMatchInCellTracker.requirements.length > 0) {
			let idx = Math.floor(Math.random() * simulation.requireMatchInCellTracker.requirements.length);
			let req = simulation.requireMatchInCellTracker.requirements[idx];

			return { x: req.x, y: req.y / MagicNumbers.matchableYScale };
		}

		return { x: level.width - 1, y: (level.height - 1) };
		//return { x: 0, y: 0};
		//return { x: 0.5 * level.width, y: 0.5 * level.height };
		//return { x: Math.random() * level.width, y: Math.random() * level.height };
	}
}

export = InitialZoomCalculator;