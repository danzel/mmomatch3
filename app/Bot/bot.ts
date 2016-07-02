import BotHelper = require('./botHelper');
import InputApplier = require('../Simulation/inputApplier');
import LevelDef = require('../Simulation/Levels/levelDef');
import Simulation = require('../Simulation/simulation');
import VictoryType = require('../Simulation/Levels/victoryType');

import Behaviour = require('./behaviour');
import GetThingsToBottomBehaviour = require('./getThingsToBottomBehaviour');
import DefaultBehaviour = require('./defaultBehaviour');
import RequireMatchBehaviour = require('./requireMatchBehaviour');

class Bot {
	private secondsToNextMove: number;

	private behaviour: Behaviour;

	config = {
		secondsBeforeFirstMove: 5,
	};

	constructor(level: LevelDef, simulation: Simulation, inputApplier: InputApplier) {

		this.secondsToNextMove = (Math.random() + 0.5) * this.config.secondsBeforeFirstMove;

		switch (level.victoryType) {
			case VictoryType.RequireMatch:
				this.behaviour = new RequireMatchBehaviour(new BotHelper(simulation.grid, simulation.inputVerifier), simulation, inputApplier);
				break;
			case VictoryType.GetThingsToBottom:
			case VictoryType.GetToBottomRace:
				this.behaviour = new GetThingsToBottomBehaviour(new BotHelper(simulation.grid, simulation.inputVerifier), simulation, inputApplier);
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