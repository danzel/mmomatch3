/// <reference path="../node/node.d.ts" />

interface ReconnectOptions {
	max?: number;
	min?: number;
	retries?: number;
	"reconnect timeout"?: number;
	factor?: number;
}

interface PrimusClientOptions {
	reconnect?: ReconnectOptions;
	timeout?: number;
	ping?: number;
	pong?: number;
	strategy?: string; //TODO: Enum string
	manual?: boolean;
	websockets?: boolean;
	network?: boolean;
	transport?: any;
	queueSize?: number;
}

declare class Primus {
	constructor(url: string, options?: PrimusClientOptions);
	
	static connect(url: string, options?: PrimusClientOptions) : Primus;
	
	/**
	 * Establish a connection with the server. When this function is called we
	 * assume that we don't have any open connections. If you do call it when you
	 * have a connection open, it could cause duplicate connections.
	 *
	 * @returns this
	 */
	open() : Primus;

	/**
	 * Register a new EventListener for the given event.
	 * 
	 * @param event Name of the event.
	 * @param fn Callback function.
	 * @param context The context of the function.
	 */
	on(event: string, fn?: Function, context?: any): Primus;
	/**
	 * Add an EventListener that's only called once.
	 *
	 * @param event Name of the event.
	 * @param fn Callback function.
	 * @param context The context of the function.
	 */
	once(event: string, fn?: Function, context?: any): Primus;
	/**
	 * Remove event listeners.
	 *
	 * @param event The event we want to remove.
	 * @param fn The listener that we need to find.
	 * @param context Only remove listeners matching this context.
	 * @param once Only remove once listeners.
	 * @api public
	 */
	off(event: string, fn?: Function, context?: any, once?: boolean): Primus;

	/**
	 * Send a new message.
	 *
	 * @param data The data that needs to be written.
	 * @returns Always returns true as we don't support back pressure.
	 */
	write(data: any) : boolean;
}