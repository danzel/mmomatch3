/// <reference path="../../typings/primus/primus.d.ts" />
import http = require('http');
import Primus = require('primus');

class Server {
	constructor() {
		let server = http.createServer(this.requestListener.bind(this));
		server.listen(8091);

		let primus = new Primus(server, {
		});

		primus.on('connection', function(spark: Primus.Spark) {
			console.log("connection", spark);
			
			spark.on('data', function(data) {
				console.log("data", data);
			})

		});
	}
	
	requestListener(request: http.IncomingMessage, response: http.ServerResponse) {
		
	}
	
	update(dt: number) {
		
	}
}

export = Server;