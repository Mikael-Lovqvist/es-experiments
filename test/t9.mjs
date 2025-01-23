import { Abbrevations as D } from '../lib/dimensions.mjs';
import { Abbrevations as U } from '../lib/derived_units.mjs';
import * as T from '../lib/tokens.mjs';
import * as F from '../lib/functions.mjs';
import * as DU from '../lib/derived_units.mjs';


import { Simple_Parser } from '../lib/simple_parser.mjs';
import { Dimensional_Resolver, Type_Resolver } from '../lib/resolver.mjs';

const Evaluation_Resolver = new Type_Resolver('Evaluation_Resolver');
function Evaluate(expr) {
	return Evaluation_Resolver.resolve(expr);
}

//Evaluation_Resolver.add_rule(T.Constant, (item) => {return Evaluation_Resolver.resolve(new F.Less_Than(item.left.value, item.right))});

Evaluation_Resolver.add_rule(Number, (item) => { return item; });
Evaluation_Resolver.add_rule(T.Constant, (item) => { return item.value; });

Evaluation_Resolver.add_rule(F.Less_Than, (item) => {
	//Note - we could numerically evaluate left and right and compare them
	//		but we may want to take into account that in the future we may want to
	//		be able to compare non precise values without full upfront evaluation
	//		But for now, we will simply get the final evaluation and compare those.

	const left = Evaluate(item.left);
	const right = Evaluate(item.right);
	return left < right;
});



const Fractional_Resolver = new Type_Resolver('Fractional_Resolver');

Fractional_Resolver.add_rule(DU.Derived_Unit, (item) => {return Fractional_Resolver.resolve(item.expression)});
Fractional_Resolver.add_rule(F.Product, (item) => {

	const reciprocal_factors = [];
	const positive_factors = [];

	for (const op of item.operands) {
		//Currently we directly check if this is a power with a negative exponent but later we could have a resolver for checking this condition (which could handle other expressions that would fit).
		if ((op instanceof F.Power) && Evaluate(new F.Less_Than(op.exponent, 0))) {
			reciprocal_factors.push(op);
		} else {
			positive_factors.push(op);
		}
	}

	return new F.Fraction(
		new F.Product(...reciprocal_factors),
		new F.Product(...positive_factors)
	);
});



//This only works in node, just for testing
import { inspect } from 'util';


//const r = Fractional_Resolver.resolve(U.V);
//console.log(r);

const r = Evaluate(
	new F.Divide(U.V, U.R)
);






//console.log(Object.keys(U))
//console.log(inspect(U.V, { depth: null, colors: true }));
//console.log();

//console.log(inspect(U.V, { depth: null, colors: true }));