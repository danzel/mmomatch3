import Client = require('./client');
import Grid = require('../Simulation/grid');
import InputApplier = require('../Simulation/inputApplier');
import InputVerifier = require('../Simulation/inputVerifier');
import Matchable = require('../Simulation/matchable');

class ClientInputApplier extends InputApplier {
	private client: Client;

	constructor(client: Client, inputVerifier: InputVerifier, grid: Grid) {
		super(inputVerifier, grid);

		this.client = client;
	}

	protected performSwap(left: Matchable, right: Matchable): void {
		this.client.sendSwap(left.id, right.id);
	}
}

export = ClientInputApplier;