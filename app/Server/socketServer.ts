/// <reference path="../../typings/primus/primus.d.ts" />
import http = require('http');
import Primus = require('primus');
//import fs = require('fs');

import BootData = require('../DataPackets/bootData');
import HttpServer = require('./httpServer');
import InitData = require('../DataPackets/initData');
import LiteEvent = require('../liteEvent');
import PacketType = require('../DataPackets/packetType');
import RejectData = require('../DataPackets/rejectData');
import Serializer = require('../Serializer/serializer');
import ServerComms = require('./serverComms');
import SocketServerConfig = require('./config/socketServerConfig');
import SwapClientData = require('../DataPackets/swapClientData');
import TickData = require('../DataPackets/tickData');
import UserTokenProvider = require('./userTokenProvider');

class SocketServer extends ServerComms {

	private httpServer: HttpServer;
	private primus: Primus;

	private sparkDataReceivedBound = this.sparkDataReceived.bind(this);

	private clients: { [id: string]: Primus.Spark } = {};

	constructor(private serializer: Serializer, userTokenProvider: UserTokenProvider, config: SocketServerConfig) {
		super();

		this.httpServer = new HttpServer(userTokenProvider, config);

		this.primus = new Primus(this.httpServer.httpServer, {
			pathname: '/sock',
			authorization: (req: http.IncomingMessage, done: (res?: any) => void) => {
				if (!config.allowedOrigins || config.allowedOrigins.indexOf(req.headers.origin) >= 0) {
					done();
				} else {
					this.warning.trigger({ str: 'Websocket from bad origin: ' + req.headers.origin });
					done({ statuscode: 403, message: 'Origin not allowed' });
				}
			}
		});

		//fs.writeFileSync('primus.js', this.primus.library());

		this.primus.on('connection', this.connectionReceived.bind(this));
		this.primus.on('disconnection', this.connectionDisconnected.bind(this));
	}

	private connectionReceived(spark: Primus.Spark) {
		console.log("connection", spark.id);

		let callback = this.sparkDataReceivedBound;
		spark.on('data', function (data: any) {
			callback(spark, data);
		});

		this.clients[spark.id] = spark;
		this.connected.trigger({ id: spark.id });
	}

	private connectionDisconnected(spark: Primus.Spark) {
		console.log('disconnection', spark.id);

		delete this.clients[spark.id];
		this.disconnected.trigger(spark.id);
	}

	private sparkDataReceived(spark: Primus.Spark, data: any) {
		//console.log("data", data);

		let packet = this.serializer.deserialize(data);
		this.dataReceived.trigger({ id: spark.id, packet: packet });
	}

	private send(data: any, ids: Array<string>) {
		for (let i = 0; i < ids.length; i++) {
			this.clients[ids[i]].write(data);
		}
	}

	sendReject(rejectData: RejectData, id: string): void {
		this.serializer.serializeReject(rejectData);
		this.clients[id].write(rejectData);
	}
	disconnect(id: string): void {
		this.clients[id].end();
	}

	sendInit(initData: InitData, id: string) {
		this.clients[id].write(this.serializer.serializeInit(initData));
	}

	sendBoot(bootData: BootData, ids: Array<string>) {
		var data = this.serializer.serializeBoot(bootData);
		this.send(data, ids);
	}

	sendTick(tickData: TickData, ids: Array<string>) {
		var data = this.serializer.serializeTick(tickData);

		this.send(data, ids);
	}
}

export = SocketServer;