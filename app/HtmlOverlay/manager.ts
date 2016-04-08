declare function require(filename: string): (data: {}) => string;

var template = require('./template.handlebars');

class Manager {
	element: HTMLElement;

	constructor(containerId: string) {
		this.element = document.getElementById(containerId);

		this.element.addEventListener('click', (ev) =>
			console.log(ev)
		);

		this.element.innerHTML = template({text: 'asdasdasdasd'});
	}
}

export = Manager;