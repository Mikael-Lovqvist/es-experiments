import { Match } from './resolver_match.mjs';

export class Comparative_Condition {
	constructor(value) {
		this.value = value;
	}
}

export class Instance extends Comparative_Condition {
	match(item) {
		if (item instanceof this.value) {
			return new Match(this, item);
		}
	}
};

export class Identity extends Comparative_Condition {
	match(item) {
		if (item === this.value) {
			return new Match(this, item);
		}
	}
};

export class Member_of_Set extends Comparative_Condition {
	match(item) {
		if (this.value.has(item)) {
			return new Match(this, item);
		}
	}
};