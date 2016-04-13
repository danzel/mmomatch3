import BootData = require('../DataPackets/bootData');
import PacketType = require('../DataPackets/packetType');
import Serializer = require('./serializer');
import SwapClientData = require('../DataPackets/swapClientData');
import TickData = require('../DataPackets/tickData');
import UnavailableData = require('../DataPackets/unavailableData');

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
		(<any>bootData).packetType = PacketType.Boot;
		return bootData;
	}

	serializeTick(tickData: TickData): any {
		(<any>tickData).packetType = PacketType.Tick;
		return tickData;
	}

	serializeUnavailable(unavailableData: UnavailableData): any {
		(<any>unavailableData).packetType = PacketType.Unavailable;
		return unavailableData;
	}

	serializeClientSwap(swapData: SwapClientData): any {
		(<any>swapData).packetType = PacketType.SwapClient;
		return swapData;
	}

	deserialize(data: any): { packetType: PacketType, data: any } {
		//Because we pack PacketType in to a new field we can do this horrible hack
		return { packetType: data.packetType, data: data };
	}
}

export = SimpleSerializer;