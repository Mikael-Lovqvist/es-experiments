import * as W from './wiktionary.mjs';

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
	constructor(dimension, name, abbrevation, default_prefix, identity_override, sub_unit) {
		this.dimension = dimension;
		this.name = W.parse_name(name);
		this.abbrevation = abbrevation;
		this.default_prefix = default_prefix;
		this.identity_override = identity_override;
		this.sub_unit = sub_unit;
	}

	get identifier() {
		const abbr = this.identity_override ?? this.abbrevation;
		const prefix = this.default_prefix?.abbrevation ?? '';
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


export class Derived_Unit {
	constructor(expression, name, abbrevation, default_prefix, identity_override, sub_unit) {
		this.expression = expression;	//Dimensional product
		this.name = W.parse_name(name);
		this.abbrevation = abbrevation;
		this.default_prefix = default_prefix;
		this.identity_override = identity_override;
	}

	static from_expression(scope, expression, name, abbrevation, default_prefix, identity_override, sub_unit) {

		const parsed_expression = null;	//TODO
		//console.log('need to parse', expression, 'using', Object.keys(scope));

		return new this(parsed_expression, name, abbrevation, default_prefix, identity_override, sub_unit);

	}

}