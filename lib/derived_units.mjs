import { Abbrevations as D } from './dimensions.mjs';
import { Abbrevations as U } from './units.mjs';
import { Simple_Parser } from './simple_parser.mjs';
import { Resolver } from './resolver.mjs';

import * as W from './wiktionary.mjs';

const BASE_SCOPE = { ...D, ...U };


export class Derived_Unit {
	constructor(expression, name, abbrevation, default_prefix, identity_override, sub_unit) {
		this.expression = expression;	//Dimensional product
		this.name = W.parse_name(name);
		this.abbrevation = abbrevation;
		this.default_prefix = default_prefix;
		this.identity_override = identity_override;
	}

	get identifier() {
		const abbr = this.identity_override ?? this.abbrevation;
		const prefix = this.default_prefix?.abbrevation ?? '';
		return `${prefix}${abbr}`;
	}

	static from_expression(scope, expression, name, abbrevation, default_prefix, identity_override, sub_unit) {
		const parsed_expression = (new Resolver({ ...D, ...U })).resolve(Simple_Parser(expression));
		return new this(parsed_expression, name, abbrevation, default_prefix, identity_override, sub_unit);
	}

}


//example to chatgpt:
//export const Joule = Derived_Unit.from_expression(BASE_SCOPE, 'kg·m²·s⁻²', 'Joule|s', 'J'); 	// NOTE: We may omit middle dot

//static from_expression(scope, expression, name, abbrevation, default_prefix, identity_override, sub_unit) {

//Result from chatgpt
export const Joule = Derived_Unit.from_expression(		BASE_SCOPE, 'kg·m²·s⁻²', 		'Joule|s', 		'J');
export const Newton = Derived_Unit.from_expression(		BASE_SCOPE, 'kg·m·s⁻²', 		'Newton|s', 	'N');
export const Pascal = Derived_Unit.from_expression(		BASE_SCOPE, 'kg·m⁻¹·s⁻²', 		'Pascal|s', 	'Pa');
export const Watt = Derived_Unit.from_expression(		BASE_SCOPE, 'kg·m²·s⁻³', 		'Watt|s', 		'W');
export const Coulomb = Derived_Unit.from_expression(	BASE_SCOPE, 's·A', 				'Coulomb|s', 	'C');
export const Volt = Derived_Unit.from_expression(		BASE_SCOPE, 'kg·m²·s⁻³·A⁻¹', 	'Volt|s', 		'V');
export const Ohm = Derived_Unit.from_expression(		BASE_SCOPE, 'kg·m²·s⁻³·A⁻²', 	'Ohm|s', 		'Ω', null, 'R');
export const Siemens = Derived_Unit.from_expression(	BASE_SCOPE, 'kg⁻¹·m⁻²·s³·A²', 	'Siemens|s', 	'S');
export const Weber = Derived_Unit.from_expression(		BASE_SCOPE, 'kg·m²·s⁻²·A⁻¹', 	'Weber|s', 		'Wb');
export const Tesla = Derived_Unit.from_expression(		BASE_SCOPE, 'kg·s⁻²·A⁻¹', 		'Tesla|s', 		'T');
export const Henry = Derived_Unit.from_expression(		BASE_SCOPE, 'kg·m²·s⁻²·A⁻²', 	'Henry|s', 		'H');
export const Lumen = Derived_Unit.from_expression(		BASE_SCOPE, 'cd·sr', 			'Lumen|s', 		'lm');
export const Lux = Derived_Unit.from_expression(		BASE_SCOPE, 'cd·sr·m⁻²', 		'Lux|s', 		'lx');
export const Becquerel = Derived_Unit.from_expression(	BASE_SCOPE, 'pc·s⁻¹', 				'Becquerel|s', 	'Bq');
export const Gray = Derived_Unit.from_expression(		BASE_SCOPE, 'm²·s⁻²', 			'Gray|s', 		'Gy');
export const Sievert = Derived_Unit.from_expression(	BASE_SCOPE, 'm²·s⁻²', 			'Sievert|s', 	'Sv');
export const Katal = Derived_Unit.from_expression(		BASE_SCOPE, 'mol·s⁻¹', 			'Katal|s', 		'kat');

const List_of_derived_Units = [Joule, Newton, Pascal, Watt, Coulomb, Volt, Ohm, Siemens, Weber, Tesla, Henry, Lumen, Lux, Becquerel, Gray, Sievert, Katal];
const List_of_all_Units = [...Object.values(U), ...List_of_derived_Units];
export const Abbrevations = Object.fromEntries(List_of_all_Units.map(item => [item.identifier, item]));	//TODO - here and other places, a strict utility function that also checks that we are getting proper identifiers
export const All_Units = Object.fromEntries(List_of_all_Units.map(item => [item.name.singular, item]));
