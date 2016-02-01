import BootData = require('../DataPackets/bootData');
import Serializer = require('./serializer');
import PacketType = require('../DataPackets/PacketType');
import SwapClientData = require('../DataPackets/swapClientData');
import TickData = require('../DataPackets/tickData');

interface SerializedBoot {
	idCounter: number;
	width: number;
	height: number;
	grid: any;
	swapHandler: Array<any>;
}

//TODO: This class will need to do some data validation, can't trust the client!
class SimpleSerializer implements Serializer {
	serializeBoot(bootData: BootData): any {
		(<any>bootData).packetType = PacketType.boot;
		return bootData;
	}

	serializeTick(tickData: TickData): any {
		(<any>tickData).packetType = PacketType.tick;
		return tickData;
	}

	serializeClientSwap(swapData: SwapClientData): any {
		(<any>swapData).packetType = PacketType.swapClient;
		return swapData;
	}

	deserialize(data: any): { packetType: PacketType, data: any } {
		//Because we pack PacketType in to a new field we can do this horrible hack
		return { packetType: data.packetType, data: data };
	}
}

export = SimpleSerializer;