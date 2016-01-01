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

	constructor(width: number, height: number) {
		this.grid = new Grid(width, height);
		this.spawnManager = new SpawnManager(this.grid);
		this.physics = new Physics(this.grid);
		this.swapHandler = new SwapHandler(this.grid);
		
		this.matchChecker = new MatchChecker(this.grid, this.swapHandler, this.physics);
		
		this.disappearer = new Disappearer(this.grid);
	}

	update(dt: number) {
		this.physics.update(dt);
		this.spawnManager.update(dt);
		this.swapHandler.update(dt);
		
		this.disappearer.update(dt);
	}
}

export = Simulation;