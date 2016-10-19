/// <reference path="../../typings/express/express.d.ts" />
/// <reference path="../../typings/express-session/express-session.d.ts" />
/// <reference path="../../typings/compression/compression.d.ts" />
/// <reference path="../../typings/helmet/helmet.d.ts" />
/// <reference path="../../typings/letsencrypt-express/letsencrypt-express.d.ts" />
/// <reference path="../../typings/passport/passport.d.ts" />
/// <reference path="../../typings/passport/passport-facebook.d.ts" />
/// <reference path="../../typings/passport/passport-google-oauth20.d.ts" />
/// <reference path="../../typings/passport/passport-twitter.d.ts" />
import express = require('express');
import compression = require('compression');
import helmet = require('helmet');
import http = require('http');
import https = require('https');
import LEX = require('letsencrypt-express');
import session = require('express-session');

import passport = require('passport');
import passportFacebook = require('passport-facebook');
import passportGoogle = require('passport-google-oauth20');
import passportTwitter = require('passport-twitter');

import DataStorage = require('./Database/dataStorage');
import SocketServerConfig = require('./config/socketServerConfig');
import UserTokenProvider = require('./userTokenProvider');

class HttpServer {
	app: express.Express;
	httpServer: http.Server | https.Server;


	constructor(private userTokenProvider: UserTokenProvider, private storage: DataStorage, private config: SocketServerConfig) {
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

		this.app.get('/user/profile/view/:playerDbId', (req, res) => {
			storage.getPlayer(req.params.playerDbId, (player) => {
				storage.getLatestLevelResults(req.params.playerDbId, 5, (levels) => {
					res.render('../Pages/viewUserProfile.hbs', {
						name: player.lastUsedName,
						levels: levels
					});
				});
			});
		});

		this.configurePassport();

		this.startHttpServer();
	}

	private startHttpServer() {
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
	private configurePassport(): void {
		this.app.use(session({
			secret: this.config.sessionSecret,
			resave: true,
			saveUninitialized: false
		}));
		this.app.use(passport.initialize());

		passport.serializeUser(function (user, done) {
			done(null, user.provider + "|" + user.providerId);
		});

		passport.deserializeUser(function (id: string, done: (error: any, user: any) => void) {
			let split = id.indexOf('|');
			done(null, { provider: id.substr(0, split), providerId: id.substr(split + 1) });
		});

		//Twitter
		passport.use(new passportTwitter.Strategy({
			consumerKey: this.config.twitterConsumerKey,
			consumerSecret: this.config.twitterConsumerSecret,
			callbackURL: '/auth/twitter/callback'
		}, (token: string, tokenSecret: string, profile: passport.Profile, done: (error: any, user?: any) => void) => {
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
			done(null, { provider: profile.provider, providerId: profile.id });
		}));
		this.app.get('/auth/facebook', passport.authenticate('facebook'));
		this.createAuthCallback('/auth/facebook/callback', 'facebook');

		this.app.get('/logout', (req, res) => {
			req.logout();
			res.redirect('/');
		});
	}

	//https://github.com/jaredhanson/passport/blob/master/lib/middleware/authenticate.js#L34
	private createAuthCallback(url: string, provider: string): void {
		this.app.get(url, (req, res, next) => {
			passport.authenticate(provider, (err: Error, user: any, info: any, status: number) => {
				if (err) { return next(err); }
				if (!user) { return res.redirect('/#failure'); }
				res.redirect('/#success,' + this.userTokenProvider.getTokenForUser(user));
			})(req, res, next);
		});
	}
}

export = HttpServer;