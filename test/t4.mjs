import * as DU from '../lib/derived_units.mjs';
import { simple_parser } from '../lib/simple_parser.mjs';


//This only works in node, just for testing
import { inspect } from 'util';


console.log(inspect(simple_parser('kg·m²·s⁻²'), { depth: null, colors: true }));

/*
Product {
  operands: [
    Variable { name: 'kg' },
    Power {
      base: Variable { name: 'm' },
      exponent: Constant { value: 2 }
    },
    Power {
      base: Variable { name: 's' },
      exponent: Constant { value: -2 }
    }
  ]
}

*/