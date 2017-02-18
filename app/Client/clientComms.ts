import EmoteClientData = require('../DataPackets/emoteClientData');
import JoinData = require('../DataPackets/joinData');
import LiteEvent = require('../liteEvent');
import PacketType = require('../DataPackets/packetType');
import SwapClientData = require('../DataPackets/swapClientData');

abstract class ClientComms {
	connected = new LiteEvent();
	disconnected = new LiteEvent();

	dataReceived = new LiteEvent<{ packetType: PacketType, data: any }>();

	abstract sendJoin(joinData: JoinData): void;
	abstract sendSwap(swapClientData: SwapClientData): void;
	abstract sendEmote(emoteClientData: EmoteClientData): void;
}

export = ClientComms;