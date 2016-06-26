import GetToBottomRaceDetector = require('../../../Simulation/Levels/Detectors/getToBottomRaceDetector');

import DetectorDisplay = require('../detectorDisplay');
import Language = require('../../../Language');

class GetToBottomRaceDisplay extends DetectorDisplay {
	private text: Phaser.Text;
	
	constructor(private group: Phaser.Group, private detector: GetToBottomRaceDetector) {
		super();
		this.text = new Phaser.Text(group.game, 0, 0, detector.getDetailsText(), this.textStyle);
		this.group.add(this.text);
		
		this.update();

		detector.valueChanged.on(() => this.update());
	}
	private update() {
		this.text.text = this.detector.getDetailsText();
	}
}

export = GetToBottomRaceDisplay;