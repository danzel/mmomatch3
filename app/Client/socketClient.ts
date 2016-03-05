/// <reference path="../../typings/primus/primusClient.d.ts" />
import ClientComms = require('./clientComms');
import Serializer = require('../Serializer/serializer')
import SwapClientData = require('../DataPackets/swapClientData');

class SocketClient extends ClientComms {
	private primus: Primus;

	constructor(url: string, private serializer: Serializer) {
		super();
		console.log('connecting');
		this.primus = Primus.connect(url, {
			//Options?
		});

		this.primus.on('open', function() { console.log('open'); });
		this.primus.on('data', this.primusDataReceived, this);
	}

	private primusDataReceived(data: any) {
		let packet = this.serializer.deserialize(data);

		this.dataReceived.trigger(packet);
	}

	sendSwap(swapClientData: SwapClientData) {
		this.primus.write(this.serializer.serializeClientSwap(swapClientData));
	}
}

export = SocketClient;