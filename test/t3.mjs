//import * as D from '../lib/dimensions.mjs';
import { Abbrevations as U } from '../lib/units.mjs';
//import { Abbrevations as P } from '../lib/prefixes.mjs';

console.log(U.kg.format_value(1, U.kg.default_prefix));		//	1 kilogram
console.log(U.kg.format_value(3, U.kg.default_prefix));		//	3 kilograms
console.log(U.kg.format_value(0, U.kg.default_prefix));		//	0 kilograms
console.log(U.kg.format_value(-1, U.kg.default_prefix));	//	-1 kilograms
console.log(U.s.format_value(3, U.s.default_prefix));		//	3 seconds
console.log(U.C.format_value(27, U.C.default_prefix));		//	27 degrees celsius
console.log(U.F.format_value(1, U.F.default_prefix));		//	1 degree fahrenheit




