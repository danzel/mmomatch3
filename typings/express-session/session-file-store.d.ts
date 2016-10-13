/// <reference path="../express/express.d.ts" />
/// <reference path="../express-session/express-session.d.ts" />

declare module "session-file-store" {
	import express = require('express');
	import session = require('express-session');

	interface FileStoreOptions {
		/** The directory where the session files will be stored. Defaults to ./sessions */
		path?: string;
		/**  Session time to live in seconds. Defaults to 3600 */
		ttl?: number;
		/** The number of retries to get session data from a session file. Defaults to 5 */
		retries?: number;
		/** The exponential factor to use for retry. Defaults to 1 */
		factor?: number;
		/** The number of milliseconds before starting the first retry. Defaults to 50 */
		minTimeout?: number;
		/**  The maximum number of milliseconds between two retries. Defaults to 100 */
		maxTimeout?: number;
		/** [OUT] Contains intervalObject if reap was scheduled */
		reapIntervalObject?: any;
		/** Interval to clear expired sessions in seconds or -1 if do not need. Defaults to 1 hour */
		reapInterval?: number;
		/** use distinct worker process for removing stale sessions. Defaults to false */
		reapAsync?: boolean;
		/** reap stale sessions synchronously if can not do it asynchronously. Default to false */
		reapSyncFallback?: boolean;
		/** log messages. Defaults to console.log */
		logFn?: Function; 
		/** returns fallback session object after all failed retries. No defaults */
		fallbackSessionFn?: Function;
		/** Enables encryption of the session before writing the file and also decryption when reading it. */
		encrypt?: boolean;
	}

	function FileStoreFactory(sessionType: any): FileStore;

	interface FileStore extends session.Store {
		new(options?: FileStoreOptions): FileStore
	}

	export = FileStoreFactory;
}