export class Pattern_Match {
	constructor(match, rule) {
		this.match = match;
		this.rule = rule;
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
	constructor(value, index, end_index, rule) {
		this.value = value;
		this.index = index;
		this.end_index = end_index;
		this.rule = rule;
	}

	get pending_index() {
		if (this.end_index === null) {
			return null;
		} else {
			return this.end_index;
		}
	}

};

