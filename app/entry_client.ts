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

class AppEntry {
	htmlOverlayManager: HtmlOverlayManager;
	unavailableOverlay: UnavailableOverlay;
	client: Client;
	game: Phaser.Game;
	simulationHandler: ClientSimulationHandler;

	scene: SimulationScene;
	sceneGroup: Phaser.Group;

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
			this.connect();
		};
		welcome.show();
	}

	connect() {
		console.log('create');

		let socket: SocketClient;
		if (window.location.host == window.location.hostname) { //Standard port
			socket = new SocketClient(window.location.origin, new Serializer());
		} else { //Non-standard port
			socket = new SocketClient('http://' + window.location.hostname + ':8091', new Serializer());
		}
		this.client = new Client(socket);
		this.client.simulationReceived.on(data => this.simulationReceived(data));
		this.client.tickReceived.on(tick => this.tickReceived(tick));
		this.client.unavailableReceived.on(unavailability => this.unavailableReceived(unavailability));
	}

	simulationReceived(data: { level: LevelDef, simulation: Simulation, gameEndDetector: GameEndDetector, playerId: number, endAvailabilityDate: Date }) {
		this.unavailableOverlay.hasPlayed = true;
		this.unavailableOverlay.hide();
		if (this.sceneGroup) {
			this.sceneGroup.destroy();
		}
		this.simulationHandler = new ClientSimulationHandler(data.level, data.simulation, data.gameEndDetector, this.client, 1 / 60);

		this.sceneGroup = this.game.add.group();
		this.scene = new SimulationScene(this.sceneGroup, this.htmlOverlayManager, data.level, this.simulationHandler.simulation, this.simulationHandler.inputApplier, this.simulationHandler.gameEndDetector, { gameOverCountdown: 5 }, data.playerId, data.endAvailabilityDate);
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