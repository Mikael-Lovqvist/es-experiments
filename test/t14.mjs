//TODO: This should be rewritten a bit. We need to add a reducing ruleset that can boil down expressions.
/*

I am thinking that perhaps I should define some nice interfaces for the context to make it easier to work with,
perhaps a pending flat sequence for the context, that way we could have a rule system that could for instance
first try to reduce things already on the stack, then it will see if there are things pending in the flat sequence
and work through that until there is nothing left to do and hopefully at that time there is only one thing on the
stack that can be returned to the parent expression.

*/

// Separate tokens as symbols and patterns

import { inspect } from 'util';

import * as P from 'ml-es-experiments/parser.mjs';
import * as PRL from 'ml-es-experiments/parser_rule_list.mjs';
import * as PR from 'ml-es-experiments/parser_rule.mjs';
import * as PA from 'ml-es-experiments/parser_action.mjs';
import * as PM from 'ml-es-experiments/parser_match.mjs';


import { Character_Mapping } from 'ml-es-experiments/string_utils.mjs';


import * as T from 'ml-es-experiments/dsl/local_simple_expressions/tokenization.mjs';
const TS = T.SYMBOL;
const TP = T.PATTERN;


const pdef = new P.Rule_Based_Parser({

	string: new PRL.Parser_Rule_List([
		new PR.Default_Rule((ctx) => {
			return new PA.Push_Token(TS.TEXT);
		}),
		new PR.Pattern_Rule(TP.DBL_QUOTE, (ctx) => {
			return new PA.Push_To_Parent(TS.STRING);
		}),
	]),

	expression: new PRL.Parser_Rule_List([
		new PR.Default_Rule((ctx) => {	//See note about TEXT in token def, we may later be able to simply put this in the Create_Rules_From_Token_Map_That_Pushes_Token
			return new PA.Push_Token(TS.TEXT);
		}),
		new PR.Pattern_Rule(TP.WHITESPACE, (ctx) => {
			return PA.NO_ACTION;
		}),

		new PR.Pattern_Rule(TP.RIGHT_PARENTHESIS, (ctx) => {
			return new PA.Push_To_Parent(TS.EXPRESSION);
		}),

		new PR.Pattern_Rule(TP.LEFT_PARENTHESIS, (ctx) => {
			return new PA.Enter_Parser();
		}),

		new PR.Pattern_Rule(TP.DBL_QUOTE, (ctx) => {
			return new PA.Enter_Parser('string');
		}),

		...T.Create_Rules_From_Token_Map_That_Pushes_Token([
			'MIDDLE_DOT', 'ASTERISK',
			'SOLIDUS', 'DIVISION_SIGN',
			'PLUS_SIGN', 'HYPHEN_MINUS',
			'SCALAR', 'SUPERSCRIPT', 'SUBSCRIPT'
		]),


	]),
});

//const test_string = '100V / (10 MΩ + 10Ω)';
//const test_string = '(230 sqrt(2))V / (10 MΩ + 10Ω) + 5²';
const test_string = '(P₁ - P₀)f + P₀';

const res = new PM.Sequence_Match(TS.EXPRESSION, pdef.parse('expression', test_string));	//Because we haven't added an outer wrapper yet
//console.log(inspect(res, { depth: null, colors: true }));




import { Mapping_Resolver } from 'ml-es-experiments/resolver.mjs';

const mr = new Mapping_Resolver();





class Text {
	constructor(value) {
		this.value = value;
	}
};

class Operand {};

class Variable extends Operand {
	constructor(value) {
		super();
		this.value = value;
	}
};

class Index extends Operand {
	constructor(reference, index) {
		super();
		this.reference = reference;
		this.index = index;
	}
};



class Resolver_Context {
	constructor(parent=null, stack=[]) {
		this.parent = parent;
		this.stack = stack;
	}

	get top() {
		return this.stack.at(-1);
	}

};


class OP {
	static SUBTRACT = Symbol('SUBTRACT');
	static NEGATE = Symbol('NEGATE');
};

mr.add_rule(TS.HYPHEN_MINUS, (item, ctx) => {
	if (ctx.top === undefined) {
		ctx.stack.push(OP.NEGATE);
	} else if (ctx.top instanceof Operand) {
		ctx.stack.push(OP.SUBTRACT);
	} else {
		throw 'Hypen after what?';
	}
})


mr.add_rule(TS.TEXT, (item, ctx) => {
	ctx.stack.push(new Text(item.value));
})

mr.add_rule(TS.SUBSCRIPT, (item, ctx) => {
	if (ctx.top instanceof Text) {
		ctx.stack.push(new Index(new Variable(ctx.top.value), item.value));
	} else {
		throw 'Subscript of what?';
	}

})


mr.add_rule(TS.EXPRESSION, (item, ctx) => {
	const sub_context = new Resolver_Context(ctx);
	for (const sub_item of item.sequence) {
		resolve(sub_item, sub_context);
	}
})


function resolve(item, ctx=new Resolver_Context()) {
	return mr.resolve_by_key(item.type, item, ctx);
}



console.log(resolve(res))
//mr.resolve_by_key(res[0].type, res[0]);


