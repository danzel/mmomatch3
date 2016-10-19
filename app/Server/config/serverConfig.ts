interface ServerConfig {
	fps: number;
	framesPerTick: number;
	initialLevel: number;

	skipVersionCheck?: boolean;
	version: string;

	botsLeaveForPlayers?: boolean;
	botCount?: number;

	disableStatePersister?: boolean;
}

export = ServerConfig;