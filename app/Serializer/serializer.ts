import BootData = require('../DataPackets/bootData');
import PacketType = require('../DataPackets/packetType');
import Simulation = require('../Simulation/simulation');
import SwapClientData = require('../DataPackets/swapClientData');
import TickData = require('../DataPackets/tickData');
import UnavailableData = require('../DataPackets/unavailableData');

interface Serializer {
	serializeBoot(bootData: BootData): any;

	serializeTick(tickData: TickData): any;

	serializeUnavailable(unavailableData: UnavailableData): any;

	serializeClientSwap(swapData: SwapClientData): any;

	deserialize(data: any): { packetType: PacketType, data: any };
}

export = Serializer;