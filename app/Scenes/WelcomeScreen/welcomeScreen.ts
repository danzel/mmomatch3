import HtmlTranslator = require('../../Language/htmlTranslator');

declare function require(filename: string): (data: {}) => string;
require('./welcomeScreen.css');

class WelcomeScreen {
	private element: HTMLElement;
	private nickname: HTMLInputElement;
	private hidenames: HTMLInputElement;

	onLogin: (nickname: string, hideNames: boolean) => void;

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

		let form = <HTMLFormElement>document.getElementById('login-form');
		let button = <HTMLInputElement>document.getElementById('play-button');


		if (window.localStorage.getItem('nickname')) {
			this.nickname.value = window.localStorage.getItem('nickname');
		}

		let buttonAction = (ev: Event) => {
			this.element.style.display = 'none';
			window.localStorage.setItem('nickname', this.nickname.value);
			
			this.onLogin(this.nickname.value, this.hidenames.checked);

			ev.preventDefault();
			return false;
		};
		form.addEventListener('submit', buttonAction);
		button.addEventListener('click', buttonAction)
	}
}

export = WelcomeScreen;