import ScoreDetector = require('../../../Simulation/Levels/Detectors/scoreDetector');

import DetectorDisplay = require('../detectorDisplay');


class ScoreDisplay extends DetectorDisplay {
	constructor(private group: Phaser.Group, private detector: ScoreDetector) {
		super();
		let text = new Phaser.Text(group.game, 0, 0, "Score Required: " + detector.scoreRequiredRemaining + "/" + detector.scoreRequired, {
			fill: 'white'
		});
		this.group.add(text);
		
		detector.valueChanged.on(() => {
			if (!this.disabled) {
				text.text = "Score Required: " + detector.scoreRequiredRemaining + "/" + detector.scoreRequired;
			}
		})
	}
}

export = ScoreDisplay;