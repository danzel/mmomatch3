import SwapsDetector = require('../../../Simulation/Levels/Detectors/swapsDetector');

import DetectorDisplay = require('../detectorDisplay');


class SwapsDisplay extends DetectorDisplay {
	constructor(private group: Phaser.Group, private detector: SwapsDetector) {
		super();
		let text = new Phaser.Text(group.game, 0, 0, "Moves Remaining: " + detector.swapsRemaining, this.textStyle);
		this.group.add(text);

		detector.valueChanged.on(() => {
			if (!this.disabled) {
				text.text = "Moves Remaining: " + detector.swapsRemaining;
			}
		});
	}
}

export = SwapsDisplay;