import Type = require('./type');

export = {
	isGetToBottom(type: Type) {
		return (type == Type.GetToBottom || type == Type.GetToBottomRace1 || type == Type.GetToBottomRace2);
	}
}