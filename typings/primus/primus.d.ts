/// <reference path="../node/node.d.ts" />

declare module "primus" {
	import * as http from "http";
	import * as stream from "stream";
	
	interface PrimusOptions {
		authorization?: any;
		pathname?: string;
		parser?: string;
		transformer?: string;
		plugin?: any;
		timeout?: number;
		global?: string;
		compression?: boolean;
		origins?: string;
		methods?: string;
		credentials?: boolean;
		maxAge?: string;
		headers?: boolean;
		exposed?: boolean;
	}
	
	interface ReconnectOptions {
		max?: number;
		min?: number;
		retries?: number;
		"reconnect timeout"?: number;
		factor?: number;
	}

	class Primus extends stream.Stream {
		/**
		 * Server constructor
		 */
		constructor(server: http.Server, options?: PrimusOptions);
		
		static createServer(options: any) : Primus;
		static createServer(onConnection: Function, options: any) : Primus;
		
		/**
		 * Save the client-side library to the given path
		 */
		save(path: string, completion?: (error: any) => void);

		/**
		 * Return the client-side library as a string
		 */
		library(): string;

		/**
		 * Broadcast the message to all connections.
		 *
		 * @param data The data you want to send.
		 * @returns this
		 */
		write(data: any) : Primus;
	}
	
	module Primus {
		/**
		 * Not a real class, just providing typing for the Spark type. Maybe this should be an interface?
		 */
		class Spark extends stream.Stream {
			/**
			 * Send a new message
			 *
			 * @param data The data that needs to be written.
			 * @returns Always returns true as we don't support back pressure.
			 */
			write(data: any) : boolean;
		}
	}
	
	export = Primus;
}