import ScoreDetector = require('../../../Simulation/Levels/Detectors/scoreDetector');

import DetectorDisplay = require('../detectorDisplay');
import Language = require('../../../Language');

class ScoreDisplay extends DetectorDisplay {
	constructor(private group: Phaser.Group, private detector: ScoreDetector) {
		super();
		let text = new Phaser.Text(group.game, 0, 0, Language.t('pointsrequiredx', { num: detector.scoreRequiredRemaining, total: detector.scoreRequired }), this.textStyle);
		this.group.add(text);

		detector.valueChanged.on(() => {
			if (!this.disabled) {
				text.text = Language.t('pointsrequiredx', { num: detector.scoreRequiredRemaining, total: detector.scoreRequired });
			}
		})
	}
}

export = ScoreDisplay;