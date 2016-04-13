/// <reference path="../../typings/express/express.d.ts" />
/// <reference path="../../typings/letsencrypt-express/letsencrypt-express.d.ts" />
/// <reference path="../../typings/primus/primus.d.ts" />
import express = require('express');
import http = require('http');
import https = require('https');
import LEX = require('letsencrypt-express');

import BootData = require('../DataPackets/bootData');
import LiteEvent = require('../liteEvent');
import Primus = require('primus');
import PacketType = require('../DataPackets/packetType');
import Serializer = require('../Serializer/serializer');
import ServerComms = require('./serverComms');
import SocketServerConfig = require('./config/socketServerConfig');
import SwapClientData = require('../DataPackets/swapClientData');
import TickData = require('../DataPackets/tickData');
import UnavailableData = require('../DataPackets/unavailableData');

class SocketServer extends ServerComms {
	private app: express.Express;
	private httpServer: http.Server | https.Server;
	private primus: Primus;

	private sparkDataReceivedBound = this.sparkDataReceived.bind(this);

	private clients: { [id: string]: Primus.Spark } = {};

	constructor(private serializer: Serializer, config: SocketServerConfig) {
		super();
		this.app = express();
		this.app.use(express.static('dist'));

		if (config.httpsPort && config.domain && config.email) {
			console.log('starting https');

			LEX.debug = true;
			if (!console.debug) {
				console.debug = console.log;
			}

			var lex = LEX.create({
				configDir: './letsencrypt/etc',
				approveRegistration: function(hostname, cb) {
					if (hostname == config.domain) {
						cb(null, { domains: [hostname], email: config.email, agreeTos: true });
					}
				}
			});
			http.createServer(LEX.createAcmeResponder(lex, function redirectHttps(req: http.IncomingMessage, res: http.ServerResponse) {
				res.setHeader('Location', 'https://' + config.domain + req.url);
				res.statusCode = 302;
				res.end('<!-- Hello Developer Person! Please use HTTPS instead -->');
			})).listen(config.httpPort);

			this.httpServer = https.createServer(lex.httpsOptions, LEX.createAcmeResponder(lex, this.app));
			this.httpServer.listen(config.httpsPort);
		} else {
			console.log('starting http');
			this.httpServer = http.createServer(this.app);
			this.httpServer.listen(config.httpPort);
		}

		this.primus = new Primus(this.httpServer, {
			pathname: '/sock'
		});

		this.primus.on('connection', this.connectionReceived.bind(this));
		this.primus.on('disconnection', this.connectionDisconnected.bind(this));
	}

	private connectionReceived(spark: Primus.Spark) {
		console.log("connection", spark.id);

		let callback = this.sparkDataReceivedBound;
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

	sendTick(tickData: TickData, ids: Array<string>) {
		var data = this.serializer.serializeTick(tickData);

		this.send(data, ids);
	}

	sendBoot(bootData: BootData, id: string) {
		this.clients[id].write(this.serializer.serializeBoot(bootData));
	}
	
	sendUnavailable(unavailableData: UnavailableData, id?: string) {
		let serialized = this.serializer.serializeUnavailable(unavailableData);
		if (id) {
			this.clients[id].write(serialized);
		} else {
			for (let id in this.clients) {
				this.clients[id].write(serialized);
			}
		}
	}
}

export = SocketServer;