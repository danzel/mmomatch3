enum PacketType {
	
	/** Server sends to client when the client connects */
	Boot,
	/** Server sends periodically to the client to run the simulation */
	Tick,

	/** Server sends to client when the game isn't currently available to play */
	Unavailable,
	
	/** Client sends to server to do a swap */
	SwapClient,
	
	/** Not a real packet, means corrupt/invalid data */
	Corrupt
}

export = PacketType;