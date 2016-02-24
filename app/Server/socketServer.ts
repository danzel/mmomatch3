/// <reference path="../../typings/express/express.d.ts" />
/// <reference path="../../typings/primus/primus.d.ts" />
import express = require('express');
import http = require('http');

import BootData = require('../DataPackets/bootData');
import LiteEvent = require('../liteEvent');
import Primus = require('primus');
import PacketType = require('../DataPackets/packetType');
import Serializer = require('../Serializer/serializer');
import SwapClientData = require('../DataPackets/swapClientData');
import TickData = require('../DataPackets/tickData');

class SocketServer {
	private app: express.Express;
	private httpServer: http.Server;
	private primus: Primus;

	private dataReceivedBound = this.dataReceived.bind(this);

	private clients: { [id: string]: Primus.Spark } = {};

	connected = new LiteEvent<string>();
	disconnected = new LiteEvent<string>();
	swapReceived = new LiteEvent<{ id: string, swap: SwapClientData }>();

	constructor(private serializer: Serializer) {
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
		console.log("connection", spark.id);

		let callback = this.dataReceivedBound;
		spark.on('data', function(data: any) {
			callback(spark, data);
		});

		this.clients[spark.id] = spark;
		this.connected.trigger(spark.id);
	}

	private connectionDisconnected(spark: Primus.Spark) {
		console.log('disconnection', spark.id);

		delete this.clients[spark.id];
		this.disconnected.trigger(spark.id);
	}

	private dataReceived(spark: Primus.Spark, data: any) {
		//console.log("data", data);
		
		let packet = this.serializer.deserialize(data);
		if (packet.packetType == PacketType.SwapClient) {
			this.swapReceived.trigger({ id: spark.id, swap: <SwapClientData>packet.data });
		} else {
			console.warn('Received unexpected packet ', packet);
		}
	}

	private send(data: any, ids: Array<string>) {
		for (let i = 0; i < ids.length; i++) {
			this.clients[ids[i]].write(data);
		}
	}

	sendTick(tickData: TickData, ids: Array<string>) {
		var data = this.serializer.serializeTick(tickData);

		this.send(data, ids);
	}
	
	sendBoot(bootData: BootData, id: string) {
		this.clients[id].write(this.serializer.serializeBoot(bootData));
	}

}

export = SocketServer;