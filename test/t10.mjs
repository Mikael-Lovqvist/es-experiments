/*

	Experiments with using factories for working with vectors and such


*/

import { Simple_Parser } from '../lib/simple_parser.mjs';


class Vector {
	constructor(...identities) {
		this.identities = identities;
		this.lut = new Map(identities.map((identity, index) => [identity, index]));
	}
}

class TypedReference {
	constructor(name, type) {
		this.name = name;
		this.type = type;
	}
}

class Argument extends TypedReference {}
class Intermediate extends TypedReference {}

const vec_2 = new Vector('x', 'y');
const vec_3 = new Vector('x', 'y', 'z');
const uv_2 = new Vector('u', 'v');


import { inspect } from 'util';


function create_function_from_expression(name, parameters, expression, scope) {

	const parsed_expression = Simple_Parser(expression);

	console.log(inspect(parsed_expression, { depth: null, colors: true }));

	//const parsed_expression = (new Resolver({ ...D, ...U })).resolve(Simple_Parser(expression));
	//return new this(parsed_expression, name, abbrevation, default_prefix, identity_override, sub_unit);

}




create_function_from_expression('lerp', ['p'], 'p(b - a) + a', {
	p: new Argument('p', vec_2),
	a: new Intermediate('a', vec_2),
	b: new Intermediate('b', vec_2),
});

/*	OUTPUT from unfinished create_function_from_expression

Sum {
  operands: [
    Product {
      operands: [
        Variable { name: 'p' },
        Sum {
          operands: [
            Variable { name: 'b' },
            Negated { operands: [ Variable { name: 'a' } ] }
          ]
        }
      ]
    },
    Variable { name: 'a' }
  ]
}

*/
