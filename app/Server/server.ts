/// <reference path="../../typings/express/express.d.ts" />
/// <reference path="../../typings/primus/primus.d.ts" />
import express = require('express');
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

	private app: express.Express;
	private httpServer: http.Server;
	private primus: Primus;

	private lastSentFramesElapsed: number;
	private frameData: { [frame: number]: FrameData } = {};

	private serializedBoot;
	private sparksRequiringBoot: Array<Primus.Spark> = [];
	private bootedSparks: { [id: string]: boolean } = {};

	constructor(simulation: Simulation, serializer: ISerializer, inputVerifier: InputVerifier) {
		this.simulation = simulation;
		this.serializer = serializer;
		this.inputVerifier = inputVerifier;
		this.lastSentFramesElapsed = this.simulation.framesElapsed;

		this.app = express();
		this.app.use(express.static('dist'));
		this.httpServer = http.createServer(this.app);
		this.httpServer.listen(8091);
		
		this.primus = new Primus(this.httpServer, {
			pathname: '/sock'
		});

		this.primus.on('connection', this.connectionReceived.bind(this));
		this.simulation.swapHandler.swapStarted.on(this.onSwapStarted.bind(this))
		this.simulation.spawnManager.matchableSpawned.on(this.onMatchableSpawned.bind(this))
	}

	private connectionReceived(spark: Primus.Spark) {
		console.log("connection", spark);
		spark.on('data', this.dataReceived.bind(this));

		if (this.serializedBoot) {
			spark.write(this.serializedBoot);
			this.bootedSparks[spark.id] = true
		}
		else {
			this.sparksRequiringBoot.push(spark);
		}
	}

	onSwapStarted(swap: Swap) {
		this.ensureFrameData().swapData.push(new SwapData(swap.left.id, swap.right.id));
	}

	onMatchableSpawned(matchable: Matchable) {
		this.ensureFrameData().spawnData.push(new SpawnData(matchable.x, matchable.color));
	}

	private ensureFrameData(): FrameData {
		var frame = this.simulation.framesElapsed - this.lastSentFramesElapsed;
		if (!this.frameData[frame]) {
			this.frameData[frame] = new FrameData();
		}
		return this.frameData[frame];
	}

	private dataReceived(data: any) {
		console.log("data", data);

		let swapData = this.serializer.deserializeSwap(data);
		
		//Find the two
		let left = this.simulation.grid.findMatchableById(swapData.leftId);
		let right = this.simulation.grid.findMatchableById(swapData.rightId);
		if (left && right) {
			if (this.inputVerifier.swapIsValid(left, right)) {
				this.simulation.swapHandler.swap(left, right);
			}
		}
	}

	update(dt: number) {
		let elapsed = this.simulation.framesElapsed - this.lastSentFramesElapsed;

		if (elapsed < 2)
			return;

		this.lastSentFramesElapsed = this.simulation.framesElapsed;

		//We should only be sending updates to clients we've already sent a boot to
		var data = this.serializer.serializeTick(new TickData(elapsed, this.frameData));
		var bootedSparks = this.bootedSparks;
		this.primus.forEach(function(spark: Primus.Spark, id) {
			if (bootedSparks[id]) {
				spark.write(data);
			}
		});
		this.frameData = {};
		this.serializedBoot = null;

		if (this.sparksRequiringBoot.length > 0) {
			this.serializedBoot = this.serializer.serializeBoot(this.simulation);
			this.sparksRequiringBoot.forEach((spark) => {
				spark.write(this.serializedBoot);
				this.bootedSparks[spark.id] = true
			});
			this.sparksRequiringBoot.length = 0;
		}
	}
}

export = Server;