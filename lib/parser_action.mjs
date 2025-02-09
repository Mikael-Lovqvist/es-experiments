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

export class Push_Token {
	constructor(type) {
		this.type = type;
	}
}


export const PUSH_TO_RESULT = Symbol('PUSH_TO_RESULT');
export const NO_ACTION = Symbol('NO_ACTION');