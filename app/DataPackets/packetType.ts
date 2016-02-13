enum PacketType {
	
	/** Server sends to client when the client connects */
	Boot,
	/** Server sends periodically to the client to run the simulation */
	Tick,
	/** Client sends to server to  */
	SwapClient,
	
	/** Not a real packet, means corrupt/invalid data */
	Corrupt
}

export = PacketType;