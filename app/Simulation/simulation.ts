import ComboOwnership = require('./Scoring/comboOwnership');
import Disappearer = require('./disappearer');
import Grid = require('./grid');
import InputVerifier = require('./inputVerifier');
import LiteEvent = require('../liteEvent');
import MatchChecker = require('./matchChecker');
import MatchPerformer = require('./matchPerformer');
import MatchableFactory = require('./matchableFactory');
import MatchableTransformer = require('./matchableTransformer');
import Physics = require('./physics');
import QuietColumnDetector = require('./quietColumnDetector');
import RequireMatchInCellTracker = require('./requireMatchInCellTracker');
import ScoreTracker = require('./Scoring/scoreTracker');
import SimulationStats = require('./simulationStats');
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
	matchableTransformer: MatchableTransformer;

	inputVerifier: InputVerifier;
	quietColumnDetector: QuietColumnDetector;
	comboOwnership: ComboOwnership;
	scoreTracker: ScoreTracker;
	requireMatchInCellTracker: RequireMatchInCellTracker;
	simulationStats: SimulationStats;

	private dt: number;
	framesElapsed: number = 0;
	frameCompleted = new LiteEvent<void>();

	constructor(grid: Grid, spawnManager: SpawnManager, matchableFactory: MatchableFactory, public tickRate: number) {
		//Things the simulation requires to work
		this.grid = grid;
		this.spawnManager = spawnManager;
		this.matchableFactory = matchableFactory;
		this.physics = new Physics(this.grid);
		this.swapHandler = new SwapHandler(this.grid);
		this.matchChecker = new MatchChecker(this.grid);
		let specialMatchPerformer = new SpecialMatchPerformer(this.grid, this.matchChecker);
		this.matchPerformer = new MatchPerformer(this.matchChecker, this.swapHandler, this.physics, specialMatchPerformer);
		this.disappearer = new Disappearer(this.grid);
		this.matchableTransformer = new MatchableTransformer(this.matchPerformer);

		//Things just stored in the simulation for convenience
		this.inputVerifier = new InputVerifier(this.grid, this.matchChecker, true);
		this.quietColumnDetector = new QuietColumnDetector(this.grid, this.physics, this.swapHandler, this.matchPerformer, this.disappearer);
		this.comboOwnership = new ComboOwnership(this.grid, this.swapHandler, this.matchPerformer, this.quietColumnDetector);
		this.scoreTracker = null;
		this.requireMatchInCellTracker = new RequireMatchInCellTracker(this.comboOwnership);
		
		this.simulationStats = new SimulationStats(this.matchPerformer);

		this.dt = 1 / tickRate;
	}

	update() {
		//console.log('run', dt);
		this.physics.updateMovement(this.dt);
		this.disappearer.update(this.dt);
		this.swapHandler.update(this.dt);
		this.spawnManager.update(this.dt);
		this.physics.updateMomentum(this.dt);

		this.quietColumnDetector.lateUpdate(this.dt);

		this.framesElapsed++;

		this.frameCompleted.trigger();
	}

	get timeRunning(): number { return this.framesElapsed * this.dt; }
}

export = Simulation;