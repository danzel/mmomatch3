import BootData = require('../DataPackets/bootData');
import ClientComms = require('./clientComms');
import GameEndDetector = require('../Simulation/Levels/gameEndDetector');
import FailureType = require('../Simulation/Levels/failureType');
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

	simulationReceived = new LiteEvent<{ level: LevelDef, simulation: Simulation, gameEndDetector: GameEndDetector, playerId: number, endAvailabilityDate: Date }>();
	tickReceived = new LiteEvent<TickData>();
	unavailableReceived = new LiteEvent<UnavailableData>();

	constructor(private clientComms: ClientComms) {
		clientComms.dataReceived.on(data => this.dataReceived(data))
	}

	sendSwap(leftId: number, rightId: number) {
		this.clientComms.sendSwap(new SwapClientData(leftId, rightId));
	}

	private dataReceived(packet: { packetType: PacketType, data: any }) {
		if (packet.packetType == PacketType.Boot) {
			let bootData = <BootData>packet.data;
			
			//SEMI-HACK. If Pigs vs Pugs, maybe swap failure/victory based on playerId
			if (bootData.level.failureType == FailureType.MatchXOfColor && bootData.level.victoryType == VictoryType.MatchXOfColor && (bootData.playerId % 2 == 1)) {
				let temp = bootData.level.failureValue;
				bootData.level.failureValue = bootData.level.victoryValue;
				bootData.level.victoryValue = temp;
			}

			let level = this.packetGenerator.recreateLevelDefData(bootData.level)
			let simulation = this.packetGenerator.recreateSimulation(bootData);
			this.simulationReceived.trigger({
				level: level,
				simulation: simulation,
				gameEndDetector: new GameEndDetector(level, simulation),
				playerId: bootData.playerId,
				endAvailabilityDate: bootData.endAvailabilityDate ? new Date(bootData.endAvailabilityDate) : null
			});
		} else if (packet.packetType == PacketType.Tick) {
			this.tickReceived.trigger(<TickData>packet.data);
		} else if (packet.packetType == PacketType.Unavailable) {
			this.unavailableReceived.trigger(<UnavailableData>packet.data);
		} else {
			console.warn('Received unexpected packet ', packet);
		}
	}
}

export = Client;