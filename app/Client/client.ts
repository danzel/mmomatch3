/// <reference path="../../typings/primus/primusClient.d.ts" />
import ISerializer = require('../Serializer/iSerializer')
import LiteEvent = require('../liteEvent');
import Simulation = require('../Simulation/simulation');
import SwapClientData = require('../DataPackets/swapClientData');
import TickData = require('../DataPackets/tickData');

class Client {
	private serializer: ISerializer;
	
	private primus: Primus;
	
	simulationReceived = new LiteEvent<Simulation>();
	tickReceived = new LiteEvent<TickData>();
	
	private haveReceivedSimulation: boolean;
	
	constructor(url: string, serializer: ISerializer) {
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
		if (!this.haveReceivedSimulation) {
			let bootData = this.serializer.deserializeBoot(data);
			this.simulationReceived.trigger(bootData.simulation);
			
			this.haveReceivedSimulation = true;
		}
		else {
			var tickData = this.serializer.deserializeTick(data);
			
			this.tickReceived.trigger(tickData);
		}
	}
}

export = Client;