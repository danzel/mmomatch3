/// <reference path="../typings/webfontloader/webfontloader.d.ts" />

import DefaultLevelAndSimulationProvider = require('./Server/defaultLevelAndSimulationProvider');
import GameEndDetector = require('./Simulation/Levels/gameEndDetector');
import GraphicsLoader = require('./Renderer/graphicsLoader');
import Grid = require('./Simulation/grid');
import GridFactory = require('./Simulation/Levels/gridFactory');
import HtmlOverlayManager = require('./HtmlOverlay/manager')
import InputVerifier = require('./Simulation/inputVerifier');
import LevelDef = require('./Simulation/Levels/levelDef');
import LevelDefFactory = require('./Simulation/Levels/levelDefFactory');
import MatchableFactory = require('./Simulation/matchableFactory');
import RandomGenerator = require('./Simulation/randomGenerator');
import RequireMatch = require('./Simulation/requireMatch');
import Simulation = require('./Simulation/simulation');
import SimulationScene = require('./Scenes/simulationScene');
import SinglePlayerInputApplier = require('./Simulation/SinglePlayer/singlePlayerInputApplier');
import SpawningSpawnManager = require('./Simulation/spawningSpawnManager');
import TouchCatchAll = require('./Renderer/Components/touchCatchAll');

class AppEntry {
	htmlOverlayManager: HtmlOverlayManager;
	game: Phaser.Game;
	simulation: Simulation;
	scene: SimulationScene;

	constructor() {
		this.htmlOverlayManager = new HtmlOverlayManager('overlay');
		this.game = new Phaser.Game('100%', '100%', Phaser.AUTO, null, this, false, true, null);
	}

	preload() {
		console.log("preload");
		//this.game.stage.disableVisibilityChange = true;
		this.game.scale.scaleMode = Phaser.ScaleManager.RESIZE;
		this.game.stage.backgroundColor = 0x273348;

		GraphicsLoader.loadBalls(this.game, 'emojione-animals', 11);
	}

	create() {
		console.log('create');

		this.createSimulationScene(1);
	}

	update() {
		this.scene.update();
	}

	private createSimulationScene(levelNumber: number) {
		let loaded = new DefaultLevelAndSimulationProvider(new LevelDefFactory()).loadLevel(levelNumber);

		let level = loaded.level;
		let simulation = loaded.simulation;

		let gameEndDetector = new GameEndDetector(level, simulation);
		let inputApplier = new SinglePlayerInputApplier(simulation.swapHandler, simulation.inputVerifier, simulation.grid);
		let sceneGroup = this.game.add.group();
		this.scene = new SimulationScene(sceneGroup, this.htmlOverlayManager, level, simulation, inputApplier, gameEndDetector, { inChargeOfSimulation: true }, 0);

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

WebFont.load({
	custom: {
		families: ['Chewy'],
		urls: ['img/skin/emojione-animals/chewy.css']
	},
    /*google: {
		families: ['Chewy']
    },*/
	classes: false,

	active: function() {
		new AppEntry();
	},
	inactive: function() {
		new AppEntry();
	}
});
