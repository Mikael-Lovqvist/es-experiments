export class Push_To_Parent {
	constructor(type) {
		this.type = type;
	}
}

export class Enter_Parser {
	constructor(name) {
		this.name = name;
	}
}

export const PUSH_TO_RESULT = Symbol('PUSH_TO_RESULT');