import Simulation = require('../Simulation/simulation');

interface ISerializer {
	serialize(simulation: Simulation) : any;
	deserialize(data: any): Simulation;
}

export = ISerializer;