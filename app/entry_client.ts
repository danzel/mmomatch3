import Client = require('./Client/client');
import ClientSimulationHandler = require('./Client/clientSimulationHandler');
import DebugLogger = require('./debugLogger');
import GraphicsLoader = require('./Renderer/graphicsLoader');
import LevelDef = require('./Simulation/Levels/levelDef');
import Scene = require('./Scenes/scene');
import Serializer = require('./Serializer/simple');
import Simulation = require('./Simulation/simulation');
import SimulationScene = require('./Scenes/simulationScene');
import SocketClient = require('./Client/socketClient');
import TickData = require('./DataPackets/tickData');

class AppEntry {
	client: Client;
	game: Phaser.Game;
	simulationHandler: ClientSimulationHandler;

	scene: Scene;
	sceneGroup: Phaser.Group;

	constructor() {
		this.game = new Phaser.Game('100%', '100%', Phaser.AUTO, null, this, false, true, null);
	}

	preload() {
		console.log("preload");
		this.game.stage.disableVisibilityChange = true;
		this.game.scale.scaleMode = Phaser.ScaleManager.RESIZE;

		GraphicsLoader.loadBalls(this.game, 'basic', 11);
	}

	create() {
		console.log('create');
		
		let socket = new SocketClient(window.location.origin, new Serializer());
		//let socket = new SocketClient('http://' + window.location.hostname + ':8091', new Serializer());
		this.client = new Client(socket);
		this.client.simulationReceived.on(data => this.simulationReceived(data));
		this.client.tickReceived.on(tick => this.tickReceived(tick));
		this.client.playerIdReceived.on(playerId => this.playerIdReceived(playerId));
	}

	simulationReceived(data: { level: LevelDef, simulation: Simulation }) {
		if (this.sceneGroup) {
			this.sceneGroup.destroy();
		}
		this.simulationHandler = new ClientSimulationHandler(data.level, data.simulation, this.client, 1 / 60);

		this.sceneGroup = this.game.add.group();
		this.scene = new SimulationScene(this.sceneGroup, data.level, this.simulationHandler.simulation, this.simulationHandler.inputApplier, this.simulationHandler.gameEndDetector, { gameOverCountdown: 5 });
		//new DebugLogger(data.simulation);
	}

	playerIdReceived(playerId: number) {
		(<SimulationScene>this.scene).scoreRenderer.notifyPlayerId(playerId); //TODO: Unhack assumption of child scene
	}

	tickReceived(tickData: TickData) {
		this.simulationHandler.tickReceived(tickData);
		
		//This should really be applied at the end of playing the frameQueue
		if (tickData.points) {
			(<SimulationScene>this.scene).scoreRenderer.updateData(tickData.points); //TODO: Unhack assumption of child scene
		}
		if (tickData.playerCount) {
			(<SimulationScene>this.scene).playerCountRenderer.updateData(tickData.playerCount); //TODO: Unhack assumption of child scene
		}
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
}

new AppEntry();