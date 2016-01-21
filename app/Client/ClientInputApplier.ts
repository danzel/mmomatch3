import Client = require('./client');
import Grid = require('../Simulation/grid');
import InputApplier = require('../Simulation/inputApplier');
import InputVerifier = require('../Simulation/inputVerifier');
import Matchable = require('../Simulation/matchable');

class ClientInputApplier implements InputApplier {
	private client: Client;
	private inputVerifier: InputVerifier;
	private grid: Grid;

	constructor(client: Client, inputVerifier: InputVerifier, grid: Grid) {
		this.client = client;
		this.inputVerifier = inputVerifier;
		this.grid = grid;
	}

	swapMatchable(left: Matchable, right: Matchable) {
		if (this.inputVerifier.swapIsValid(left, right)) {
			this.client.sendSwap(left.id, right.id);
		}
	}
}

export = ClientInputApplier;