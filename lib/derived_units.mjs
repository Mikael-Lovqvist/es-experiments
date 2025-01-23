import { Derived_Unit } from './core_types.mjs';

import { Abbrevations as D } from './dimensions.mjs';
import { Abbrevations as U } from './units.mjs';

const BASE_SCOPE = { ...D, ...U };


//example to chatgpt:
//export const Joule = Derived_Unit.from_expression(BASE_SCOPE, 'kg·m²·s⁻²', 'Joule|s', 'J'); 	// NOTE: We may omit middle dot

//Result from chatgpt
export const Joule = Derived_Unit.from_expression(		BASE_SCOPE, 'kg·m²·s⁻²', 		'Joule|s', 		'J');
export const Newton = Derived_Unit.from_expression(		BASE_SCOPE, 'kg·m·s⁻²', 		'Newton|s', 	'N');
export const Pascal = Derived_Unit.from_expression(		BASE_SCOPE, 'kg·m⁻¹·s⁻²', 		'Pascal|s', 	'Pa');
export const Watt = Derived_Unit.from_expression(		BASE_SCOPE, 'kg·m²·s⁻³', 		'Watt|s', 		'W');
export const Coulomb = Derived_Unit.from_expression(	BASE_SCOPE, 's·A', 				'Coulomb|s', 	'C');
export const Volt = Derived_Unit.from_expression(		BASE_SCOPE, 'kg·m²·s⁻³·A⁻¹', 	'Volt|s', 		'V');
export const Ohm = Derived_Unit.from_expression(		BASE_SCOPE, 'kg·m²·s⁻³·A⁻²', 	'Ohm|s', 		'Ω');
export const Siemens = Derived_Unit.from_expression(	BASE_SCOPE, 'kg⁻¹·m⁻²·s³·A²', 	'Siemens|s', 	'S');
export const Weber = Derived_Unit.from_expression(		BASE_SCOPE, 'kg·m²·s⁻²·A⁻¹', 	'Weber|s', 		'Wb');
export const Tesla = Derived_Unit.from_expression(		BASE_SCOPE, 'kg·s⁻²·A⁻¹', 		'Tesla|s', 		'T');
export const Henry = Derived_Unit.from_expression(		BASE_SCOPE, 'kg·m²·s⁻²·A⁻²', 	'Henry|s', 		'H');
export const Lumen = Derived_Unit.from_expression(		BASE_SCOPE, 'cd·sr', 			'Lumen|s', 		'lm');
export const Lux = Derived_Unit.from_expression(		BASE_SCOPE, 'cd·sr·m⁻²', 		'Lux|s', 		'lx');
export const Becquerel = Derived_Unit.from_expression(	BASE_SCOPE, 's⁻¹', 				'Becquerel|s', 	'Bq');
export const Gray = Derived_Unit.from_expression(		BASE_SCOPE, 'm²·s⁻²', 			'Gray|s', 		'Gy');
export const Sievert = Derived_Unit.from_expression(	BASE_SCOPE, 'm²·s⁻²', 			'Sievert|s', 	'Sv');
export const Katal = Derived_Unit.from_expression(		BASE_SCOPE, 'mol·s⁻¹', 			'Katal|s', 		'kat');
