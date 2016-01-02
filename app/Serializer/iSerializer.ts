import BootData = require('../DataPackets/bootData');
import Simulation = require('../Simulation/simulation');
import SwapData = require('../DataPackets/swapData');
import TickData = require('../DataPackets/tickData');

interface ISerializer {
	serializeBoot(simulation: Simulation) : any;
	deserializeBoot(data: any): BootData;
	
	serializeTick(tickData: TickData) : any;
	deserializeTick(data: any) : TickData;
	
	serializeSwap(swapData: SwapData) : any;
	deserializeSwap(data: any) : SwapData;
}

export = ISerializer;