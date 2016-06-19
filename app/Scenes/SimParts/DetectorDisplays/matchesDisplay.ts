import MatchesDetector = require('../../../Simulation/Levels/Detectors/matchesDetector');

import DetectorDisplay = require('../detectorDisplay');
import Language = require('../../../Language');

class MatchesDisplay extends DetectorDisplay {
	constructor(private group: Phaser.Group, private detector: MatchesDetector) {
		super();
		let text = new Phaser.Text(group.game, 0, 0, Language.t('animalsremainingx', { num: detector.matchesRemaining }), this.textStyle);
		this.group.add(text);

		detector.valueChanged.on(() => {
			if (!this.disabled) {
				text.text = Language.t('animalsremainingx', { num: detector.matchesRemaining });
			}
		});
	}
}

export = MatchesDisplay;