import HtmlOverlayManager = require('../../HtmlOverlay/manager');

declare function require(filename: string): (data: {}) => string;
var template = <(data: {}) => string>require('./welcomeScreen.handlebars');
require('./welcomeScreen.css');

class WelcomeScreen {
	constructor(private htmlOverlayManager: HtmlOverlayManager) {
		
	}
	
	show() {
		this.htmlOverlayManager.showOverlay('welcome-screen', template({}), { closeOnBackgroundClick: false });
	}
}

export = WelcomeScreen;