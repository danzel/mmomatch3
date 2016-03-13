interface ServerConfig {
	httpPort: number;
	httpsPort?: number;
	domain?: string;
	email?: string;
}

export = ServerConfig;