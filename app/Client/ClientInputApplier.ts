import Client = require('./client');
import Grid = require('../Simulation/grid');
import IInputApplier = require('../Simulation/iInputApplier');
import InputVerifier = require('../Simulation/inputVerifier');

class ClientInputApplier implements IInputApplier {
	private client: Client
	private inputVerifier: InputVerifier;
	private grid: Grid;

	constructor(client: Client, inputVerifier: InputVerifier, grid: Grid) {
		this.client = client;
		this.inputVerifier = inputVerifier;
		this.grid = grid;
	}

	swapMatchable(x: number, y: number, xTarget: number, yTarget: number) {
		if (this.inputVerifier.swapIsValid(x, y, xTarget, yTarget)) {
			this.client.sendSwap(this.grid.cells[x][y].id, this.grid.cells[xTarget][yTarget].id);
		}
	}
}

export = ClientInputApplier;