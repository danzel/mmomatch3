import fs = require('fs');

import Bot = require('./Bot/bot');
import Client = require('./Client/client');
import ClientSimulationHandler = require('./Client/clientSimulationHandler');
import DebugLogger = require('./debugLogger');
import GameEndDetector = require('./Simulation/Levels/gameEndDetector');
import LevelDef = require('./Simulation/Levels/levelDef');
import Serializer = require('./Serializer/simple');
import Simulation = require('./Simulation/simulation');
import SocketClient = require('./Client/socketClient');
import TickData = require('./DataPackets/tickData');

let release = '6db9c79b77a1b4551b20';

let logPackets = true; 
class NodeSocketClient extends SocketClient {
	protected getPrimus() {
		return <any>require('../primus.js');
	}
	
	protected getOptions(): any {
		return {
			transport: {
				origin: 'https://massivematch.io'
			}
		};
	}
	
	protected primusDataReceived(data: any) {
		if (logPackets) {
			fs.appendFileSync('packets.log', new Date().getTime() + "\n" + JSON.stringify(data) + "\n");
		}
		super.primusDataReceived(data);
	}
};

class AppEntry {
	client: Client;
	playerId: number;
	simulationHandler: ClientSimulationHandler;

	hideNames: boolean;
	playerNames: { [id: number]: string } = {};

	bot: Bot;

	constructor(private beABot: boolean, nickname?: string) {
		this.connect(nickname);
	}

	connect(nickname: string) {
		console.log('create');

		let socket = new NodeSocketClient('https://massivematch.io', new Serializer());
		this.client = new Client(socket, release, null, nickname);
		this.client.connectionRejected.on(rejectData => {
			//One day... rejectData.reason
			console.log('connection rejected');
		})
		this.client.initReceived.on(data => {
			this.playerId = data.playerId;
			this.playerNames = {};
			if (nickname) {
				this.playerNames[data.playerId] = nickname;
			}
		})
		this.client.newNamesReceived.on(names => {
			if (names && !this.hideNames) {
				for (var key in names) {
					this.playerNames[key] = names[key];
				}
			}
		});
		this.client.simulationReceived.on(data => this.simulationReceived(data));
		this.client.tickReceived.on(tick => this.tickReceived(tick));

		socket.connected.on(() => console.log('connected'));
		socket.disconnected.on(() => console.log('disconnected'));
	}

	simulationReceived(data: { level: LevelDef, simulation: Simulation, gameEndDetector: GameEndDetector }) {
		this.simulationHandler = new ClientSimulationHandler(data.level, data.simulation, data.gameEndDetector, this.client, 1 / 60);

		if (this.beABot) {
			this.bot = new Bot(data.level, data.simulation, this.simulationHandler.inputApplier);
		}
	}

	tickReceived(tickData: TickData) {
		this.simulationHandler.tickReceived(tickData);

		while (this.simulationHandler.update()) {
			if (this.bot) {
				this.bot.update(1 / 60);
			}
		}

	}
}

new AppEntry(true, '');