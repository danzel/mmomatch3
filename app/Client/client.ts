/// <reference path="../../typings/primus/primusClient.d.ts" />
import ISerializer = require('../Serializer/iSerializer')
import LiteEvent = require('../liteEvent');
import Simulation = require('../Simulation/simulation');
import TickData = require('../DataPackets/tickData');

class Client {
	private serializer: ISerializer;
	
	simulationReceived = new LiteEvent<Simulation>();
	tickReceived = new LiteEvent<TickData>();
	
	private haveReceivedSimulation: boolean;
	
	constructor(url: string, serializer: ISerializer) {
		this.serializer = serializer;
		
		console.log('connecting');
		let primus = Primus.connect(url, {
			//Options?
		});

		primus.on('open', function() { console.log('open'); });
		primus.on('data', this.dataReceived, this);

		//setTimeout(function() {
		//	console.log('sending');
		//	primus.write('hello world');
		//}, 2000);
	}
	
	dataReceived(data: any) {
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