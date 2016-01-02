/// <reference path="../../typings/primus/primus.d.ts" />
import http = require('http');
import Primus = require('primus');
import Simulation = require('../Simulation/simulation');
import ISerializer = require('../Serializer/iSerializer');

class Server {
	private simulation: Simulation;
	private serializer: ISerializer;
	
	private httpServer: http.Server;
	private primus: Primus;
	
	constructor(simulation: Simulation, serializer: ISerializer) {
		this.simulation = simulation;
		this.serializer = serializer;
		
		this.httpServer = http.createServer(this.requestListener.bind(this));
		this.httpServer.listen(8091);

		this.primus = new Primus(this.httpServer, {
		});

		this.primus.on('connection', this.connectionReceived.bind(this));
	}
	
	connectionReceived(spark: Primus.Spark) {
		console.log("connection", spark);
		spark.write(this.serializer.serialize(this.simulation));
		
		spark.on('data', function(data) {
			console.log("data", data);
			//TODO: Do something
		})
	}
	
	requestListener(request: http.IncomingMessage, response: http.ServerResponse) {
		
	}
	
	update(dt: number) {
		
	}
}

export = Server;