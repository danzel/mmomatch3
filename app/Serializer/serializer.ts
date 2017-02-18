import BootData = require('../DataPackets/bootData');
import EmoteClientData = require('../DataPackets/emoteClientData');
import EmoteData = require('../DataPackets/emoteData');
import InitData = require('../DataPackets/initData');
import JoinData = require('../DataPackets/joinData');
import PacketType = require('../DataPackets/packetType');
import RejectData = require('../DataPackets/rejectData');
import Simulation = require('../Simulation/simulation');
import SwapClientData = require('../DataPackets/swapClientData');
import TickData = require('../DataPackets/tickData');

interface Serializer {
	serializeReject(rejectData: RejectData): any;

	serializeInit(initData: InitData): any;

	serializeBoot(bootData: BootData): any;

	serializeTick(tickData: TickData): any;

	serializeJoin(joinData: JoinData): any;

	serializeClientSwap(swapData: SwapClientData): any;

	serializeClientEmote(emoteClientData: EmoteClientData): any;

	serializeEmote(emoteData: EmoteData): any;

	deserialize(data: any): { packetType: PacketType, data: any };
}

export = Serializer;