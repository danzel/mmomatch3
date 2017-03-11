import LevelDef = require('../Simulation/Levels/levelDef');
import VictoryType = require('../Simulation/Levels/victoryType');

class SkinDef {
	private constructor(public skinName: string, public backgroundColor: string) { }

	private static lianne = new SkinDef('skin-lianne-animals', '#1c3d01')
	private static default = new SkinDef('skin-emojione-animals', '#273348');
	private static kenney = new SkinDef('skin-kenney-animals', '#2f014f');

	static getForLevel(level: LevelDef): SkinDef {
		if (level.victoryType == VictoryType.GrowOverGrid) {
			return SkinDef.lianne;
		}
		/*if (level.victoryType == VictoryType.Matches) {
			return SkinDef.kenney;
		}*/
		return SkinDef.default;
	}
}

export = SkinDef;