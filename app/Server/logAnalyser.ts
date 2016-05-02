/// <reference path="../../typings/node/node.d.ts" />
import fs = require('fs');
import util = require('util');

interface LogData {
	levelNumber: number;
	playerCount: number;

	//Start only
	width?: number;
	height?: number;
	colorCount?: number;
	holes?: number;
	failureType?: string;
	failureValue?: any;
	victoryType?: string;
	victoryValue?: any;
	extra?: any;

	//End only
	victory?: boolean;
	swapsUsed?: number;
	timeUsed?: number;
}

class LogAnalyser {
	start: LogData;
	result = 'levelnumber,playerCount,width,height,colorCount,victory,victoryValue,failure,failureValue,win,swapsUsed,timeUsed' + "\r\n";

	constructor() {
	}

	analyse() {
		let jsonBuffer = '';
		let lines = fs.readFileSync('oce.log', 'UTF8').split(/\n+/);
		lines.forEach(line => {
			if (line[0] == '2') {
				if (jsonBuffer.length > 0) {
					this.decode(jsonBuffer);
				}
				jsonBuffer = '';
			} else {
				jsonBuffer += line;
			}
		});

		fs.writeFile('out.csv', this.result);
		console.log('done');
	}

	private decode(json: string) {
		let data = <LogData>eval("var HACKHACKHACK = " + json + "; HACKHACKHACK");
		let isStart = !!data.width;

		if (isStart) {
			this.start = data;
		} else if (this.start && this.start.levelNumber == data.levelNumber) {
			let victoryValue = this.safeValue(this.start.victoryValue);
			let failureValue = this.safeValue(this.start.failureValue);

			this.result += util.format('%d,%d,%d,%d,%d,%s,%s,%s,%s,%s,%d,%d', this.start.levelNumber, this.start.playerCount, this.start.width, this.start.height, this.start.colorCount, this.start.failureType, failureValue, this.start.victoryType, victoryValue, data.victory ? "true" : "false", data.swapsUsed, data.timeUsed) + "\r\n";
		}
		//let data = <LogData>JSON.parse(json);
		//console.log('decoded ' + data.levelNumber);
	}

	private safeValue(value: any) {
		if (value.length) {
			return value.length;
		}
		if (value.amount) {
			return value.amount;
		}

		return value;
	}
}

export = LogAnalyser;