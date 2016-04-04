import GetThingToBottomDetector = require('../../../Simulation/Levels/Detectors/getThingToBottomDetector');
import DetectorDisplay = require('../detectorDisplay');

class MatchesDisplay extends DetectorDisplay {
	constructor(private group: Phaser.Group, private detector: GetThingToBottomDetector) {
		super();
		let text = new Phaser.Text(group.game, 0, 0, detector.getDetailsText(), this.textStyle);
		this.group.add(text);
	}
}

export = MatchesDisplay;