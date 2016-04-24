interface AvailabilityRange {
	/** Time the server opens (in date.toJSON format) */
	start: string;
	/** Time the server closes (in date.toJSON format) */
	end: string;
}
interface ServerConfig {
	fps: number;
	framesPerTick: number;
	initialLevel: number;
	
	botsLeaveForPlayers?: boolean;
	botCount?: number;
	
	availability?: Array<AvailabilityRange>;
}

export = ServerConfig;