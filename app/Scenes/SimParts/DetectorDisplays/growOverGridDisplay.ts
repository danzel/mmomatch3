import GrowOverGridDetector = require('../../../Simulation/Levels/Detectors/growOverGridDetector');

import DetectorDisplay = require('../detectorDisplay');


class GrowOverGridDisplay extends DetectorDisplay {
	private text: Phaser.Text;

	constructor(private group: Phaser.Group, private detector: GrowOverGridDetector) {
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

export = GrowOverGridDisplay;