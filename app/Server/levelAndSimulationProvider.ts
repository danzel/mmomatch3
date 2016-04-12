import LevelDef = require('../Simulation/Levels/levelDef');
import Simulation = require('../Simulation/simulation');

interface LevelAndSimulationProvider {
	loadLevel(levelNumber: number, playerCount?: number): { level: LevelDef, simulation: Simulation };
}

export = LevelAndSimulationProvider;