import BootData = require('../DataPackets/bootData');
import PacketType = require('../DataPackets/PacketType');
import Simulation = require('../Simulation/simulation');
import SwapClientData = require('../DataPackets/swapClientData');
import TickData = require('../DataPackets/tickData');

interface Serializer {
	serializeBoot(bootData: BootData): any;

	serializeTick(tickData: TickData): any;

	serializeClientSwap(swapData: SwapClientData): any;

	serializePlayerId(playerId: number): any;

	deserialize(data: any): { packetType: PacketType, data: any };
}

export = Serializer;