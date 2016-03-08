import LevelAndSimulationProvider = require('../../app/Server/levelAndSimulationProvider');
import LevelDef = require('../../app/Simulation/Levels/levelDef');
import Simulation = require('../../app/Simulation/simulation');

class TestLASProvider implements LevelAndSimulationProvider {
	constructor(private level: LevelDef, private simulation: Simulation) {
	}

	loadLevel(levelNumber: number): { level: LevelDef, simulation: Simulation } {
		return { level: this.level, simulation: this.simulation };
	}
};


export = TestLASProvider;