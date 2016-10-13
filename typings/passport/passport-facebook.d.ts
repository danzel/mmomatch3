/// <reference path="../express/express.d.ts" />
/// <reference path="./passport.d.ts" />

declare module 'passport-facebook' {
    import express = require('express');
    import passport = require('passport');

	class Strategy implements passport.Strategy {

		constructor(options: {
			clientID: string,
			clientSecret: string,
			callbackURL: string
		}, callback: (token: string, tokenSecret: string, profile: passport.Profile, done: (error: any, user?: any) => void) => void);

        authenticate(req: express.Request, options?: Object): void;

	}
}