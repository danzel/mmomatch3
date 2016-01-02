/// <reference path="../../typings/primus/primus.d.ts" />
import http = require('http');

import ISerializer = require('../Serializer/iSerializer');
import Primus = require('primus');
import Simulation = require('../Simulation/simulation');
import TickData = require('../DataPackets/tickData');

class Server {
	private simulation: Simulation;
	private serializer: ISerializer;
	
	private httpServer: http.Server;
	private primus: Primus;
	
	private lastFramesElapsed: number;
	
	constructor(simulation: Simulation, serializer: ISerializer) {
		this.simulation = simulation;
		this.serializer = serializer;
		this.lastFramesElapsed = this.simulation.framesElapsed;
		
		this.httpServer = http.createServer(this.requestListener.bind(this));
		this.httpServer.listen(8091);

		this.primus = new Primus(this.httpServer, {
		});

		this.primus.on('connection', this.connectionReceived.bind(this));
	}
	
	connectionReceived(spark: Primus.Spark) {
		console.log("connection", spark);
		spark.write(this.serializer.serializeBoot(this.simulation));
		
		spark.on('data', function(data) {
			console.log("data", data);
			//TODO: Do something
		})
	}
	
	requestListener(request: http.IncomingMessage, response: http.ServerResponse) {
		
	}
	
	update(dt: number) {
		let elapsed = this.simulation.framesElapsed - this.lastFramesElapsed;
		
		if (elapsed == 0)
			return;
		
		this.lastFramesElapsed = this.simulation.framesElapsed;
		
		console.log('sending tick ' + elapsed);
		this.primus.write(this.serializer.deserializeTick(new TickData(elapsed, []))); //TODO: Swaps
	}
}

export = Server;