/// <reference path="../../typings/express/express.d.ts" />
/// <reference path="../../typings/primus/primus.d.ts" />
import express = require('express');
import http = require('http');

import ComboOwnership = require('../Simulation/Scoring/comboOwnership');
import FrameData = require('../DataPackets/frameData');
import Primus = require('primus');
import InputVerifier = require('../Simulation/inputVerifier');
import Matchable = require('../Simulation/matchable');
import Player = require('../Simulation/Scoring/player');
import PlayerProvider = require('../Simulation/Scoring/playerProvider');
import ScoreTracker = require('../Simulation/Scoring/scoreTracker');
import Serializer = require('../Serializer/serializer');
import Simulation = require('../Simulation/simulation');
import SpawnData = require('../DataPackets/spawnData');
import Swap = require('../Simulation/swap');
import SwapClientData = require('../DataPackets/swapClientData');
import SwapServerData = require('../DataPackets/swapServerData');
import TickData = require('../DataPackets/tickData');
import TickDataFactory = require('./tickDataFactory');

class Server {
	private simulation: Simulation;
	private serializer: Serializer;
	private inputVerifier: InputVerifier;
	
	private playerProvider: PlayerProvider = new PlayerProvider();
	private scoreTracker: ScoreTracker;
	private tickDataFactory: TickDataFactory;
	
	private app: express.Express;
	private httpServer: http.Server;
	private primus: Primus;

	private serializedBoot;
	private sparksRequiringBoot: Array<Primus.Spark> = [];
	private bootedSparks: { [id: string]: Player } = {};

	private dataReceivedBound = this.dataReceived.bind(this);
	
	constructor(simulation: Simulation, serializer: Serializer, inputVerifier: InputVerifier) {
		this.simulation = simulation;
		this.serializer = serializer;
		this.inputVerifier = inputVerifier;
		
		this.scoreTracker = new ScoreTracker(new ComboOwnership(this.simulation.grid, this.simulation.swapHandler, this.simulation.matchPerformer, this.simulation.quietColumnDetector));
		this.tickDataFactory = new TickDataFactory(simulation, this.scoreTracker);

		this.app = express();
		this.app.use(express.static('dist'));
		this.httpServer = http.createServer(this.app);
		this.httpServer.listen(8091);
		
		this.primus = new Primus(this.httpServer, {
			pathname: '/sock'
		});

		this.primus.on('connection', this.connectionReceived.bind(this));
		this.primus.on('disconnection', this.connectionDisconnected.bind(this));
	}

	private connectionReceived(spark: Primus.Spark) {
		console.log("connection", spark);
		
		let callback = this.dataReceivedBound;
		spark.on('data', function(data: any) {
			callback(spark, data);
		} );

		if (this.serializedBoot) {
			this.initSparkAsPlayer(spark);
		}
		else {
			this.sparksRequiringBoot.push(spark);
		}
	}
	
	private connectionDisconnected(spark: Primus.Spark) {
		if (this.bootedSparks[spark.id]) {
			delete this.bootedSparks[spark.id];
		} else {
			this.sparksRequiringBoot.splice(this.sparksRequiringBoot.indexOf(spark), 1);
		}
	}

	private dataReceived(spark: Primus.Spark, data: any) {
		console.log("data", data);
		
		var player = this.bootedSparks[spark.id];
		if (!player) {
			console.log("ignoring received data from spark before booted");
			return;
		}

		let swapData = this.serializer.deserializeClientSwap(data);
		
		//Find the two
		let left = this.simulation.grid.findMatchableById(swapData.leftId);
		let right = this.simulation.grid.findMatchableById(swapData.rightId);
		if (left && right) {
			if (this.inputVerifier.swapIsValid(left, right)) {
				this.simulation.swapHandler.swap(player.id, left, right);
			}
		}
	}

	update(dt: number) {
		
		var tickData = this.tickDataFactory.getTickIfReady();

		if (!tickData) {
			return;
		}

		//We should only be sending updates to clients we've already sent a boot to
		var data = this.serializer.serializeTick(tickData);
		var bootedSparks = this.bootedSparks;
		this.primus.forEach(function(spark: Primus.Spark, id) {
			if (bootedSparks[id]) {
				spark.write(data);
			}
		});
		this.serializedBoot = null;

		if (this.sparksRequiringBoot.length > 0) {
			this.serializedBoot = this.serializer.serializeBoot(this.simulation);
			this.sparksRequiringBoot.forEach((spark) => {
				this.initSparkAsPlayer(spark);
			});
			this.sparksRequiringBoot.length = 0;
		}
	}
	
	private initSparkAsPlayer(spark: Primus.Spark) {
		spark.write(this.serializedBoot);
		var player = this.playerProvider.createPlayer();
		spark.write(this.serializer.serializePlayerId(player.id));

		this.bootedSparks[spark.id] = player;

	}
}

export = Server;