import BotHelper = require('./botHelper');
import InputApplier = require('../Simulation/inputApplier');
import LevelDef = require('../Simulation/Levels/levelDef');
import Simulation = require('../Simulation/simulation');
import VictoryType = require('../Simulation/Levels/victoryType');

import Behaviour = require('./behaviour');
import DefaultBehaviour = require('./defaultBehaviour');
import GetThingsToBottomBehaviour = require('./getThingsToBottomBehaviour');
import GrowOverGridBehaviour = require('./growOverGridBehaviour');
import RequireMatchBehaviour = require('./requireMatchBehaviour');

class Bot {
	private behaviour: Behaviour;

	constructor(level: LevelDef, simulation: Simulation, inputApplier: InputApplier) {
		switch (level.victoryType) {
			case VictoryType.RequireMatch:
				this.behaviour = new RequireMatchBehaviour(new BotHelper(simulation.grid, simulation.inputVerifier), simulation, inputApplier);
				break;
			case VictoryType.GetThingsToBottom:
			case VictoryType.GetToBottomRace:
				this.behaviour = new GetThingsToBottomBehaviour(new BotHelper(simulation.grid, simulation.inputVerifier), simulation, inputApplier);
				break;
			case VictoryType.GrowOverGrid:
				this.behaviour = new GrowOverGridBehaviour(new BotHelper(simulation.grid, simulation.inputVerifier), simulation, inputApplier);
				break;
			default:
				this.behaviour = new DefaultBehaviour(new BotHelper(simulation.grid, simulation.inputVerifier), simulation, inputApplier);
				break;
		}
	}

	update(dt: number) {
		this.behaviour.update(dt);
	}
}

export = Bot;