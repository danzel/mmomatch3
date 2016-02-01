/// <reference path="../../typings/primus/primusClient.d.ts" />
import BootData = require('../DataPackets/bootData');
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
	
	simulationReceived = new LiteEvent<Simulation>();
	playerIdReceived = new LiteEvent<number>();
	tickReceived = new LiteEvent<TickData>();
	
	private haveReceivedSimulation: boolean;
	private haveReceivedPlayerId: boolean;
	
	constructor(url: string, serializer: Serializer) {
		this.serializer = serializer;
		
		console.log('connecting');
		this.primus = Primus.connect(url, {
			//Options?
		});

		this.primus.on('open', function() { console.log('open'); });
		this.primus.on('data', this.dataReceived, this);

		//setTimeout(function() {
		//	console.log('sending');
		//	primus.write('hello world');
		//}, 2000);
	}
	
	sendSwap(leftId: number, rightId: number) {
		this.primus.write(this.serializer.serializeClientSwap(new SwapClientData(leftId, rightId)));
	}
	
	private dataReceived(data: any) {
		console.log('data');
		let packet = this.serializer.deserialize(data);
		
		if (!this.haveReceivedSimulation && packet.packetType == PacketType.boot) {
			this.simulationReceived.trigger(this.packetGenerator.recreateSimulation(<BootData>packet.data));
			
			this.haveReceivedSimulation = true;
		} else if (!this.haveReceivedPlayerId && packet.packetType == PacketType.playerId) {
			var playerId = <number>packet.data;
			this.playerIdReceived.trigger(playerId);
			
			this.haveReceivedPlayerId = true;
		}
		else if (packet.packetType == PacketType.tick) {
			this.tickReceived.trigger(<TickData>packet.data);
		} else {
			console.warn('Received unexpected packet ', packet);
		}
	}
}

export = Client;