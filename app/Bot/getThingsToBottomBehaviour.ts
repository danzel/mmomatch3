import Behaviour = require('./behaviour');

class GetThingsToBottomBehaviour extends Behaviour {
	
	constructor(helper: BotHelper, simulation: Simulation, inputApplier: InputApplier) {
		super(helper, simulation, inputApplier);
	}
		
	update(dt: number) {
	}
}

export = GetThingsToBottomBehaviour;