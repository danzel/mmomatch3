interface SocketServerConfig {
	/** http port we listen on, if httpsPort is specified we'll redirect to that */
	httpPort: number;
	/** Optional. The https port we listen on` */
	httpsPort?: number;
	/** domain names for https letsencrypt registration */
	domains?: Array<string>;
	/** for letsencrypt registration */
	email?: string;
	/** domains for checking if websocket is allowed */
	allowedOrigins?: Array<string>;
}

export = SocketServerConfig;