import ComboOwnership = require('./Scoring/comboOwnership');
import Disappearer = require('./disappearer');
import Grid = require('./grid');
import InputVerifier = require('./inputVerifier');
import LiteEvent = require('../liteEvent');
import MatchChecker = require('./matchChecker');
import MatchPerformer = require('./matchPerformer');
import MatchableFactory = require('../Simulation/matchableFactory');
import Physics = require('./physics');
import QuietColumnDetector = require('./quietColumnDetector');
import ScoreTracker = require('./Scoring/scoreTracker');
import SpawnManager = require('./spawnManager');
import SpecialMatchPerformer = require('./specialMatchPerformer');
import SwapHandler = require('./swapHandler');


class Simulation {
	grid: Grid;
	spawnManager: SpawnManager;
	matchableFactory: MatchableFactory;
	physics: Physics;
	swapHandler: SwapHandler;
	matchChecker: MatchChecker;
	matchPerformer: MatchPerformer;
	disappearer: Disappearer;
	specialMatchPerformer: SpecialMatchPerformer;

	inputVerifier: InputVerifier;
	quietColumnDetector: QuietColumnDetector;
	comboOwnership: ComboOwnership;
	scoreTracker: ScoreTracker;

	framesElapsed: number = 0;
	timeRunning: number = 0; //TODO: Need to serialize this and send to client

	frameCompleted = new LiteEvent<void>();
	
	constructor(grid: Grid, spawnManager: SpawnManager, matchableFactory: MatchableFactory) {
		//Things the simulation requires to work
		this.grid = grid;
		this.spawnManager = spawnManager;
		this.matchableFactory = matchableFactory;
		this.physics = new Physics(this.grid);
		this.swapHandler = new SwapHandler(this.grid);
		this.matchChecker = new MatchChecker(this.grid);
		this.matchPerformer = new MatchPerformer(this.matchChecker, this.swapHandler, this.physics);
		this.disappearer = new Disappearer(this.grid);
		this.specialMatchPerformer = new SpecialMatchPerformer(this.grid, this.matchChecker, this.matchPerformer, this.disappearer);

		//Things just stored in the simulation for convenience
		this.inputVerifier = new InputVerifier(this.grid, this.matchChecker, true);
		this.quietColumnDetector = new QuietColumnDetector(this.grid, this.physics, this.swapHandler, this.matchPerformer, this.disappearer);
		this.comboOwnership = new ComboOwnership(this.grid, this.swapHandler, this.matchPerformer, this.quietColumnDetector);
		this.scoreTracker = new ScoreTracker(this.comboOwnership);
	}

	update(dt: number) {
		//console.log('run', dt);
		this.physics.updateMovement(dt);
		this.disappearer.update(dt);
		this.swapHandler.update(dt);
		this.spawnManager.update(dt);
		this.physics.updateMomentum(dt);

		this.quietColumnDetector.lateUpdate(dt);

		this.framesElapsed++;
		this.timeRunning += dt;

		this.frameCompleted.trigger();
	}
}

export = Simulation;