/// <reference path="../node/node.d.ts" />

declare module "primus" {
	import * as http from "http";
	import * as https from "https";
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
		constructor(server: http.Server | https.Server, options?: PrimusOptions);
		
		static createServer(options: any) : Primus;
		static createServer(onConnection: Function, options: any) : Primus;
		
		/**
		 * Interate over the connections.
		 * @param fn The function that is called every iteration.
 		 */
		forEach(fn: (spark: Primus.Spark, id: string, connections: Array<Primus.Spark>) => void): void;
		
		/**
		 * Broadcast the message to all connections.
		 *
		 * @param data The data you want to send.
		 * @returns this
		 */
		write(data: any) : Primus;

		/**
		 * Save the client-side library to the given path
		 */
		save(path: string, completion?: (error: any) => void): void;

		/**
		 * Return the client-side library as a string
		 */
		library(): string;
	}
	
	module Primus {
		/**
		 * Not a real class, just providing typing for the Spark type. Maybe this should be an interface?
		 */
		class Spark extends stream.Stream {
			
			/**
			 * Unique id for this socket
			 */
			id: string;
			
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