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
import Serializer = require('../Serializer/serializer')
import Simulation = require('../Simulation/simulation');
import SwapClientData = require('../DataPackets/swapClientData');
import TickData = require('../DataPackets/tickData');
import UnavailableData = require('../DataPackets/unavailableData');
import VictoryType = require('../Simulation/Levels/victoryType');

class Client {
	private packetGenerator: PacketGenerator = new PacketGenerator();

	private playerId: number;

	initReceived = new LiteEvent<InitData>();
	newNamesReceived = new LiteEvent<{ [id: number]: string }>();
	simulationReceived = new LiteEvent<{ level: LevelDef, simulation: Simulation, gameEndDetector: GameEndDetector, endAvailabilityDate: Date }>();
	tickReceived = new LiteEvent<TickData>();
	unavailableReceived = new LiteEvent<UnavailableData>();

	constructor(private clientComms: ClientComms, public nickname?: string) {
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
		this.clientComms.sendJoin(new JoinData(this.nickname || null));
	}

	private dataReceived(packet: { packetType: PacketType, data: any }) {
		if (packet.packetType == PacketType.Init) {
			let initData = <InitData>packet.data;

			this.playerId = initData.playerId;
			this.initReceived.trigger(initData);
			this.newNamesReceived.trigger(initData.names);
		} else if (packet.packetType == PacketType.Boot) {
			let bootData = <BootData>packet.data;

			//SEMI-HACK. If Pigs vs Pugs, maybe swap failure/victory based on playerId
			if (bootData.level.failureType == FailureType.MatchXOfColor && bootData.level.victoryType == VictoryType.MatchXOfColor && (this.playerId % 2 == 1)) {
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