import BootData = require('../DataPackets/bootData');
import ClientComms = require('./clientComms');
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

	simulationReceived = new LiteEvent<{ level: LevelDef, simulation: Simulation }>();
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
			this.simulationReceived.trigger({ level: this.packetGenerator.recreateLevelDefData(bootData.level), simulation: this.packetGenerator.recreateSimulation(bootData) });
			this.playerIdReceived.trigger(bootData.playerId);
		} else if (packet.packetType == PacketType.Tick) {
			this.tickReceived.trigger(<TickData>packet.data);
		} else {
			console.warn('Received unexpected packet ', packet);
		}
	}
}

export = Client;