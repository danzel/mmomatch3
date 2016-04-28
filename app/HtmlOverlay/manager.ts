declare function require(filename: string): string | ((data: {}) => string);
var template = <(data: UIState) => string>require('./template.handlebars');
var feedbackTemplate = <(data: UIState) => string>require('./feedback.handlebars');
require('./template.css');
var closeSvg = require('file?name=close.svg?[hash:6]!../../img/ui/close.svg');

interface OverlayOptions {
	closeOnBackgroundClick: boolean;
	closedCallback?: () => void;
	postRenderCallback?: (element: HTMLElement) => void;
}

class UIState {
	get overlayVisible() {
		return this.helpVisible || this.customOverlayVisible;
	}
	helpVisible = false;
	feedbackVisible = false;
	
	closeSrc = closeSvg;

	customOverlayVisible = false;
	customOverlayClass: string;
	customOverlayContent: string;
	customOverlayOptions: OverlayOptions;
}

class Manager {
	element: HTMLElement;
	feedbackElement: HTMLElement;
	uiState = new UIState();

	private feedbackVisible = false;

	constructor() {
		this.element = document.getElementById('overlay');
		this.feedbackElement = document.getElementById('feedback-overlay');

		this.render();
	}

	showOverlay(overlayClass: string, overlayContent: string, overlayOptions: OverlayOptions) {
		this.uiState.customOverlayVisible = true;
		this.uiState.customOverlayClass = overlayClass;
		this.uiState.customOverlayContent = overlayContent;
		this.uiState.customOverlayOptions = overlayOptions;

		this.render();
	}

	hideOverlay() {
		this.uiState.customOverlayVisible = false;
		this.render();
	}

	render() {
		this.element.innerHTML = template(this.uiState);
		this.fixSvgs(this.element);

		if (this.feedbackVisible != this.uiState.feedbackVisible) {
			this.feedbackVisible = this.uiState.feedbackVisible;
			this.feedbackElement.innerHTML = feedbackTemplate(this.uiState);
			this.fixSvgs(this.feedbackElement);

			this.addEventHandlers(this.feedbackElement, false);
		}
		if (this.uiState.customOverlayVisible && this.uiState.customOverlayOptions.postRenderCallback) {
			this.uiState.customOverlayOptions.postRenderCallback(document.getElementById('overlay'));
		}

		this.element.getElementsByClassName("help-button")[0].addEventListener('click', () => {
			this.uiState.helpVisible = !this.uiState.helpVisible;
			this.render();
		});
		this.element.getElementsByClassName("feedback-button")[0].addEventListener('click', () => {
			this.uiState.feedbackVisible = true;
			this.render();
		});
		this.addEventHandlers(this.element, this.uiState.helpVisible || (this.uiState.customOverlayOptions && this.uiState.customOverlayOptions.closeOnBackgroundClick));
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
		} else if (this.uiState.customOverlayVisible) {
			this.uiState.customOverlayVisible = false;
			if (this.uiState.customOverlayOptions.closedCallback) {
				this.uiState.customOverlayOptions.closedCallback();
			}
			this.uiState.customOverlayOptions = null;
		}
		this.render();
	}

	private NS = {
		svg: "http://www.w3.org/2000/svg",
		xlink: "http://www.w3.org/1999/xlink"
	};

	private idCounter = 0;

	private fixSvgs(parent: HTMLElement) {

		let texts = parent.getElementsByTagName("text");
		for (let i = 0; i < texts.length; i++) {
			let t = texts[i];

			t.setAttribute("x", "50%");
			t.setAttribute("y", "50%");
			t.setAttribute("dy", "0.3em");

			//If you are on a crappy browser (IE11) that doesn't support paint-order, fix it
			//ref http://radar.oreilly.com/2015/11/elegant-outlines-with-svg-paint-order.html
			if ((<any>t).style["paint-order"] === undefined) {
				t.id = t.id || ("z" + (this.idCounter++));
				var g1 = document.createElementNS(this.NS.svg, "g");    //<5>
				g1.setAttribute("class", t.getAttribute("class"));
				t.removeAttribute("class");
				t.parentNode.insertBefore(g1, t);

				var g2 = document.createElementNS(this.NS.svg, "g");    //<6>
				(<any>g2).style["fill"] = "none";
				g2.insertBefore(t, null);
				g1.insertBefore(g2, null);

				var u = document.createElementNS(this.NS.svg, "use");   //<7>
				u.setAttributeNS(this.NS.xlink, "href", "#" + t.id);
				(<any>u).style["stroke-width"] = "0";
				g1.insertBefore(u, null);
			}
		}

		let svgs = parent.getElementsByTagName("svg")
		for (let i = 0; i < svgs.length; i++) {
			this.fixSvg(svgs[i]);
		}
	}

	private fixSvg(svg: SVGElement): void {
		let bbox = (<SVGLocatable><any>svg).getBBox();

		svg.setAttribute("width", Math.ceil(10 + bbox.width) + "px");
		svg.setAttribute("height", Math.ceil(4 + bbox.height) + "px");
	}
}

export = Manager;