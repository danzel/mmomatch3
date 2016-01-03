/// <reference path="../../typings/primus/primus.d.ts" />
import http = require('http');

import ISerializer = require('../Serializer/iSerializer');
import Primus = require('primus');
import InputVerifier = require('../Simulation/inputVerifier');
import Simulation = require('../Simulation/simulation');
import Swap = require('../Simulation/swap');
import SwapData = require('../DataPackets/swapData');
import TickData = require('../DataPackets/tickData');

class Server {
	private simulation: Simulation;
	private serializer: ISerializer;
	private inputVerifier: InputVerifier;
	
	private httpServer: http.Server;
	private primus: Primus;
	
	private lastFramesElapsed: number;
	private swapsStarted = new Array<SwapData>();
	
	constructor(simulation: Simulation, serializer: ISerializer, inputVerifier: InputVerifier) {
		this.simulation = simulation;
		this.serializer = serializer;
		this.inputVerifier = inputVerifier;
		this.lastFramesElapsed = this.simulation.framesElapsed;
		
		this.httpServer = http.createServer(this.requestListener.bind(this));
		this.httpServer.listen(8091);
		this.primus = new Primus(this.httpServer);

		this.primus.on('connection', this.connectionReceived.bind(this));
		this.simulation.swapHandler.swapStarted.on(this.onSwapStarted.bind(this))
	}
	
	connectionReceived(spark: Primus.Spark) {
		console.log("connection", spark);
		spark.write(this.serializer.serializeBoot(this.simulation));
		
		spark.on('data', this.dataReceived.bind(this));
	}
	
	onSwapStarted(swap: Swap) {
		this.swapsStarted.push(new SwapData(swap.left.id, swap.right.id));
	}
	
	private requestListener(request: http.IncomingMessage, response: http.ServerResponse) {
		
	}
	
	private dataReceived(data: any) {
		console.log("data", data);
		
		let swapData = this.serializer.deserializeSwap(data);
		
		//Find the two
		let left = this.simulation.grid.findMatchableId(swapData.leftId);
		let right = this.simulation.grid.findMatchableId(swapData.rightId);
		if (left && right) {
			if (this.inputVerifier.swapIsValid(left.x, left.y, right.x, right.y)) {
				this.simulation.swapHandler.swap(left.x, left.y, right.x, right.y);
			}
		}
	}
	
	update(dt: number) {
		let elapsed = this.simulation.framesElapsed - this.lastFramesElapsed;
		
		if (elapsed == 0)
			return;
		
		this.lastFramesElapsed = this.simulation.framesElapsed;
		
		console.log('sending tick ' + elapsed);
		this.primus.write(this.serializer.deserializeTick(new TickData(elapsed, this.swapsStarted)));
		
		this.swapsStarted.length = 0;
	}
}

export = Server;