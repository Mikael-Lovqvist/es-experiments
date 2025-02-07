import * as DU from 'ml-es-experiments/derived_units.mjs';

//Simple_Parser works for unit based formulas - we should rename it or make a specific named one
//import { Simple_Parser } from 'ml-es-experiments/simple_parser.mjs';

import { Simple_SI_Math_Expression_Parser } from 'ml-es-experiments/simple_parser.mjs';

//This only works in node, just for testing
import { inspect } from 'util';

console.log(inspect(Simple_SI_Math_Expression_Parser('100V / (10 MΩ + 10Ω)'), { depth: null, colors: true }));
console.log(inspect(Simple_SI_Math_Expression_Parser('100V / (10 mΩ + 10Ω)'), { depth: null, colors: true }));
