/// <reference path="../../typings/winston/winston.d.ts" />
import winston = require('winston');

import FailureType = require('../Simulation/Levels/failureType');
import LevelDef = require('../Simulation/Levels/levelDef');
import GameEndDetector = require('../Simulation/Levels/gameEndDetector');
import Server = require('./server');
import ServerComms = require('./serverComms');
import Simulation = require('../Simulation/simulation');
import VictoryType = require('../Simulation/Levels/victoryType');

class ServerLogger {
	logger: winston.LoggerInstance;

	constructor(private server: Server, serverComms: ServerComms) {

		this.logger = new winston.Logger({
			transports: [
				new (winston.transports.Console)({
					colorize: true,
					timestamp: true,
				}),
				new (winston.transports.File)({
					filename: 'serverlogs.log',
					json: false,
					prettyPrint: true
				})
			]
		});

		this.logger.info("Server Started");

		server.levelStarted.on(data => this.levelStarted(data));
		server.playerJoined.on(p => this.logger.log('info', 'Player Joined ', { id: p.id, name: p.name }));
		server.playerLeft.on(p => this.logger.log('info', 'Player Left ', { id: p.id, name: p.name }));

		server.warning.on(data => this.logger.log('warn', "Server: " + data.str, data.data));
		serverComms.warning.on(data => this.logger.log('warn', "ServerComms: " + data.str, data.data));
	}

	private levelStarted(data: { level: LevelDef, simulation: Simulation, gameEndDetector: GameEndDetector }) {
		this.logger.log('info', "Level Started", {
			levelNumber: data.level.levelNumber,
			width: data.level.width,
			height: data.level.height,
			colorCount: data.level.colorCount,
			holes: data.level.holes.length,

			failureType: FailureType[data.level.failureType],
			failureValue: this.encodeFailureValue(data.level.failureType, data.level.failureValue),
			victoryType: VictoryType[data.level.victoryType],
			victoryValue: this.encodeVictoryValue(data.level.victoryType, data.level.victoryValue),

			playerCount: this.server.getPlayerCount(),
			extra: data.level.extraData
		});

		data.gameEndDetector.gameEnded.on(victory => {
			this.logger.log('info', "Game Over", {
				levelNumber: data.level.levelNumber,
				victory: victory,
				playerCount: this.server.getPlayerCount(),
				swapsUsed: data.simulation.swapHandler.totalSwapsCount,
				timeUsed: data.simulation.timeRunning
			});
		})
	}

	private encodeFailureValue(failureType: FailureType, failureValue: any): any {
		switch (failureType) {
			default:
				return failureValue;
		}
	}

	private encodeVictoryValue(victoryType: VictoryType, victoryValue: any): any {
		switch (victoryType) {
			case VictoryType.RequireMatch:
				return (<Array<any>>victoryValue).length;
			default:
				return victoryValue;
		}
	}
}

export = ServerLogger;