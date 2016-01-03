import Disappearer = require('./disappearer');
import Grid = require('./grid');
import MatchChecker = require('./matchChecker');
import Physics = require('./physics');
import ISpawnManager = require('./iSpawnManager');
import SwapHandler = require('./swapHandler');

class Simulation {
	grid: Grid;
	spawnManager: ISpawnManager;
	physics: Physics;
	swapHandler: SwapHandler;
	matchChecker: MatchChecker;
	disappearer: Disappearer;
	
	framesElapsed: number;

	constructor(grid: Grid, spawnManager: ISpawnManager) {
		this.grid = grid;
		this.spawnManager = spawnManager;
		this.physics = new Physics(this.grid);
		this.swapHandler = new SwapHandler(this.grid);
		this.matchChecker = new MatchChecker(this.grid, this.swapHandler, this.physics);
		this.disappearer = new Disappearer(this.grid);
		
		this.framesElapsed = 0;
	}

	update(dt: number) {
		console.log('run', dt);
		this.physics.update(dt);
		this.spawnManager.update(dt);
		this.swapHandler.update(dt);
		this.disappearer.update(dt);
		
		this.framesElapsed++;
	}
}

export = Simulation;