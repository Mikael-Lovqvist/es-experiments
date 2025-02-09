import * as W from './english.mjs';

export class Dimension {
	constructor(name, abbreviation, identity_override) {
		this.name = name;
		this.abbreviation = abbreviation;
		this.identity_override = identity_override;
	}

	get identifier() {
		return this.identity_override ?? this.abbreviation;
	}

}


export class Prefix {
	constructor(name, abbreviation, scaling_factor, identity_override) {
		this.name = name;
		this.abbreviation = abbreviation;
		this.scaling_factor = scaling_factor;
		this.identity_override = identity_override;
	}

	get identifier() {
		return this.identity_override ?? this.abbreviation;
	}

}




/*

	name
	symbol					//Single string or list of strings
	default_reference		//t for time or N for count
	dimension
	purpose
	reference_unit


	//runtime requirements
	//preferred notation
	//formatting



*/


export class Unit {
	constructor(dimension, name, abbreviation, default_prefix, identity_override, sub_unit) {
		this.dimension = dimension;
		this.name = W.parse_name(name);
		this.abbreviation = abbreviation;
		this.default_prefix = default_prefix;
		this.identity_override = identity_override;
		this.sub_unit = sub_unit;
	}

	get identifier() {
		const abbr = this.identity_override ?? this.abbreviation;
		const prefix = this.default_prefix?.abbreviation ?? '';
		return `${prefix}${abbr}`;
	}

	format_value(value, prefix) {

		if (this.sub_unit) {
			if (value == 1) {
				const sub_unit = `${this.sub_unit.name.singular} ${this.name.name}`.toLowerCase();
				return `1 ${sub_unit}`
			} else {
				const sub_unit = `${this.sub_unit.name.plural} ${this.name.name}`.toLowerCase();
				return `${value} ${sub_unit}`
			}
		} else {
			const pfx = prefix?.name ?? '';

			if (value == 1) {
				const unit = `${pfx}${this.name.singular}`.toLowerCase();
				return `1 ${unit}`
			} else {
				const unit = `${pfx}${this.name.plural}`.toLowerCase();
				return `${value} ${unit}`
			}
		}
	}

}


