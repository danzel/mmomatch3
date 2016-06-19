import GetThingsToBottomDetector = require('../../../Simulation/Levels/Detectors/getThingsToBottomDetector');

import DetectorDisplay = require('../detectorDisplay');
import Language = require('../../../Language');

class GetThingsToBottomDisplay extends DetectorDisplay {
	private text: Phaser.Text;
	
	constructor(private group: Phaser.Group, private detector: GetThingsToBottomDetector) {
		super();
		this.text = new Phaser.Text(group.game, 0, 0, detector.getDetailsText(), this.textStyle);
		this.group.add(this.text);
		
		this.update();

		detector.valueChanged.on(() => this.update());
	}
	private update() {
		this.text.text = Language.t('robots to bottom', { smart_count: this.detector.amount });
	}
}

export = GetThingsToBottomDisplay;