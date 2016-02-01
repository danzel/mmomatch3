enum PacketType {
	
	/** Server sends to client when the client connects */
	boot,
	/** Server sends periodically to the client to run the simulation */
	tick,
	
	/** Client sends to server to  */
	swapClient,
	
	/** Hack */
	playerId,
	
	
	/** Not a real packet, means corrupt/invalid data */
	corrupt
}

export = PacketType;