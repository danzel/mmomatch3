enum PacketType {

	/** Clients connection was refused, currently only because of version mismatch */
	Reject,

	/** Client sends to server initially to register their name */
	Join,

	/** Server responds with this to the client, has their ID and all the player names */
	Init,



	/** Server sends to client when the client connects */
	Boot,
	/** Server sends periodically to the client to run the simulation */
	Tick,

	/** Client sends to server to do a swap */
	SwapClient,


	/** Client sends to server to request showing an emote */
	EmoteClient,
	/** Server sends to client to show an emote */
	Emote,


	/** Not a real packet, means corrupt/invalid data */
	Corrupt
}

export = PacketType;