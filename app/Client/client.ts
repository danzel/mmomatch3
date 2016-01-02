/// <reference path="../../typings/primus/primusClient.d.ts" />
import ISerializer = require('../Serializer/iSerializer')
import LiteEvent = require('../liteEvent');
import Simulation = require('../Simulation/simulation');

class Client {
	private serializer: ISerializer;
	
	simulationReceived = new LiteEvent<Simulation>();
	
	private haveReceivedSimulation: boolean;
	
	constructor(url: string, serializer: ISerializer) {
		this.serializer = serializer;
		
		console.log('connecting');
		let primus = Primus.connect(url, {
			//Options?
		});

		primus.on('open', function(data) { console.log('open', data); });
		primus.on('data', this.dataReceived, this);

		//setTimeout(function() {
		//	console.log('sending');
		//	primus.write('hello world');
		//}, 2000);
	}
	
	dataReceived(data: any) {
		if (!this.haveReceivedSimulation) {
			var simulation = this.serializer.deserialize(data);
			this.simulationReceived.trigger(simulation);
			this.haveReceivedSimulation = true;
		}
	}
}

export = Client;