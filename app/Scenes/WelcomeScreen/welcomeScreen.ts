import HtmlOverlayManager = require('../../HtmlOverlay/manager');

declare function require(filename: string): (data: {}) => string;
var template = <(data: {}) => string>require('./welcomeScreen.handlebars');
require('./welcomeScreen.css');

class WelcomeScreen {
	private nickname: Element;
	private button: Element;
	private hidenames: Element;
	
	constructor(private htmlOverlayManager: HtmlOverlayManager) {

	}

	show() {
		this.htmlOverlayManager.showOverlay('welcome-screen', template({}), {
			closeOnBackgroundClick: false,
			postRenderCallback: (element) => this.addEventListeners(element)
		});
	}

	private addEventListeners(element: HTMLElement) {
		this.nickname = element.getElementsByClassName('nickname')[0];
		this.button = element.getElementsByClassName('button')[0];
		this.hidenames = element.getElementsByClassName('hidenames')[0];

		this.button.addEventListener('click', () => {
			console.log('click');
		})
	}
}

export = WelcomeScreen;