import LevelDef = require('../../Simulation/Levels/levelDef');
import MagicNumbers = require('../../Simulation/magicNumbers');
import Simulation = require('../../Simulation/simulation');
import Type = require('../../Simulation/type');
import VictoryType = require('../../Simulation/Levels/victoryType');

class InitialZoomCalculator {
	static getZoomInTarget(simulation: Simulation, level: LevelDef): { x: number, y: number } {
		return { x: level.width / 2, y: 3.7 };
	}
}

export = InitialZoomCalculator;