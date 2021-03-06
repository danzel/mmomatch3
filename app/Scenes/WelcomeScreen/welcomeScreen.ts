import HtmlTranslator = require('../../Language/htmlTranslator');

declare function require(filename: string): (data: {}) => string;
require('./welcomeScreen.css');

class WelcomeScreen {
	private element: HTMLElement;
	private nickname: HTMLInputElement;
	private hidenames: HTMLInputElement;
	private disableparticles: HTMLInputElement;

	onLogin: (nickname: string, hideNames: boolean, disableParticles: boolean) => void;

	constructor() {
		this.element = document.getElementById('welcome');
	}

	show() {
		this.addEventListeners();
		HtmlTranslator.showStartButton();
	}

	private addEventListeners() {

		this.nickname = <HTMLInputElement>this.element.getElementsByClassName('nickname')[0];
		this.hidenames = <HTMLInputElement>this.element.getElementsByClassName('hidenames')[0];
		this.disableparticles = <HTMLInputElement>this.element.getElementsByClassName('disableparticles')[0];

		let form = <HTMLFormElement>document.getElementById('login-form');
		let button = <HTMLInputElement>document.getElementById('play-button');


		try {
			if (window.localStorage.getItem('nickname')) {
				this.nickname.value = window.localStorage.getItem('nickname');
			}
		} catch (e) {
			//Ignore, some chrome versions fail here
		}
		
		let buttonAction = (ev: Event) => {
			this.element.style.display = 'none';
			window.scrollTo(0, 0);
			try {
				window.localStorage.setItem('nickname', this.nickname.value);
			} catch (e) {
				//Ignore, Safari in private browsing fails here
			}

			this.onLogin(this.nickname.value, this.hidenames.checked, this.disableparticles.checked);

			ev.preventDefault();
			return false;
		};
		form.addEventListener('submit', buttonAction);
		button.addEventListener('click', buttonAction)
	}
}

export = WelcomeScreen;