/// <reference path="../../typings/winston/winston.d.ts" />
import winston = require('winston');

import FailureType = require('../Simulation/Levels/failureType');
import LevelDef = require('../Simulation/Levels/levelDef');
import GameEndDetector = require('../Simulation/Levels/gameEndDetector');
import Server = require('./server');
import Simulation = require('../Simulation/simulation');
import VictoryType = require('../Simulation/Levels/victoryType');

class ServerLogger {
	logger: winston.LoggerInstance;

	constructor(private server: Server) {

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
	}

	private levelStarted(data: { level: LevelDef, simulation: Simulation, gameEndDetector: GameEndDetector }) {
		this.logger.log('info', "Level Started", {
			levelNumber: data.level.levelNumber,
			width: data.level.width,
			height: data.level.height,
			colorCount: data.level.colorCount,
			holes: data.level.holes.length,
			
			failureType: data.level.failureType,
			failureValue: this.encodeFailureValue(data.level.failureType, data.level.failureValue),
			victoryType: data.level.victoryType,
			victoryValue: this.encodeVictoryValue(data.level.victoryType, data.level.victoryValue),
			
			playerCount: this.server.getPlayerCount(),
			extra: data.level.extraData
		})
	}
	
	private encodeFailureValue(failureType: FailureType, failureValue: any): any {
		switch (failureType) {
			case FailureType.Swaps:
			case FailureType.Time:
				return <number>failureValue;
			default:
				throw new Error("Don't know about failureType " + failureType);
		}
	}
	
	private encodeVictoryValue(victoryType: VictoryType, victoryValue: any): any {
		switch (victoryType) {
			case VictoryType.GetThingToBottom:
				return '';
			case VictoryType.Matches:
			case VictoryType.Score:
				return <number>victoryValue;
			case VictoryType.RequireMatch:
				return (<[]>victoryValue).length;
			default:
				throw new Error("Don't know about victoryType " + victoryType);
		}
	}
}

export = ServerLogger;