import BootData = require('../DataPackets/bootData');
import ClientComms = require('./clientComms');
import GameEndDetector = require('../Simulation/Levels/gameEndDetector');
import FailureType = require('../Simulation/Levels/failureType');
import InitData = require('../DataPackets/initData');
import JoinData = require('../DataPackets/joinData');
import LevelDef = require('../Simulation/Levels/levelDef');
import LiteEvent = require('../liteEvent');
import PacketGenerator = require('../DataPackets/packetGenerator');
import PacketType = require('../DataPackets/packetType');
import RejectData = require('../DataPackets/rejectData');
import Serializer = require('../Serializer/serializer')
import Simulation = require('../Simulation/simulation');
import SwapClientData = require('../DataPackets/swapClientData');
import TickData = require('../DataPackets/tickData');
import UnavailableData = require('../DataPackets/unavailableData');
import VictoryType = require('../Simulation/Levels/victoryType');

class Client {
	private packetGenerator: PacketGenerator = new PacketGenerator();

	private playerId: number;

	connectionRejected = new LiteEvent<RejectData>();
	initReceived = new LiteEvent<InitData>();

	newNamesReceived = new LiteEvent<{ [id: number]: string }>();
	simulationReceived = new LiteEvent<{ level: LevelDef, simulation: Simulation, gameEndDetector: GameEndDetector, endAvailabilityDate: Date }>();
	tickReceived = new LiteEvent<TickData>();
	unavailableReceived = new LiteEvent<UnavailableData>();

	constructor(private clientComms: ClientComms, private version: string, public nickname?: string) {
		if (this.nickname && this.nickname.length > 16) {
			this.nickname = this.nickname.substr(0, 16);
		}

		clientComms.connected.on(() => this.connected())
		clientComms.dataReceived.on(data => this.dataReceived(data))
	}

	sendSwap(leftId: number, rightId: number) {
		this.clientComms.sendSwap(new SwapClientData(leftId, rightId));
	}

	private connected() {
		this.clientComms.sendJoin(new JoinData(this.version, this.nickname || null));
	}

	private levelTypeIsTeamBased(level: LevelDef): boolean {
		if (level.victoryType == VictoryType.MatchXOfColor) {
			return true;
		}
		if (level.victoryType == VictoryType.GetToBottomRace) {
			return true;
		}
		return false;
	}

	private dataReceived(packet: { packetType: PacketType, data: any }) {
		if (packet.packetType == PacketType.Reject) {
			this.connectionRejected.trigger(<RejectData>packet.data);
		} else if (packet.packetType == PacketType.Init) {
			let initData = <InitData>packet.data;

			this.playerId = initData.playerId;
			this.initReceived.trigger(initData);
			this.newNamesReceived.trigger(initData.names);
		} else if (packet.packetType == PacketType.Boot) {
			let bootData = <BootData>packet.data;

			/*let asStr = JSON.stringify(packet);
			console.log('Received Boot, size: ', asStr.length);
			console.log('Received Boot, first 1000: ', asStr.substr(0, 1000));
			console.log('Received Boot, last 1000: ', asStr.substr(asStr.length - 1000));*/

			//SEMI-HACK. If Team based, maybe swap failure/victory based on playerId
			if (this.levelTypeIsTeamBased(bootData.level) && (this.playerId % 2 == 1)) {
				let temp = bootData.level.failureValue;
				bootData.level.failureValue = bootData.level.victoryValue;
				bootData.level.victoryValue = temp;
			}

			this.newNamesReceived.trigger(bootData.names);

			let level = this.packetGenerator.recreateLevelDefData(bootData.level)
			let simulation = this.packetGenerator.recreateSimulation(bootData, level);
			this.simulationReceived.trigger({
				level: level,
				simulation: simulation,
				gameEndDetector: new GameEndDetector(level, simulation),
				endAvailabilityDate: bootData.endAvailabilityDate ? new Date(bootData.endAvailabilityDate) : null
			});
		} else if (packet.packetType == PacketType.Tick) {
			let tickData = <TickData>packet.data;

			/*let asStr = JSON.stringify(packet);
			if (asStr.length > 1000) {
				console.log('Received Tick, size: ', asStr.length);
				console.log('Received Tick, first 1000: ', asStr.substr(0, 1000));
				console.log('Received Tick, last 1000: ', asStr.substr(asStr.length - 1000));
			}*/

			this.newNamesReceived.trigger(tickData.names);
			this.tickReceived.trigger(tickData);
		} else if (packet.packetType == PacketType.Unavailable) {
			this.unavailableReceived.trigger(<UnavailableData>packet.data);
		} else {
			console.warn('Received unexpected packet ', packet);
		}
	}
}

export = Client;