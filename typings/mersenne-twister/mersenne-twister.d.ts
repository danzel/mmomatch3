declare module "mersenne-twister" {
	class MersenneTwister {
		constructor(seed?: number);
		
		/** Generates a random number on [0,1) real interval (same interval as Math.random) */
		random(): number;
		
		/** Generates a random number on [0,0xffffffff]-interval */
		random_int(): number;
		
		/** [0,1] */
		random_incl(): number;
		
		/** (0,1) */
		random_excl(): number;
		
		/** [0,1) with 53-bit resolution */
		random_long(): number;
		
		/** Generates a random number on [0,0x7fffffff]-interval */
		random_int31(): number;
	}
	
	export = MersenneTwister;
}