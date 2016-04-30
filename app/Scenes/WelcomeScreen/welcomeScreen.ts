import HtmlOverlayManager = require('../../HtmlOverlay/manager');

declare function require(filename: string): (data: {}) => string;
var template = <(data: {}) => string>require('./welcomeScreen.handlebars');
require('./welcomeScreen.css');

class WelcomeScreen {
	private nickname: HTMLInputElement;
	private button: HTMLInputElement;
	private hidenames: HTMLInputElement;

	onLogin: (nickname: string, hideNames: boolean) => void;

	constructor(private htmlOverlayManager: HtmlOverlayManager) {

	}

	show() {
		this.htmlOverlayManager.showOverlay({
			className: 'welcome-screen',
			content: template({}),
			closeOnBackgroundClick: false,
			postRenderCallback: (element) => this.addEventListeners(element)
		});
	}

	private addEventListeners(element: HTMLElement) {
		this.nickname = <HTMLInputElement>element.getElementsByClassName('nickname')[0];
		this.button = <HTMLInputElement>element.getElementsByClassName('button')[0];
		this.hidenames = <HTMLInputElement>element.getElementsByClassName('hidenames')[0];

		this.button.addEventListener('click', () => {
			this.htmlOverlayManager.hideOverlay();
			this.onLogin(this.nickname.value, this.hidenames.checked);
		})
	}
}

export = WelcomeScreen;