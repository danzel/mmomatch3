import LevelAndSimulationProvider = require('../../app/Server/levelAndSimulationProvider');
import LevelDef = require('../../app/Simulation/Levels/levelDef');
import RequireMatch = require('../../app/Simulation/requireMatch');
import Simulation = require('../../app/Simulation/simulation');
import VictoryType = require('../../app/Simulation/Levels/victoryType');

class TestLASProvider implements LevelAndSimulationProvider {
	constructor(private level: LevelDef, private simulation: Simulation) {
	}

	loadLevel(levelNumber: number): { level: LevelDef, simulation: Simulation } {

		if (this.level.victoryType == VictoryType.RequireMatch) {
			let requireMatches = <Array<{ x: number, y: number; amount: number }>>this.level.victoryValue;
			requireMatches.forEach(req => {
				this.simulation.requireMatchInCellTracker.requirements.push(new RequireMatch(req.x, req.y, req.amount));
			})
		}

		return { level: this.level, simulation: this.simulation };
	}
};


export = TestLASProvider;