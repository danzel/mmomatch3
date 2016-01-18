import Disappearer = require('./disappearer');
import Grid = require('./grid');
import MatchChecker = require('./matchChecker');
import MatchPerformer = require('./matchPerformer');
import MatchableFactory = require('../Simulation/matchableFactory');
import Physics = require('./physics');
import SpawnManager = require('./spawnManager');
import SwapHandler = require('./swapHandler');

import QuietColumnDetector = require('./quietColumnDetector');

class Simulation {
	grid: Grid;
	spawnManager: SpawnManager;
	matchableFactory: MatchableFactory;
	physics: Physics;
	swapHandler: SwapHandler;
	matchChecker: MatchChecker;
	matchPerformer: MatchPerformer;
	disappearer: Disappearer;
	
	quietColumnDetector: QuietColumnDetector;
	
	framesElapsed: number;

	constructor(grid: Grid, spawnManager: SpawnManager, matchableFactory: MatchableFactory) {
		this.grid = grid;
		this.spawnManager = spawnManager;
		this.matchableFactory = matchableFactory;
		this.physics = new Physics(this.grid);
		this.swapHandler = new SwapHandler(this.grid);
		this.matchChecker = new MatchChecker(this.grid);
		this.matchPerformer = new MatchPerformer(this.matchChecker, this.swapHandler, this.physics);
		this.disappearer = new Disappearer(this.grid);
		
		this.quietColumnDetector = new QuietColumnDetector(this.grid, this.physics, this.swapHandler, this.matchPerformer, this.disappearer);
		
		this.framesElapsed = 0;
	}

	update(dt: number) {
		//console.log('run', dt);
		this.physics.update(dt);
		this.swapHandler.update(dt);
		this.disappearer.update(dt);
		this.spawnManager.update(dt);
		
		this.quietColumnDetector.lateUpdate(dt);
		
		this.framesElapsed++;
	}
}

export = Simulation;