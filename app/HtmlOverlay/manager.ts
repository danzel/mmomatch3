declare function require(filename: string): (data: {}) => string;

var template = <(data: UIState) => string> require('./template.handlebars');
require('./template.css');

class UIState {
	helpVisible = false;
}

class Manager {
	element: HTMLElement;
	uiState = new UIState();
	
	constructor(containerId: string) {
		this.element = document.getElementById(containerId);
		this.element.innerHTML = template(this.uiState);
		this.fixSvgs(this.element.getElementsByTagName("svg"))
	}
	
	private fixSvgs(svgs: NodeListOf<SVGElement>) {
		for (let i = 0; i < svgs.length; i++) {
			this.fixSvg(svgs[i]);
		}
	}
	
	private fixSvg(svg: SVGElement): void {
		let bbox = (<SVGLocatable><any>svg).getBBox();
		console.log('bbox', bbox);
		
		svg.setAttribute("width", bbox.width + "px");
		svg.setAttribute("height", bbox.height + "px");
	}
}

export = Manager;