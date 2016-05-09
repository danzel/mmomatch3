/// <reference path="../typings/raven-js/raven-js.d.ts" />
import Raven = require('raven-js');

import CircleCursor = require('./Scenes/circleCursor');
import Client = require('./Client/client');
import ClientSimulationHandler = require('./Client/clientSimulationHandler');
import DebugLogger = require('./debugLogger');
import GameEndDetector = require('./Simulation/Levels/gameEndDetector');
import GoodBrowser = require('./goodBrowser');
import GraphicsLoader = require('./Renderer/graphicsLoader');
import HtmlOverlayManager = require('./HtmlOverlay/manager')
import LevelDef = require('./Simulation/Levels/levelDef');
import Serializer = require('./Serializer/simple');
import Simulation = require('./Simulation/simulation');
import SimulationScene = require('./Scenes/simulationScene');
import SocketClient = require('./Client/socketClient');
import TickData = require('./DataPackets/tickData');
import UnavailableData = require('./DataPackets/unavailableData');
import UnavailableOverlay = require('./Scenes/Unavailable/unavailableOverlay');
import WelcomeScreen = require('./Scenes/WelcomeScreen/welcomeScreen');

let runningOnLive = (window.location.host == window.location.hostname); //Checks we are on standard port (no :8080)

class AppEntry {
	htmlOverlayManager: HtmlOverlayManager;
	unavailableOverlay: UnavailableOverlay;
	client: Client;
	game: Phaser.Game;
	playerId: number;
	simulationHandler: ClientSimulationHandler;

	scene: SimulationScene;
	sceneGroup: Phaser.Group;

	playerNames: { [id: number]: string } = {};

	constructor() {
		this.htmlOverlayManager = new HtmlOverlayManager();
		this.unavailableOverlay = new UnavailableOverlay(this.htmlOverlayManager);

		this.game = new Phaser.Game('100%', '100%', Phaser.AUTO, null, this, false, true, null);
	}

	preload() {
		console.log("preload");
		this.game.stage.disableVisibilityChange = true;
		this.game.scale.scaleMode = Phaser.ScaleManager.RESIZE;
		this.game.stage.backgroundColor = 0x273348;

		GraphicsLoader.load(this.game);
	}

	create() {
		let welcome = new WelcomeScreen(this.htmlOverlayManager);
		welcome.onLogin = (nickname) => {
			this.connect(nickname);
		};
		welcome.show();
	}

	connect(nickname: string) {
		console.log('create');

		let socket: SocketClient;
		if (runningOnLive) { //Standard port
			socket = new SocketClient(window.location.origin, new Serializer());
		} else { //Non-standard port, assume dev and hack for it
			socket = new SocketClient('http://' + window.location.hostname + ':8091', new Serializer());
		}
		this.client = new Client(socket, nickname);
		this.client.initReceived.on(data => {
			this.playerId = data.playerId;
			this.playerNames = {};
			if (nickname) {
				this.playerNames[data.playerId] = nickname;
			}
			CircleCursor.setCursor(this.game, data.playerId);
		})
		this.client.newNamesReceived.on(names => {
			if (names) {
				for (var key in names) {
					this.playerNames[key] = names[key];
				}
			}
		});
		this.client.simulationReceived.on(data => this.simulationReceived(data));
		this.client.tickReceived.on(tick => this.tickReceived(tick));
		this.client.unavailableReceived.on(unavailability => this.unavailableReceived(unavailability));


		this.htmlOverlayManager.setConnectionError(true);
		socket.connected.on(() => this.htmlOverlayManager.setConnectionError(false));
		socket.disconnected.on(() => this.htmlOverlayManager.setConnectionError(true));
	}

	simulationReceived(data: { level: LevelDef, simulation: Simulation, gameEndDetector: GameEndDetector, endAvailabilityDate: Date }) {
		this.unavailableOverlay.hasPlayed = true;
		this.unavailableOverlay.hide();
		if (this.sceneGroup) {
			this.sceneGroup.destroy();
		}
		this.simulationHandler = new ClientSimulationHandler(data.level, data.simulation, data.gameEndDetector, this.client, 1 / 60);

		this.sceneGroup = this.game.add.group();
		this.scene = new SimulationScene(this.sceneGroup, this.htmlOverlayManager, data.level, this.simulationHandler.simulation, this.simulationHandler.inputApplier, this.simulationHandler.gameEndDetector, { gameOverCountdown: 5 }, this.playerId, this.playerNames, data.endAvailabilityDate);
		//new DebugLogger(data.simulation);
	}

	tickReceived(tickData: TickData) {
		this.simulationHandler.tickReceived(tickData);

		if (tickData.playerCount) {
			this.scene.playerCount = tickData.playerCount;
		}
	}

	unavailableReceived(data: UnavailableData) {
		if (this.sceneGroup) {
			this.sceneGroup.destroy();
			this.sceneGroup = null;
		}
		this.simulationHandler = null;
		this.scene = null;

		this.unavailableOverlay.show(data.nextAvailableDate);
	}

	update() {
		if (this.simulationHandler) {
			if (!this.simulationHandler.update()) {
				return;
			}
		}

		if (this.scene) {
			this.scene.update();
		}
	}

	preRender() {
		if (this.scene) {
			this.scene.preRender();
		}
	}
}

if (runningOnLive) {
	//Find our release
	let scripts = document.getElementsByTagName("script");
	let release = '';
	for (var i = 0; i < scripts.length; i++) {
		let index = scripts[i].src.indexOf('bundle.js?');
		if (index >= 0) {
			release = scripts[i].src.substr(index + 10);
		}
	}
	Raven.config('https://85f0d002c2ab4b5f811e6dfae46fa0b0@app.getsentry.com/76603', {
		release
	}).install();
}
if (GoodBrowser) {
	WebFont.load({
		/*custom: {
			families: ['Chewy'],
			urls: ['img/skin/emojione-animals/chewy.css']
		},*/
		google: {
			families: ['Chewy']
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
	alert('Your browser is too old to play this game. Please download Google Chrome or Mozilla Firefox.');
	window.location.replace('http://outdatedbrowser.com/');
}