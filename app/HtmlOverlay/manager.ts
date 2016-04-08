declare function require(filename: string): (data: {}) => string;

var template = <(data: UIState) => string>require('./template.handlebars');
require('./template.css');

class UIState {
	helpVisible = false;
}

class Manager {
	element: HTMLElement;
	uiState = new UIState();

	constructor(containerId: string) {
		this.element = document.getElementById(containerId);

		this.render();
	}

	render() {
		this.element.innerHTML = template(this.uiState);
		this.fixSvgs(this.element);

		this.element.getElementsByClassName("help-button")[0].addEventListener('click', () => {
			this.uiState.helpVisible = !this.uiState.helpVisible;
			this.render();
		});

		let overlay = this.element.getElementsByClassName("overlay-background")[0];
		if (overlay) {
			overlay.addEventListener('click', () => this.closeOverlays());
		}
		let closeButton = this.element.getElementsByClassName("close-button")[0];
		if (closeButton) {
			closeButton.addEventListener('click', () => this.closeOverlays());
		}
		
	}
	
	private closeOverlays() {
		this.uiState.helpVisible = false;
		this.render();
	}

	private fixSvgs(parent: HTMLElement) {

		let texts = parent.getElementsByTagName("text");
		for (let i = 0; i < texts.length; i++) {
			let t = texts[i];

			t.setAttribute("x", "50%");
			t.setAttribute("y", "50%");
			t.setAttribute("dy", "0.3em");
		}

		let svgs = parent.getElementsByTagName("svg")
		for (let i = 0; i < svgs.length; i++) {
			this.fixSvg(svgs[i]);
		}
	}

	private fixSvg(svg: SVGElement): void {
		let bbox = (<SVGLocatable><any>svg).getBBox();
		console.log('bbox', bbox);

		svg.setAttribute("width", Math.ceil(4 + bbox.width) + "px");
		svg.setAttribute("height", Math.ceil(2 + bbox.height) + "px");
	}
}

export = Manager;