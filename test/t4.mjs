import * as DU from 'ml-es-experiments/derived_units.mjs';
import { Simple_Parser } from 'ml-es-experiments/simple_parser.mjs';


//This only works in node, just for testing
import { inspect } from 'util';


console.log(inspect(Simple_Parser('kg·m²·s⁻²'), { depth: null, colors: true }));

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