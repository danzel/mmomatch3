/// <reference path="../typings/webfontloader/webfontloader.d.ts" />

import DefaultLevelAndSimulationProvider = require('./Server/defaultLevelAndSimulationProvider');
import GameEndDetector = require('./Simulation/Levels/gameEndDetector');
import GoodBrowser = require('./goodBrowser');
import GraphicsLoader = require('./Renderer/graphicsLoader');
import Grid = require('./Simulation/grid');
import GridFactory = require('./Simulation/Levels/gridFactory');
import HtmlOverlayManager = require('./HtmlOverlay/manager')
import InputVerifier = require('./Simulation/inputVerifier');
import LevelDef = require('./Simulation/Levels/levelDef');
import LevelDefFactoryDebug = require('./Simulation/Levels/levelDefFactoryDebug');
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
	levelAndSimulationProvider: DefaultLevelAndSimulationProvider;
	game: Phaser.Game;
	simulation: Simulation;
	scene: SimulationScene;

	constructor() {
		this.htmlOverlayManager = new HtmlOverlayManager();
		this.levelAndSimulationProvider = new DefaultLevelAndSimulationProvider(new LevelDefFactoryDebug());
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
	preRender() {
		this.scene.preRender();
	}

	private createSimulationScene(levelNumber: number) {
		let loaded = this.levelAndSimulationProvider.loadLevel(levelNumber);

		let level = loaded.level;
		let simulation = loaded.simulation;

		let gameEndDetector = new GameEndDetector(level, simulation);
		let inputApplier = new SinglePlayerInputApplier(simulation.swapHandler, simulation.inputVerifier, simulation.grid);
		let sceneGroup = this.game.add.group();
		this.scene = new SimulationScene(sceneGroup, this.htmlOverlayManager, level, simulation, inputApplier, gameEndDetector, { inChargeOfSimulation: true }, 0, null);

		gameEndDetector.gameEnded.on((victory: boolean) => {
			this.scene.gameOverOverlay.clicked.on(() => {
				sceneGroup.destroy();
				console.log('creating');
				this.createSimulationScene(levelNumber + (victory ? 1 : 0));
			});
		});
	}
}

if (GoodBrowser) {
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
} else {
	alert('Your browser is too old to play this game. Please download Google Chrome or Mozilla Firefox.');
	window.location.replace('http://outdatedbrowser.com/');
}