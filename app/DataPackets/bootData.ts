import Simulation = require('../Simulation/simulation');

class BootData {
	simulation: Simulation;
	
	constructor(simulation: Simulation) {
		this.simulation = simulation;
	}
}

export = BootData;