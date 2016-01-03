/// <reference path="../../typings/primus/primus.d.ts" />
import http = require('http');

import FrameData = require('../DataPackets/frameData');
import ISerializer = require('../Serializer/iSerializer');
import Primus = require('primus');
import InputVerifier = require('../Simulation/inputVerifier');
import Matchable = require('../Simulation/matchable');
import Simulation = require('../Simulation/simulation');
import SpawnData = require('../DataPackets/spawnData');
import Swap = require('../Simulation/swap');
import SwapData = require('../DataPackets/swapData');
import TickData = require('../DataPackets/tickData');

class Server {
	private simulation: Simulation;
	private serializer: ISerializer;
	private inputVerifier: InputVerifier;
	
	private httpServer: http.Server;
	private primus: Primus;
	
	private lastSentFramesElapsed: number;
	private frameData: { [frame: number]: FrameData} = {};
	
	constructor(simulation: Simulation, serializer: ISerializer, inputVerifier: InputVerifier) {
		this.simulation = simulation;
		this.serializer = serializer;
		this.inputVerifier = inputVerifier;
		this.lastSentFramesElapsed = this.simulation.framesElapsed;
		
		this.httpServer = http.createServer(this.requestListener.bind(this));
		this.httpServer.listen(8091);
		this.primus = new Primus(this.httpServer);

		this.primus.on('connection', this.connectionReceived.bind(this));
		this.simulation.swapHandler.swapStarted.on(this.onSwapStarted.bind(this))
		this.simulation.spawnManager.matchableSpawned.on(this.onMatchableSpawned.bind(this))
	}
	
	private connectionReceived(spark: Primus.Spark) {
		console.log("connection", spark);
		spark.write(this.serializer.serializeBoot(this.simulation));
		
		spark.on('data', this.dataReceived.bind(this));
	}
	
	onSwapStarted(swap: Swap) {
		this.ensureFrameData().swapData.push(new SwapData(swap.left.id, swap.right.id));
	}
	
	onMatchableSpawned(matchable: Matchable) {
		this.ensureFrameData().spawnData.push(new SpawnData(matchable.id, matchable.x, matchable.y, matchable.color));
	}
	
	private ensureFrameData(): FrameData {
		var frame = this.simulation.framesElapsed - this.lastSentFramesElapsed;
		if (!this.frameData[frame]) {
			this.frameData[frame] = new FrameData();
		}
		return this.frameData[frame];
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
		let elapsed = this.simulation.framesElapsed - this.lastSentFramesElapsed;
		
		if (elapsed == 0)
			return;
		
		this.lastSentFramesElapsed = this.simulation.framesElapsed;
		
		//console.log('sending tick ' + elapsed);
		this.primus.write(this.serializer.serializeTick(new TickData(elapsed, this.frameData)));
		
		this.frameData = {};
	}
}

export = Server;