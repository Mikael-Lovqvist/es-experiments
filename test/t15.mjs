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

import * as AST from 'ml-es-experiments/ast2.mjs';
import * as RC from 'ml-es-experiments/resolver_conditions.mjs';

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
			'MIDDLE_DOT', 'ASTERISK', 'CIRCUMFLEX_ACCENT',
			'SOLIDUS', 'DIVISION_SIGN',
			'PLUS_SIGN', 'HYPHEN_MINUS',
			'SCALAR', 'SUPERSCRIPT', 'SUBSCRIPT'
		]),


	]),
});

//const test_string = '100V / (10 MΩ + 10Ω)';
//const test_string = '(230 sqrt(2))V / (10 MΩ + 10Ω) + 5²';
const test_string = 'f(P₁ - P₀) + P₀';
//const test_string = 'A - -B(123)';

//const test_string = 'A + B(123)';
//const test_string = '(A + B)123';
//const test_string = '5(A + B)';
//const test_string = '5A + B';

//const test_string = 'A ^ B';

/*

	- - → +
	+ - → -
	- + → -
	+ + → +

 	A - - B
 	A + B
 	Addition(A, B)



	A
	A -
	A - - →  A +
	A + B

*/



const res = new PM.Sequence_Match(TS.EXPRESSION, pdef.parse('expression', test_string));	//Because we haven't added an outer wrapper yet
//console.log(inspect(res, { depth: null, colors: true }));

import { Mapping_Resolver, Structural_Resolver, HANDLER } from 'ml-es-experiments/resolver.mjs';

const SUPERSCRIPT_TRANSLATION = new Character_Mapping('⁺⁻⁰¹²³⁴⁵⁶⁷⁸⁹', '+-0123456789');
const SUBSCRIPT_TRANSLATION = new Character_Mapping('₀₁₂₃₄₅₆₇₈₉', '0123456789');


const mr = new Mapping_Resolver();

const SEQ_BINOP = new RC.Member_of_Set(new Set([AST.Addition, AST.Subtraction, AST.Multiplication, AST.Division, AST.Power]));


const stack_tail_rules = new Structural_Resolver('stack_tail_rules', false, HANDLER);

stack_tail_rules.add_identity_tail_sequence_rule([AST.Subtraction, AST.Subtraction], (item, ctx) => {
	ctx.multi_pop(2);
	ctx.stack.push(AST.Addition);	//Document better when to use "quiet push" - or have a better system that will run reduction as long as it can and stop
});

stack_tail_rules.add_tail_sequence_rule([new RC.Instance(AST.Operand), SEQ_BINOP, new RC.Instance(AST.Operand)], (item, ctx) => {
	const [left, operand, right] = ctx.multi_pop(3);
	ctx.stack.push(new operand(left, right));
});


// Implicit multiplication between binop and operand
stack_tail_rules.add_tail_sequence_rule([new RC.Instance(AST.Binary_Operation), new RC.Instance(AST.Operand)], (item, ctx) => {
	const [binop, op] = ctx.multi_pop(2);	// A ⊙ B C → A ⊙ (B * C)
	ctx.stack.push(new binop.constructor(binop.left, new AST.Multiplication(binop.right, op)));	//TODO - mark implicit?
});

// Implicit multiplication between subexpression and operand
stack_tail_rules.add_tail_sequence_rule([new RC.Instance(AST.Operand), new RC.Instance(AST.Operand)], (item, ctx) => {
	const [op1, op2] = ctx.multi_pop(2);	// A B → A * B
	ctx.stack.push(new AST.Multiplication(op1, op2));	//TODO - mark implicit?
});



const subscript_resolver = new Mapping_Resolver('subscript_resolver');

subscript_resolver.add_rule(AST.Variable, (item, ctx) => {
	const text = ctx.stack.pop().match[0];	//We pop directly from stack here since it is considered a transient operand
	const index = string_to_integer(SUBSCRIPT_TRANSLATION.translate_string(text));
	ctx.push(new AST.Index_of(item, index));
});


mr.add_rule(TS.TEXT, (item, ctx) => {
	//TODO - here we can check for known functions
	ctx.push(new AST.Variable(item.value));
});

mr.add_rule(TS.HYPHEN_MINUS, (item, ctx) => {
	ctx.push(AST.Subtraction);
});

mr.add_rule(TS.PLUS_SIGN, (item, ctx) => {
	ctx.push(AST.Addition);
});

mr.add_rule(TS.ASTERISK, (item, ctx) => {
	ctx.push(AST.Multiplication);
});

mr.add_rule(TS.SOLIDUS, (item, ctx) => {
	ctx.push(AST.Division);
});

mr.add_rule(TS.CIRCUMFLEX_ACCENT, (item, ctx) => {
	ctx.push(AST.Power);
});

mr.add_rule(TS.SCALAR, (item, ctx) => {
	ctx.push(new AST.Number(Number(item.match[0])));
});


mr.add_rule(TS.SUBSCRIPT, (item, ctx) => {
	const pending = ctx.pop();
	ctx.stack.push(item)
	subscript_resolver.resolve_by_constructor(pending, ctx);
});

mr.add_rule(TS.EXPRESSION, (item, ctx) => {
	const sub_context = ctx.branch();
	for (const sub_item of item.sequence) {
		sub_context.feed(sub_item);
	}
	ctx.push(sub_context.get_final_reduction())
});



function string_to_integer(string, strict=true) {
	const num = Number(string);
	if (strict && (isNaN(num) || !Number.isInteger(num))) {
		throw new Error(`Invalid integer: "${string}"`);
	}
	return num;
}


function isClass(value) {
	return (
		typeof value === "function" &&
		value.prototype &&
		Object.getOwnPropertyDescriptor(value, "prototype")?.writable === false
	);
}


function short_description(item) {
	if (item === undefined) {
		return '???';
	} else if (isClass(item)) {
		return item.name;
	} else if (item.toString) {
		return item.toString();
	} else {
		return item.constructor.name;
	}
}

function short_stack_summary(stack) {
	return stack.map(short_description).join(' → ');
}

class Resolver_Context {
	constructor(resolver, parent=null, stack=[]) {
		this.resolver = resolver;
		this.parent = parent;
		this.stack = stack;
	}

	branch() {
		return new this.constructor(this.resolver, this);
	}

	get top() {
		return this.stack.at(-1);
	}

	check_reduce() {
		//console.log(`Should check stack of ${this.stack.length} items`);
		return stack_tail_rules.resolve(this.stack, this);
	}

	push(item) {	//TODO - better name to indicate this is intermediate input
		this.stack.push(item);
	}

	pop(mandatory=true) {
		const result = this.stack.pop();
		if (mandatory && (result === undefined)) {
			throw 'Pop from empty stack';	//TODO - improve
		}
		return result;
	}

	multi_pop(count, mandatory=true) {
		if (count > this.stack.length) {
			throw 'Pop from too shallow stack';	//TODO - improve
		}
		return this.stack.splice(-count, count);
	}

	feed(item) {	//TODO - maybe better name to indicate that this is input
		this.resolver.resolve_by_key(item.type, item, this);
	}

	get_final_reduction() {

		console.log('Final reduction');
		while (true) {
			console.log(`Stack is ${short_stack_summary(this.stack)}`);

			if (!this.check_reduce()) {
				break;
			} else {
				console.log('Performed reduction');
			}
		}

		if (this.stack.length >= 1) {
			return new AST.Sub_Expression(this.stack);
		} else {
			return;	//Empty - should we have a problem here?
		}

	}

};


const ctx = new Resolver_Context(mr);
ctx.feed(res);

