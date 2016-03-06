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
import TouchCatchAll = require('./Renderer/Components/touchCatchAll');

class AppEntry {
	game: Phaser.Game;
	simulation: Simulation;
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

		this.createSimulationScene(1);
	}

	update() {
		this.scene.update();
	}

	private createSimulationScene(levelNumber: number) {
		let level = new LevelDefFactory().getLevel(levelNumber);
		let simulation = this.createSimulationFromLevel(level);
		let gameEndDetector = new GameEndDetector(level, simulation);
		let inputApplier = new SinglePlayerInputApplier(simulation.swapHandler, simulation.inputVerifier, simulation.grid);
		let sceneGroup = this.game.add.group();
		this.scene = new SimulationScene(sceneGroup, level, simulation, inputApplier, gameEndDetector, { inChargeOfSimulation: true });

		gameEndDetector.gameEnded.on((victory) => {
			let catchAll = new TouchCatchAll(this.game);
			sceneGroup.add(catchAll.sprite);

			catchAll.pointerUp.on(() => {
				sceneGroup.destroy();
				this.createSimulationScene(levelNumber + (victory ? 1 : 0));
			});
		});
	}
}

new AppEntry();
