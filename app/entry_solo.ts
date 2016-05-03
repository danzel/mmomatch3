/// <reference path="../typings/webfontloader/webfontloader.d.ts" />

import DefaultLevelAndSimulationProvider = require('./Server/defaultLevelAndSimulationProvider');
import GameEndDetector = require('./Simulation/Levels/gameEndDetector');
import GoodBrowser = require('./goodBrowser');
import GraphicsLoader = require('./Renderer/graphicsLoader');
import HtmlOverlayManager = require('./HtmlOverlay/manager')
import LevelDef = require('./Simulation/Levels/levelDef');
import LevelDefFactoryDebug = require('./Simulation/Levels/levelDefFactoryDebug');
import LevelDefFactoryDynamic1 = require('./Simulation/Levels/levelDefFactoryDynamic1');
import Simulation = require('./Simulation/simulation');
import SimulationScene = require('./Scenes/simulationScene');
import DirectInputApplier = require('./Simulation/SinglePlayer/directInputApplier');

class AppEntry {
	htmlOverlayManager: HtmlOverlayManager;
	levelAndSimulationProvider: DefaultLevelAndSimulationProvider;
	game: Phaser.Game;
	simulation: Simulation;
	scene: SimulationScene;

	constructor() {
		this.htmlOverlayManager = new HtmlOverlayManager();
		this.levelAndSimulationProvider = new DefaultLevelAndSimulationProvider(new LevelDefFactoryDebug());
		//this.levelAndSimulationProvider = new DefaultLevelAndSimulationProvider(new LevelDefFactoryDynamic1());
		this.game = new Phaser.Game('100%', '100%', Phaser.AUTO, null, this, false, true, null);
	}

	preload() {
		console.log("preload");
		//this.game.stage.disableVisibilityChange = true;
		this.game.scale.scaleMode = Phaser.ScaleManager.RESIZE;
		this.game.stage.backgroundColor = 0x273348;

		GraphicsLoader.load(this.game);
	}

	create() {
		console.log('create');

		this.createSimulationScene(1);
	}

	update() {
		if (this.simulation) {
			this.simulation.update();
		}
		this.scene.update();
	}
	preRender() {
		this.scene.preRender();
	}

	private createSimulationScene(levelNumber: number) {
		let loaded = this.levelAndSimulationProvider.loadLevel(levelNumber);

		let level = loaded.level;
		this.simulation = loaded.simulation;

		let gameEndDetector = new GameEndDetector(level, this.simulation);
		let inputApplier = new DirectInputApplier(0, this.simulation.swapHandler, this.simulation.inputVerifier, this.simulation.grid);
		let sceneGroup = this.game.add.group();
		this.scene = new SimulationScene(sceneGroup, this.htmlOverlayManager, level, this.simulation, inputApplier, gameEndDetector, { }, 0, null);

		gameEndDetector.gameEnded.on(() => {
			this.scene.gameOverOverlay.clicked.on(() => {
				sceneGroup.destroy();
				console.log('creating');
				this.createSimulationScene(levelNumber + 1);
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