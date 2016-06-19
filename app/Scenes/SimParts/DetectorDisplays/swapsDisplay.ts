import SwapsDetector = require('../../../Simulation/Levels/Detectors/swapsDetector');

import DetectorDisplay = require('../detectorDisplay');
import Language = require('../../../Language');

class SwapsDisplay extends DetectorDisplay {
	constructor(private group: Phaser.Group, private detector: SwapsDetector) {
		super();
		let text = new Phaser.Text(group.game, 0, 0, Language.t('movesremainingx', { num: detector.swapsRemaining }), this.textStyle);
		this.group.add(text);

		detector.valueChanged.on(() => {
			if (!this.disabled) {
				text.text = Language.t('movesremainingx', { num: detector.swapsRemaining });
			}
		});
	}
}

export = SwapsDisplay;