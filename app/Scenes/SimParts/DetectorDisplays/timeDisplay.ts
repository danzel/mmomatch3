import TimeDetector = require('../../../Simulation/Levels/Detectors/timeDetector');

import DetectorDisplay = require('../detectorDisplay');
import Language = require('../../../Language');

class TimeDisplay extends DetectorDisplay {
	constructor(private group: Phaser.Group, private detector: TimeDetector) {
		super();
		let text = new Phaser.Text(group.game, 0, 0, Language.t('timeremainingx', { num: detector.timeRemaining.toFixed(1) }), this.textStyle);
		this.group.add(text);

		detector.valueChanged.on(() => {
			if (!this.disabled) {
				text.text = Language.t('timeremainingx', { num: detector.timeRemaining.toFixed(1) });
			}
		});
	}
}

export = TimeDisplay;