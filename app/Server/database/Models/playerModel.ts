interface PlayerModel {
	/** Auto Increment */
	playerId: number;

	authProvider: string;
	authId: string;

	lastUsedName: string;
}

export = PlayerModel;