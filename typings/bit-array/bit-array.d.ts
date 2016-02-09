declare module "bit-array" {
	/** ref https://github.com/bramstein/bit-array */
	class BitArray {
		/** Creates a new empty bit array with the given size in bits. */
		constructor(size: number);
		/** Creates a new bit array with the given size and using the hex string as value */
		constructor(size: number, hex: string);
		
		/** Sets the bit at index to a value */
		set(index: number, value: boolean): BitArray;
		
		/** Returns the value of the bit at index */
		get(index: number): boolean;
		
		/** Toggles the bit at index. If the bit is on, it is turned off. Likewise, if the bit is off it is turned on. */
		toggle(index: number): BitArray;
		
		/** Convert the BitArray to an Array of boolean values. */
		toArray(): Array<boolean>;
		
		/** Returns a hex representation of the BitArray. */
		toHexString(): string;
	}
	
	export = BitArray;
}