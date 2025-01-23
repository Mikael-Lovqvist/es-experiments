import { Abbrevations as D } from '../lib/dimensions.mjs';
import { Abbrevations as U } from '../lib/units.mjs';

import { Simple_Parser } from '../lib/simple_parser.mjs';
import { Resolver } from '../lib/resolver.mjs';


//This only works in node, just for testing
import { inspect } from 'util';


const resolved_expr = (new Resolver({ ...D, ...U })).resolve(Simple_Parser('kg·m²·s⁻²'));
console.log(inspect(resolved_expr, { depth: null, colors: true }));

/*
Product {
  operands: [
    Unit {
      dimension: undefined,
      name: Countable { singular: 'Gram', plural: 'Grams' },
      abbrevation: 'g',
      default_prefix: Prefix {
        name: 'Kilo',
        abbrevation: 'k',
        scaling_factor: 1000,
        identity_override: undefined
      },
      identity_override: null,
      sub_unit: undefined
    },
    Power {
      base: Unit {
        dimension: undefined,
        name: Countable { singular: 'Meter', plural: 'Meters' },
        abbrevation: 'm',
        default_prefix: null,
        identity_override: null,
        sub_unit: undefined
      },
      exponent: Constant { value: 2 }
    },
    Power {
      base: Unit {
        dimension: undefined,
        name: Countable { singular: 'Second', plural: 'Seconds' },
        abbrevation: 's',
        default_prefix: null,
        identity_override: null,
        sub_unit: undefined
      },
      exponent: Constant { value: -2 }
    }
  ]
}
*/


console.log()
const resolved_expr2 = (new Resolver({ ...D, ...U })).resolve(Simple_Parser('M·L²·T⁻²'));
console.log(inspect(resolved_expr2, { depth: null, colors: true }));

