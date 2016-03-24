/// <reference path="../../typings/node-dogstatsd/node-dogstatsd.d.ts" />
import StatsD = require('node-dogstatsd');

import GameEndDetector = require('../Simulation/Levels/gameEndDetector');
import LevelDef = require('../Simulation/Levels/levelDef');
import Server = require('./server');
import Simulation = require('../Simulation/simulation');

class DatadogStats {
	private statsd: StatsD.StatsD;

	constructor(private server: Server) {
		this.statsd = new StatsD.StatsD();

		server.levelStarted.on((data) => this.levelStarted(data.level, data.simulation, data.gameEndDetector));
		
		setTimeout(() => this.logPeriodicStats(), 10000);
	}

	private levelStarted(level: LevelDef, simulation: Simulation, gameEndDetector: GameEndDetector) {
		this.statsd.gauge('mmomatch.level', level.levelNumber);
		//Reset the gauges
		this.statsd.gauge('mmomatch.match-total', 0);
		this.statsd.gauge('mmomatch.points-total', 0);
		this.statsd.gauge('mmomatch.swap-total', 0);
		
		simulation.swapHandler.swapStarted.on(() => {
			this.statsd.increment('mmomatch.swap');	
			this.statsd.gauge('mmomatch.swap-total', simulation.swapHandler.totalSwapsCount);	
		});
		simulation.matchPerformer.matchPerformed.on((match) => {
			this.statsd.increment('mmomatch.match', match.matchables.length);
			this.statsd.gauge('mmomatch.match-total', simulation.matchPerformer.totalMatchablesMatched)
			this.statsd.gauge('mmomatch.points-total', simulation.scoreTracker.totalPoints);
		});

		simulation.matchPerformer.swapDidntCauseAMatch.on(() => this.statsd.increment('mmomatch.swap-no-match'));
	}
	
	private logPeriodicStats() {
		this.statsd.gauge('mmomatch.players', this.server.getPlayerCount());
	}
};

export = DatadogStats;