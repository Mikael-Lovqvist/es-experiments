export class Pattern_Rule {
	constructor(pattern, handler) {
		this.pattern = pattern;
		this.handler = handler;
	}

};

export class Default_Rule {
	constructor(handler) {
		this.handler = handler;
	}
};


export function *Create_Multiple_Pattern_Rules(pattern_list, handler) {
	for (const pattern of pattern_list) {
		yield new Pattern_Rule(pattern, handler);
	}
}