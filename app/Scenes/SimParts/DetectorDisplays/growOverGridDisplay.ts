import GrowOverGridDetector = require('../../../Simulation/Levels/Detectors/growOverGridDetector');

import DetectorDisplay = require('../detectorDisplay');
import Language = require('../../../Language');

class GrowOverGridDisplay extends DetectorDisplay {
	private text: Phaser.Text;

	constructor(private group: Phaser.Group, private detector: GrowOverGridDetector) {
		super();
		this.text = new Phaser.Text(group.game, 0, 0, 'populated below', this.textStyle);
		this.group.add(this.text);

		this.update();

		detector.valueChanged.on(() => this.update());
	}
	private update() {
		this.text.text = Language.t('plantremainingx', { smart_count: Math.max(0, this.detector.totalAmountRequired - this.detector.grownAmount) });
	}

}

export = GrowOverGridDisplay;