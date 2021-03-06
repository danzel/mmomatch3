/// <reference path="../typings/webfontloader/webfontloader.d.ts" />

import BannerAdManager = require('./HtmlOverlay/bannerAdManager');
import CircleCursor = require('./Scenes/circleCursor');
import DefaultLevelAndSimulationProvider = require('./Server/defaultLevelAndSimulationProvider');
import EmoteProxy = require('./Util/emoteProxy');
import GameEndDetector = require('./Simulation/Levels/gameEndDetector');
import GoodBrowser = require('./goodBrowser');
import GraphicsLoader = require('./Renderer/graphicsLoader');
import HtmlOverlayManager = require('./HtmlOverlay/manager')
import Language = require('./Language');
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
		if (!(<any>window).Phaser) {
			alert('Failed to load Phaser, refreshing the page to fix it');
			window.location.reload(true);
			return;
		}
		Language.init();

		document.getElementById('welcome').style.display = 'none';
		this.levelAndSimulationProvider = new DefaultLevelAndSimulationProvider(new LevelDefFactoryDebug());
		//this.levelAndSimulationProvider = new DefaultLevelAndSimulationProvider(new LevelDefFactoryDynamic1());
		this.game = new Phaser.Game('100%', '100%', Phaser.AUTO, null, this, false, true, null);
	}

	preload() {
		console.log("preload");
		//this.game.stage.disableVisibilityChange = true;
		this.game.scale.scaleMode = Phaser.ScaleManager.RESIZE;
		this.game.scale.fullScreenScaleMode = Phaser.ScaleManager.RESIZE;
		//This method doesn't shrink height when window shrinks, so replace it
		this.game.scale.getParentBounds = function (target?: Phaser.Rectangle) {
			target = target || new Phaser.Rectangle(0, 0, 0, 0);

			target.setTo(0, 0, document.body.clientWidth, document.body.clientHeight);
			return target;
		}
		this.game.stage.backgroundColor = 0x273348;
		CircleCursor.setCursorSafe(this.game, Math.floor(Math.random() * 100));

		GraphicsLoader.load(this.game);
	}

	create() {
		console.log('create');

		let bannerAdManager = new BannerAdManager();
		bannerAdManager.show();

		this.htmlOverlayManager = new HtmlOverlayManager(this.game, bannerAdManager);

		let levelNumber = parseInt((window.location.hash || "#").substr(1), 10) || 1;
		this.createSimulationScene(levelNumber);
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

		let emoteProxy = new EmoteProxy();
		let gameEndDetector = new GameEndDetector(level, this.simulation);
		let inputApplier = new DirectInputApplier(0, this.simulation.swapHandler, this.simulation.inputVerifier, this.simulation.grid, emoteProxy);
		let sceneGroup = this.game.add.group();
		this.scene = new SimulationScene(sceneGroup, this.htmlOverlayManager, level, this.simulation, inputApplier, gameEndDetector, emoteProxy, { disableParticles: true }, 0, {});

		gameEndDetector.gameEnded.on(() => {
			this.scene.gameOverOverlay.clicked.on(() => {
				this.scene.removeFromSimulationRenderer();
				sceneGroup.destroy();
				console.log('creating');
				this.createSimulationScene(levelNumber + 1);
			});
		});
	}
}

if (GoodBrowser) {
	if ((<any>window).WebFont) {
		WebFont.load({
			custom: {
				families: ['Chewy'],
			},
			classes: false,

			active: function () {
				new AppEntry();
			},
			inactive: function () {
				new AppEntry();
			}
		});
	} else {
		new AppEntry();
	}
} else {
	alert('Your browser is too old to play this game. Please download Google Chrome or Mozilla Firefox.');
	window.location.replace('http://outdatedbrowser.com/');
}