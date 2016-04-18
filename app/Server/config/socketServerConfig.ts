interface SocketServerConfig {
	/** http port we listen on, if httpsPort is specified we'll redirect to that */
	httpPort: number;
	/** Optional. The https port we listen on` */
	httpsPort?: number;
	/** domain name for https letsencrypt registration */
	domain?: string;
	/** for letsencrypt registration */
	email?: string;
}

export = SocketServerConfig;