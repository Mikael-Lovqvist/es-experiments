
// NEXT UP - product normalization

//import { Abbrevations as D } from '../lib/dimensions.mjs';
//import { Abbrevations as U } from '../lib/derived_units.mjs';

//NOTE: ChatGPT discussion (ignore cursed beginning) https://chatgpt.com/share/6792bb29-c20c-8005-939c-d8a1c333f7ef

//NOTE: 0⁰ could be a concern since it is undefined.
//NOTE: Our product currently assumes commutative operations but we may want to support non-commutative ones as well
//NOTE: Handle division by 0


import { All_Dimensions as D } from '../lib/dimensions.mjs';
import { All_Units as U } from '../lib/derived_units.mjs';

//import * as U from '../lib/units.mjs';
import * as CT from '../lib/core_types.mjs';
import * as T from '../lib/tokens.mjs';
import * as F from '../lib/functions.mjs';
import * as DU from '../lib/derived_units.mjs';


import { Simple_Parser } from '../lib/simple_parser.mjs';
import { Dimensional_Resolver, Type_Resolver } from '../lib/resolver.mjs';

const State_Serializer = new Type_Resolver('State_Serializer');

State_Serializer.add_rule(CT.Unit, (item) => {return {
	type: 'CT.Unit',
	id: item.identifier,
}});

State_Serializer.add_rule(CT.Dimension, (item) => {return {
	type: 'CT.Dimension',
	id: item.identifier,
}});


//TODO - rename resolver to reflect specific case
const Power_Resolver = new Type_Resolver('Power_Resolver');	//Note that this resolver will evaluate the power of each
//Requirement: Has to copy powers when passing through, so that we may update them later without causing side effects

Power_Resolver.add_rule(Array, (item) => {
	return item.map(element => { return Power_Resolver.resolve(element) });
});

Power_Resolver.add_rule(F.Power, (item) => { return new F.Power(item.base, Evaluate(item.exponent)) });
Power_Resolver.add_rule(CT.Unit, (item) => { return new F.Power(item, 1) });
Power_Resolver.add_rule(CT.Dimension, (item) => { return new F.Power(item, 1) });


const Evaluation_Resolver = new Type_Resolver('Evaluation_Resolver');
function Evaluate(expr) {
	return Evaluation_Resolver.resolve(expr);
}


//Evaluation_Resolver.add_rule(T.Constant, (item) => {return Evaluation_Resolver.resolve(new F.Less_Than(item.left.value, item.right))});

Evaluation_Resolver.add_rule(Number, (item) => { return item; });
Evaluation_Resolver.add_rule(T.Constant, (item) => { return item.value; });
Evaluation_Resolver.add_rule(CT.Unit, (item) => { return item; }); // No further resolution
Evaluation_Resolver.add_rule(CT.Dimension, (item) => { return item; }); // No further resolution

Evaluation_Resolver.add_rule(F.Less_Than, (item) => {
	//Note - we could numerically evaluate left and right and compare them
	//		but we may want to take into account that in the future we may want to
	//		be able to compare non precise values without full upfront evaluation
	//		But for now, we will simply get the final evaluation and compare those.

	const left = Evaluate(item.left);
	const right = Evaluate(item.right);
	return left < right;
});


Evaluation_Resolver.add_rule(DU.Derived_Unit, (item) => { return item.expression; });


function get_product_of_powers(expression) {

	let prepared;

	if (expression instanceof F.Product) {
		prepared = expression;
	} else {
		prepared = Evaluate(expression);
	}

	if (!(prepared instanceof F.Product)) {
		prepared = new F.Product(prepared);
	}

	return prepared;
}


function collate_powers_by_base(target, base_map, all_bases, product) {
	for (const power of Power_Resolver.resolve(product.operands)) {
		const base_key = JSON.stringify(State_Serializer.resolve(power.base));
		base_map.set(base_key, power.base);
		power.base = base_key;
		target.set(power.base, power.exponent)
		all_bases.add(power.base);
	}

}

Evaluation_Resolver.add_rule(F.Divide, (item) => {

	const dividend = get_product_of_powers(item.dividend);
	const divisor = get_product_of_powers(item.divisor);

	const dividend_powers = new Map();
	const divisor_powers = new Map();
	const all_bases = new Set();
	const result = [];
	const base_map = new Map();

	collate_powers_by_base(dividend_powers, base_map, all_bases, dividend);
	collate_powers_by_base(divisor_powers, base_map, all_bases, divisor);

	for (const base of all_bases) {
		const delta_exp = (dividend_powers.get(base) ?? 0) - (divisor_powers.get(base) ?? 0);
		if (delta_exp == 0) {

		} else if (delta_exp == 1) {
			result.push(base_map.get(base));
		} else {
			result.push(new F.Power(base_map.get(base), delta_exp));
		}
	}

	if (result.length == 0) {
		return new T.Constant(1);
	} else if (result.length == 1) {
		return result[0];
	} else {
		return new F.Product(...result);
	}


});

Evaluation_Resolver.add_rule(F.Multiply, (item) => {

	//PROBLEM: We are not properly factorizing the products into expressions where we can collate the powers

	const operands = get_product_of_powers(new F.Product(...item.operands));

	const powers = new Map();
	const all_bases = new Set();
	const result = [];
	const base_map = new Map();

	collate_powers_by_base(powers, base_map, all_bases, operands);


/*
	for (const base of all_bases) {
		const delta_exp = (dividend_powers.get(base) ?? 0)  (divisor_powers.get(base) ?? 0);
		if (delta_exp == 0) {

		} else if (delta_exp == 1) {
			result.push(base_map.get(base));
		} else {
			result.push(new F.Power(base_map.get(base), delta_exp));
		}
	}*/

	if (result.length == 0) {
		return new T.Constant(1);
	} else if (result.length == 1) {
		return result[0];
	} else {
		return new F.Product(...result);
	}



/*	const dividend = get_product_of_powers(item.dividend);
	const divisor = get_product_of_powers(item.divisor);

	const dividend_powers = new Map();
	const divisor_powers = new Map();
	const all_bases = new Set();
	const result = [];
	const base_map = new Map();

	collate_powers_by_base(dividend_powers, base_map, all_bases, dividend);
	collate_powers_by_base(divisor_powers, base_map, all_bases, divisor);

	for (const base of all_bases) {
		const delta_exp = (dividend_powers.get(base) ?? 0) - (divisor_powers.get(base) ?? 0);
		if (delta_exp == 0) {

		} else if (delta_exp == 1) {
			result.push(base_map.get(base));
		} else {
			result.push(new F.Power(base_map.get(base), delta_exp));
		}
	}

	if (result.length == 0) {
		return new T.Constant(1);
	} else if (result.length == 1) {
		return result[0];
	} else {
		return new F.Product(...result);
	}*/


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
	new F.Divide(U.Volt, U.Ampere)
);

console.log(inspect(r, { depth: null, colors: true }));



//console.log(inspect(U.R, { depth: null, colors: true }));

const r2 = Evaluate(
	new F.Divide(D.Mass, D.Time)
);
console.log(inspect(r2, { depth: null, colors: true }));

const r3 = Evaluate(
	new F.Multiply(D.Mass, D.Time)
);
console.log(inspect(r3, { depth: null, colors: true }));


/*const r2 = Evaluate(
	new F.Multiply(D.Mass, D.Time)
);
*/



//console.log(Object.keys(U))
//console.log(inspect(U.V, { depth: null, colors: true }));
//console.log();

//console.log(inspect(U.V, { depth: null, colors: true }));