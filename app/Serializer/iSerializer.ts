import BootData = require('../DataPackets/bootData');
import Simulation = require('../Simulation/simulation');
import SwapClientData = require('../DataPackets/swapClientData');
import TickData = require('../DataPackets/tickData');

interface ISerializer {
	serializeBoot(simulation: Simulation) : any;
	deserializeBoot(data: any): BootData;
	
	serializeTick(tickData: TickData) : any;
	deserializeTick(data: any) : TickData;
	
	serializeClientSwap(swapData: SwapClientData) : any;
	deserializeClientSwap(data: any) : SwapClientData;
}

export = ISerializer;