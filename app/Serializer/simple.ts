import BootData = require('../DataPackets/bootData');
import InitData = require('../DataPackets/initData');
import JoinData = require('../DataPackets/joinData');
import PacketType = require('../DataPackets/packetType');
import RejectData = require('../DataPackets/rejectData');
import Serializer = require('./serializer');
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
	serializeReject(rejectData: RejectData): any {
		(<any>rejectData).packetType = PacketType.Reject;
		return rejectData;
	}

	serializeInit(initData: InitData): any {
		(<any>initData).packetType = PacketType.Init;
		return initData;
	}

	serializeBoot(bootData: BootData): any {
		(<any>bootData).packetType = PacketType.Boot;
		return bootData;
	}

	serializeTick(tickData: TickData): any {
		(<any>tickData).packetType = PacketType.Tick;
		return tickData;
	}

	serializeJoin(joinData: JoinData): any {
		(<any>joinData).packetType = PacketType.Join;
		return joinData;
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