/// <reference path="../../typings/express/express.d.ts" />
/// <reference path="../../typings/compression/compression.d.ts" />
/// <reference path="../../typings/helmet/helmet.d.ts" />
/// <reference path="../../typings/letsencrypt-express/letsencrypt-express.d.ts" />
/// <reference path="../../typings/primus/primus.d.ts" />
import express = require('express');
import compression = require('compression');
import helmet = require('helmet');
import http = require('http');
import https = require('https');
import LEX = require('letsencrypt-express');
import Primus = require('primus');
//import fs = require('fs');

import BootData = require('../DataPackets/bootData');
import InitData = require('../DataPackets/initData');
import LiteEvent = require('../liteEvent');
import PacketType = require('../DataPackets/packetType');
import RejectData = require('../DataPackets/rejectData');
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
		//Could consider this https://github.com/isaacs/st
		this.app.use(compression());
		this.app.use(helmet.hidePoweredBy());
		let oneDay = 24 * 60 * 60 * 1000;
		
		this.app.use(express.static('dist', {
			maxAge: oneDay,
			setHeaders: function (res, path) {
				if (path.toLowerCase().indexOf('.html') != -1) {
					res.setHeader('Cache-Control', 'public, max-age=0')
				}
			}
		}));

		if (config.httpsPort && config.domain && config.email) {
			console.log('starting https');

			LEX.debug = true;
			if (!console.debug) {
				console.debug = console.log;
			}

			var lex = LEX.create({
				server: 'https://acme-v01.api.letsencrypt.org/directory',
				email: config.email,
				agreeTos: true,
				approveDomains: [config.domain]
			});
			http.createServer(lex.middleware(function redirectHttps(req: http.IncomingMessage, res: http.ServerResponse) {
				res.setHeader('Location', 'https://' + req.headers.host + req.url);
				res.statusCode = 302;
				res.end('<!-- Hello Developer Person! Please use HTTPS instead -->');
			})).listen(config.httpPort, function() {
				console.log("Listening for ACME http-01 challenges on", this.address());
			});

			this.httpServer = https.createServer(lex.httpsOptions, lex.middleware(this.app));
			this.httpServer.listen(config.httpsPort, function() {
				console.log("Listening for ACME tls-sni-01 challenges and serve app on", this.address());
			});
		} else {
			console.log('starting http');
			this.httpServer = http.createServer(this.app);
			this.httpServer.listen(config.httpPort);
		}

		this.primus = new Primus(this.httpServer, {
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