import GetThingsToBottomDetector = require('../../../Simulation/Levels/Detectors/getThingsToBottomDetector');
import DetectorDisplay = require('../detectorDisplay');

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
		this.text.text = "Get " + this.detector.amount + " Robot" + (this.detector.amount == 1 ? "" : "s") + " to the bottom";
	}
}

export = GetThingsToBottomDisplay;