import Grid = require('./grid');
import SpawnManager = require('./spawnManager');
import SwapHandler = require('./swapHandler');
import Physics = require('./physics');

class Simulation {
	grid: Grid;
	spawnManager: SpawnManager;
	physics: Physics;
	swapHandler: SwapHandler;

	constructor() {
		this.grid = new Grid(50, 20);
		this.spawnManager = new SpawnManager(this.grid);
		this.physics = new Physics(this.grid);
		this.swapHandler = new SwapHandler(this.grid);
		
		//TODO: Listen to swapHandler.swapOccurred and check for matches?
		//TODO: Listen to physics.matchableLanded and check for matches?
	}

	update(dt: number) {
		this.physics.update(dt);
		this.spawnManager.update(dt);
		this.swapHandler.update(dt);
	}
}

export = Simulation;