import BotHelper = require('./botHelper');
import InputApplier = require('../Simulation/inputApplier');
import LevelDef = require('../simulation/Levels/levelDef');
import Simulation = require('../simulation/Simulation');
import VictoryType = require('../simulation/Levels/victoryType');

import Behaviour = require('./behaviour');
import GetThingsToBottomBehaviour = require('./getThingsToBottomBehaviour');
import DefaultBehaviour = require('./defaultBehaviour');
//import RequireMatchBehaviour = require('./requireMatchBehaviour');

class Bot {
	private secondsToNextMove: number;

	private behaviour: Behaviour;

	config = {
		secondsBeforeFirstMove: 5,
	};

	constructor(level: LevelDef, simulation: Simulation, inputApplier: InputApplier) {

		this.secondsToNextMove = (Math.random() + 0.5) * this.config.secondsBeforeFirstMove;

		switch (level.victoryType) {
			/*case VictoryType.RequireMatch:
				this.behaviour = new RequireMatchBehaviour(this);
				break;*/
			case VictoryType.GetThingsToBottom:
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