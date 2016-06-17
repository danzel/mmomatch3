declare function require(filename: string): string | ((data: {}) => string);
var template = <(data: UIState) => string>require('./template.handlebars');
var feedbackTemplate = <(data: UIState) => string>require('./feedback.handlebars');
require('./template.css');
var closeSvg = require('file?name=close.svg?[hash:6]!../../img/ui/close.svg');
var fullscreenSvg = require('file?name=fullscreen.svg?[hash:6]!../../img/ui/fullscreen.svg');
var matchable1 = require('file?name=pig.png?[hash:6]!../../img/skin/emojione-animals/balls/6.png');
var colorClear = require('file?name=cc.png?[hash:6]!../../img/skin/emojione-animals/balls/colorclear.png');
var vertical = require('file?name=oh.png?[hash:6]!../../img/skin/emojione-animals/balloverlays/vertical.png');
var areaclear = require('file?name=ac.png?[hash:6]!../../img/skin/emojione-animals/balloverlays/areaclear.png');

interface OverlayOptions {
	className: string;
	content: string;
	closeOnBackgroundClick: boolean;
	closedCallback?: () => void;
	postRenderCallback?: (element: HTMLElement) => void;
	showBannerAd?: boolean
}

class UIState {
	get overlayVisible() {
		return this.helpVisible || this.customOverlay;
	}
	helpVisible = false;
	feedbackVisible = false;
	connectionErrorVisible = false;
	bottomAdVisible = false;

	customOverlay: OverlayOptions;

	closeSrc = closeSvg;
	matchable1Src = matchable1;
	colorClearSrc = colorClear;
	verticalSrc = vertical;
	areaclearSrc = areaclear;
}

class Manager {
	element: HTMLElement;
	feedbackElement: HTMLElement;
	bottomAdElement: HTMLElement;
	uiState = new UIState();

	private feedbackVisible = false;

	constructor(private game: Phaser.Game) {
		this.game.scale.fullScreenTarget = document.documentElement;
		this.element = document.getElementById('overlay');
		this.feedbackElement = document.getElementById('feedback-overlay');
		this.bottomAdElement = document.getElementById('bottom-ad');

		this.render();

		this.init();
	}

	private init() {
		let btns = document.getElementById('bottom-corner-buttons');
		btns.style.display = 'block';

		btns.getElementsByClassName("help-button")[0].addEventListener('click', () => {
			this.uiState.helpVisible = !this.uiState.helpVisible;
			this.render();
		});
		btns.getElementsByClassName("feedback-button")[0].addEventListener('click', () => {
			this.uiState.feedbackVisible = true;
			this.render();
		});
		btns.getElementsByClassName("fullscreen-button")[0].addEventListener('click', () => {
			if (this.game.scale.isFullScreen) {
				this.game.scale.stopFullScreen();
			} else {
				this.game.scale.startFullScreen(false);
			}
		});
	}

	showOverlay(overlayOptions: OverlayOptions) {
		this.uiState.customOverlay = overlayOptions;

		this.render();
	}

	hideOverlay() {
		this.uiState.customOverlay = null;
		this.render();
	}

	setConnectionError(showError: boolean) {
		this.uiState.connectionErrorVisible = showError;
		this.render();
	}

	render() {
		this.element.innerHTML = template(this.uiState);

		if (this.feedbackVisible != this.uiState.feedbackVisible) {
			this.feedbackVisible = this.uiState.feedbackVisible;
			this.feedbackElement.innerHTML = feedbackTemplate(this.uiState);

			this.addEventHandlers(this.feedbackElement, false);
		}
		if (this.uiState.bottomAdVisible != (this.uiState.customOverlay && this.uiState.customOverlay.showBannerAd || false)) {
			this.uiState.bottomAdVisible = (this.uiState.customOverlay && this.uiState.customOverlay.showBannerAd || false);
			if (this.uiState.bottomAdVisible) {
				//Cludge to make it not get hidden/shown when the game initially loads
				if (this.bottomAdElement.innerHTML == '') {
					this.bottomAdElement.innerHTML = '<ins class="adsbygoogle" style="display:inline-block;width:728px;height:90px" data-ad-client="ca-pub-4749031612968477" data-ad-slot="9178345940"></ins>';
					((<any>window).adsbygoogle || []).push({});
				}
			} else {
				this.bottomAdElement.innerHTML = '';
			}
		}
		if (this.uiState.customOverlay && this.uiState.customOverlay.postRenderCallback) {
			this.uiState.customOverlay.postRenderCallback(document.getElementById('overlay'));
		}
		this.addEventHandlers(this.element, this.uiState.helpVisible || (this.uiState.customOverlay && this.uiState.customOverlay.closeOnBackgroundClick));
	}

	private addEventHandlers(element: HTMLElement, closeOnBackgroundClick: boolean) {

		if (closeOnBackgroundClick) {
			let overlay = element.getElementsByClassName("overlay-background")[0];
			overlay.addEventListener('click', () => this.closeOverlays());
		}
		let closeButton = element.getElementsByClassName("close-button")[0];
		if (closeButton) {
			closeButton.addEventListener('click', () => this.closeOverlays());
		}

	}

	private closeOverlays() {
		if (this.uiState.feedbackVisible) {
			this.uiState.feedbackVisible = false;
		} else if (this.uiState.helpVisible) {
			this.uiState.helpVisible = false;
		} else if (this.uiState.customOverlay) {
			let closedCallback = this.uiState.customOverlay.closedCallback;
			this.uiState.customOverlay = null;
			if (closedCallback) {
				closedCallback();
			}
		}
		this.render();
	}
}

export = Manager;