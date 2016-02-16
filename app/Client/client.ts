/// <reference path="../../typings/primus/primusClient.d.ts" />
import BootData = require('../DataPackets/bootData');
import LevelDef = require('../Simulation/Levels/levelDef');
import LiteEvent = require('../liteEvent');
import PacketGenerator = require('../DataPackets/packetGenerator');
import PacketType = require('../DataPackets/packetType');
import Serializer = require('../Serializer/serializer')
import Simulation = require('../Simulation/simulation');
import SwapClientData = require('../DataPackets/swapClientData');
import TickData = require('../DataPackets/tickData');

class Client {
	private serializer: Serializer;
	
	private packetGenerator: PacketGenerator = new PacketGenerator();
	private primus: Primus;
	
	simulationReceived = new LiteEvent<{ level: LevelDef, simulation: Simulation }>();
	playerIdReceived = new LiteEvent<number>();
	tickReceived = new LiteEvent<TickData>();
	
	constructor(url: string, serializer: Serializer) {
		this.serializer = serializer;
		
		console.log('connecting');
		this.primus = Primus.connect(url, {
			//Options?
		});

		this.primus.on('open', function() { console.log('open'); });
		this.primus.on('data', this.dataReceived, this);
	}
	
	sendSwap(leftId: number, rightId: number) {
		this.primus.write(this.serializer.serializeClientSwap(new SwapClientData(leftId, rightId)));
	}
	
	private dataReceived(data: any) {
		console.log('data');
		let packet = this.serializer.deserialize(data);
		
		if (packet.packetType == PacketType.Boot) {
			let bootData = <BootData>packet.data;
			this.simulationReceived.trigger({ level: this.packetGenerator.recreateLevelDefData(bootData.level), simulation: this.packetGenerator.recreateSimulation(bootData) });
			this.playerIdReceived.trigger(bootData.playerId);
		}
		else if (packet.packetType == PacketType.Tick) {
			this.tickReceived.trigger(<TickData>packet.data);
		} else {
			console.warn('Received unexpected packet ', packet);
		}
	}
}

export = Client;