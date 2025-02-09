
//TODO - we should define an abstract match with fields that should be available across the child classes, such as `type` which is an optional annotation when matching tokens.

export class Pattern_Match {
	constructor(match, rule, type=null) {
		this.match = match;
		this.rule = rule;
		this.type = type;
	}

	get pending_index() {
		return this.match.index + this.match[0].length;
	}

};

export class Sequence_Match {
	constructor(type, sequence) {
		this.type = type;
		this.sequence = sequence;
	}
}

export class Default_Match {
	constructor(value, index, end_index, rule, type=null) {
		this.value = value;
		this.index = index;
		this.end_index = end_index;
		this.rule = rule;
		this.type = type;
	}

	get pending_index() {
		if (this.end_index === null) {
			return null;
		} else {
			return this.end_index;
		}
	}

};

