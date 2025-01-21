export class Dimension {
	constructor(name, abbrevation) {
		this.name = name;
		this.abbrevation = abbrevation;
	}

}


export class Prefix {
	constructor(name, abbrevation, scaling_factor, identity_override) {
		this.name = name;
		this.abbrevation = abbrevation;
		this.scaling_factor = scaling_factor;
		this.identity_override = identity_override;
	}

	get identifier() {
		return this.identity_override ?? this.abbrevation;
	}

}


export class Unit {
	constructor(dimension, name, abbrevation, default_prefix, identity_override) {
		this.dimension = dimension;
		this.name = name;
		this.abbrevation = abbrevation;
		this.default_prefix = default_prefix;
		this.identity_override = identity_override;
	}

	get identifier() {
		const abbr = this.identity_override ?? this.abbrevation;
		const prefix = this.default_prefix?.abbrevation ?? '';
		return `${prefix}${abbr}`;
	}

}
