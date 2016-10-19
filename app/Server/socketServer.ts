/// <reference path="../../typings/express/express.d.ts" />
/// <reference path="../../typings/express-session/express-session.d.ts" />
/// <reference path="../../typings/compression/compression.d.ts" />
/// <reference path="../../typings/helmet/helmet.d.ts" />
/// <reference path="../../typings/letsencrypt-express/letsencrypt-express.d.ts" />
/// <reference path="../../typings/passport/passport.d.ts" />
/// <reference path="../../typings/passport/passport-facebook.d.ts" />
/// <reference path="../../typings/passport/passport-google-oauth20.d.ts" />
/// <reference path="../../typings/passport/passport-twitter.d.ts" />
/// <reference path="../../typings/primus/primus.d.ts" />
import express = require('express');
import compression = require('compression');
import helmet = require('helmet');
import http = require('http');
import https = require('https');
import LEX = require('letsencrypt-express');
import Primus = require('primus');
import session = require('express-session');
//import fs = require('fs');

import passport = require('passport');
import passportFacebook = require('passport-facebook');
import passportGoogle = require('passport-google-oauth20');
import passportTwitter = require('passport-twitter');

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
import UserTokenProvider = require('./userTokenProvider');

class SocketServer extends ServerComms {
	private app: express.Express;
	private httpServer: http.Server | https.Server;
	private primus: Primus;

	private sparkDataReceivedBound = this.sparkDataReceived.bind(this);

	private clients: { [id: string]: Primus.Spark } = {};

	constructor(private serializer: Serializer, private userTokenProvider: UserTokenProvider, private config: SocketServerConfig) {
		super();

		this.createHttpServer();

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

	private createHttpServer() {
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

		this.app.use(session({ secret: this.config.sessionSecret }));
		this.app.use(passport.initialize());

		passport.serializeUser(function (user, done) {
			done(null, user.provider + "|" + user.providerId);
		});

		passport.deserializeUser(function (id: string, done: (error: any, user: any) => void) {
			/*User.findById(id, function(err, user) {
				done(err, user);
			});*/

			let split = id.indexOf('|');
			done(null, { provider: id.substr(0, split), providerId: id.substr(split + 1) });
		});

		//Twitter
		passport.use(new passportTwitter.Strategy({
			consumerKey: this.config.twitterConsumerKey,
			consumerSecret: this.config.twitterConsumerSecret,
			callbackURL: '/auth/twitter/callback'
		}, (token: string, tokenSecret: string, profile: passport.Profile, done: (error: any, user?: any) => void) => {
			//debugger;
			done(null, { provider: profile.provider, providerId: profile.id });
		}));
		this.app.get('/auth/twitter', passport.authenticate('twitter'));
		this.createAuthCallback('/auth/twitter/callback', 'twitter');


		//Google
		passport.use(new passportGoogle.Strategy({
			clientID: this.config.googleClientID,
			clientSecret: this.config.googleClientSecret,
			callbackURL: '/auth/google/callback'
		}, (token: string, tokenSecret: string, profile: passport.Profile, done: (error: any, user?: any) => void) => {
			//debugger;
			done(null, { provider: profile.provider, providerId: profile.id });
		}));
		this.app.get('/auth/google', passport.authenticate('google', { scope: 'profile' }));
		this.createAuthCallback('/auth/google/callback', 'google');


		//Facebook
		passport.use(new passportFacebook.Strategy({
			clientID: this.config.facebookClientID,
			clientSecret: this.config.facebookClientSecret,
			callbackURL: '/auth/facebook/callback'
		}, (token: string, tokenSecret: string, profile: passport.Profile, done: (error: any, user?: any) => void) => {
			//debugger;
			done(null, { provider: profile.provider, providerId: profile.id });
		}));
		this.app.get('/auth/facebook', passport.authenticate('facebook'));
		this.createAuthCallback('/auth/facebook/callback', 'facebook');

		this.app.get('/logout', (req, res) => {
			req.logout();
			res.redirect('/');
		});

		if (this.config.httpsPort && this.config.domains && this.config.email) {
			console.log('starting https');

			LEX.debug = true;
			if (!console.debug) {
				console.debug = console.log;
			}

			var lex = LEX.create({
				server: 'https://acme-v01.api.letsencrypt.org/directory',
				email: this.config.email,
				agreeTos: true,
				approveDomains: this.config.domains
			});
			http.createServer(lex.middleware(function redirectHttps(req: http.IncomingMessage, res: http.ServerResponse) {
				res.setHeader('Location', 'https://' + req.headers.host + req.url);
				res.statusCode = 302;
				res.end('<!-- Hello Developer Person! Please use HTTPS instead -->');
			})).listen(this.config.httpPort, function () {
				console.log("Listening for ACME http-01 challenges on", this.address());
			});

			this.httpServer = https.createServer(lex.httpsOptions, lex.middleware(this.app));
			this.httpServer.listen(this.config.httpsPort, function () {
				console.log("Listening for ACME tls-sni-01 challenges and serve app on", this.address());
			});
		} else {
			console.log('starting http');
			this.httpServer = http.createServer(this.app);
			this.httpServer.listen(this.config.httpPort);
		}
	}

	//https://github.com/jaredhanson/passport/blob/master/lib/middleware/authenticate.js#L34
	createAuthCallback(url: string, provider: string): void {
		this.app.get(url, (req, res, next) => {
			passport.authenticate(provider, (err: Error, user: any, info: any, status: number) => {
				if (err) { return next(err); }
				if (!user) { return res.redirect('/#failure'); }
				res.redirect('/#success,' + this.userTokenProvider.getTokenForUser(user));
			})(req, res, next);
		});
	}
}

export = SocketServer;