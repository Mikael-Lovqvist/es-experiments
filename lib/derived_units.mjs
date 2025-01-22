import { Derived_Unit } from './core_types.mjs';

import { Abbrevations as D } from './dimensions.mjs';
import { Abbrevations as U } from './units.mjs';

const BASE_SCOPE = { ...D, ...U };


export const Joule = Derived_Unit.from_expression(BASE_SCOPE, 'kg·m²·s⁻²', 'Joule|s', 'J'); 	// NOTE: We may omit middle dot
