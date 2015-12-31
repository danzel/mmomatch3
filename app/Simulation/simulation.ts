import Disappearer = require('./disappearer');
import Grid = require('./grid');
import MatchChecker = require('./matchChecker');
import Physics = require('./physics');
import SpawnManager = require('./spawnManager');
import SwapHandler = require('./swapHandler');

class Simulation {
	grid: Grid;
	spawnManager: SpawnManager;
	physics: Physics;
	swapHandler: SwapHandler;
	matchChecker: MatchChecker;
	disappearer: Disappearer;

	constructor() {
		this.grid = new Grid(50, 20);
		this.spawnManager = new SpawnManager(this.grid);
		this.physics = new Physics(this.grid);
		this.swapHandler = new SwapHandler(this.grid);
		
		this.matchChecker = new MatchChecker(this.grid, this.swapHandler);
		
		this.disappearer = new Disappearer(this.grid);
		
		//TODO: Listen to swapHandler.swapOccurred and check for matches?
		//TODO: Listen to physics.matchableLanded and check for matches?
	}

	update(dt: number) {
		this.physics.update(dt);
		this.spawnManager.update(dt);
		this.swapHandler.update(dt);
		
		this.disappearer.update(dt);
	}
}

export = Simulation;