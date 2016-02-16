import GameEndDetector = require('./Simulation/Levels/gameEndDetector');
import GraphicsLoader = require('./Renderer/graphicsLoader');
import Grid = require('./Simulation/grid');
import GridFactory = require('./Simulation/Levels/gridFactory');
import InputVerifier = require('./Simulation/inputVerifier');
import LevelDefFactory = require('./Simulation/Levels/levelDefFactory');
import LevelDef = require('./Simulation/Levels/levelDef');
import MatchableFactory = require('./Simulation/matchableFactory');
import RandomGenerator = require('./Simulation/randomGenerator');
import Scene = require('./Scenes/scene');
import Simulation = require('./Simulation/simulation');
import SimulationScene = require('./Scenes/simulationScene');
import SinglePlayerInputApplier = require('./Simulation/SinglePlayer/singlePlayerInputApplier');
import SpawningSpawnManager = require('./Simulation/spawningSpawnManager');

class AppEntry {
	game: Phaser.Game;
	scene: Scene;

	constructor() {
		this.game = new Phaser.Game('100%', '100%', Phaser.AUTO, null, this, false, true, null);
	}

	preload() {
		console.log("preload");
		//this.game.stage.disableVisibilityChange = true;
		this.game.scale.scaleMode = Phaser.ScaleManager.RESIZE;

		GraphicsLoader.loadBalls(this.game, 'basic', 11);
	}

	private createSimulationFromLevel(level: LevelDef) {
		let grid = GridFactory.createGrid(level);

		let matchableFactory = new MatchableFactory();
		let spawnManager = new SpawningSpawnManager(grid, matchableFactory, new RandomGenerator(), level.colorCount);
		return new Simulation(grid, spawnManager, matchableFactory);
	}

	create() {
		console.log('create');

		let level = new LevelDefFactory().getLevel(0);
		let simulation = this.createSimulationFromLevel(level);
		let gameEndDetector = new GameEndDetector(level, simulation);
		let inputApplier = new SinglePlayerInputApplier(simulation.swapHandler, new InputVerifier(simulation.grid, simulation.matchChecker, gameEndDetector, true), simulation.grid);
		this.scene = new SimulationScene(this.game.add.group(), level, simulation, inputApplier, gameEndDetector, {});
	}

	update() {
		this.scene.update();
	}
}

new AppEntry();
