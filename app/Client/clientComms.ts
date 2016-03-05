import LiteEvent = require('../liteEvent');
import PacketType = require('../DataPackets/packetType');
import SwapClientData = require('../DataPackets/swapClientData');

abstract class ClientComms {
	dataReceived = new LiteEvent<{ packetType: PacketType, data: any }>();

	abstract sendSwap(swapClientData: SwapClientData): void;
}

export = ClientComms;