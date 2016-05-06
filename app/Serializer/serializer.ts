import BootData = require('../DataPackets/bootData');
import InitData = require('../DataPackets/initData');
import JoinData = require('../DataPackets/joinData');
import PacketType = require('../DataPackets/packetType');
import Simulation = require('../Simulation/simulation');
import SwapClientData = require('../DataPackets/swapClientData');
import TickData = require('../DataPackets/tickData');
import UnavailableData = require('../DataPackets/unavailableData');

interface Serializer {
	serializeInit(initData: InitData): any;

	serializeBoot(bootData: BootData): any;

	serializeTick(tickData: TickData): any;

	serializeUnavailable(unavailableData: UnavailableData): any;

	serializeJoin(joinData: JoinData): any;

	serializeClientSwap(swapData: SwapClientData): any;

	deserialize(data: any): { packetType: PacketType, data: any };
}

export = Serializer;