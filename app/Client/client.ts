import BootData = require('../DataPackets/bootData');
import ClientComms = require('./clientComms');
import GameEndDetector = require('../Simulation/Levels/GameEndDetector');
import LevelDef = require('../Simulation/Levels/levelDef');
import LiteEvent = require('../liteEvent');
import PacketGenerator = require('../DataPackets/packetGenerator');
import PacketType = require('../DataPackets/packetType');
import Serializer = require('../Serializer/serializer')
import Simulation = require('../Simulation/simulation');
import SwapClientData = require('../DataPackets/swapClientData');
import TickData = require('../DataPackets/tickData');

class Client {
	private packetGenerator: PacketGenerator = new PacketGenerator();

	simulationReceived = new LiteEvent<{ level: LevelDef, simulation: Simulation, gameEndDetector: GameEndDetector }>();
	playerIdReceived = new LiteEvent<number>();
	tickReceived = new LiteEvent<TickData>();

	constructor(private clientComms: ClientComms) {
		clientComms.dataReceived.on(data => this.dataReceived(data))
	}

	sendSwap(leftId: number, rightId: number) {
		this.clientComms.sendSwap(new SwapClientData(leftId, rightId));
	}

	private dataReceived(packet: { packetType: PacketType, data: any }) {
		if (packet.packetType == PacketType.Boot) {
			let bootData = <BootData>packet.data;
			let level = this.packetGenerator.recreateLevelDefData(bootData.level)
			let simulation = this.packetGenerator.recreateSimulation(bootData);
			this.simulationReceived.trigger({
				level: level,
				simulation: simulation,
				gameEndDetector: new GameEndDetector(level, simulation)
			});
			this.playerIdReceived.trigger(bootData.playerId);
		} else if (packet.packetType == PacketType.Tick) {
			this.tickReceived.trigger(<TickData>packet.data);
		} else {
			console.warn('Received unexpected packet ', packet);
		}
	}
}

export = Client;