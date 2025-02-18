/*

This experiment works from t16.mjs but here we want to be able to capture a variable and then compare against that capture so what we could match against patterns such as "A B A C"


*/

import * as P from 'ml-es-experiments/parser.mjs';
import * as PR from 'ml-es-experiments/parser_rule.mjs';
import * as PRL from 'ml-es-experiments/parser_rule_list.mjs';
import * as PA from 'ml-es-experiments/parser_action.mjs';
import * as S from 'ml-es-experiments/symbols.mjs';

import { Structural_Resolver, Stack_Interface } from 'ml-es-experiments/resolver.mjs';
import { Rule } from 'ml-es-experiments/resolver_rules.mjs';

const Token_Definitions = P.Create_Symbols_And_Patterns({
	RIGHTWARDS_ARROW: /→/,
	COLON: /:/,

	//Multi character
	TEXT: null,	//Should we have a special DEFAULT symbol that we could use here? That could be incorporated in pattern factories
	NATURAL: /[0-9]+/,
	WHITESPACE: /\s+/,

});


const TS = Token_Definitions.symbol_lut_object;
const TP = Token_Definitions.pattern_lut_object;


function *Create_Rules_From_Token_Map_That_Pushes_Token(token_list) {
	for (const token of token_list) {
		const symbol = Token_Definitions.resolve_symbol(token);
		const pattern = Token_Definitions.require(symbol);
		yield new PR.Pattern_Rule(pattern, (ctx) => {
			return new PA.Push_Token(symbol);
		});
	}
}


const pdef = new P.Rule_Based_Parser({

	rule: new PRL.Parser_Rule_List([
		new PR.Default_Rule((ctx) => {
			return new PA.Push_Token(TS.TEXT);
		}),
		new PR.Pattern_Rule(TP.WHITESPACE, (ctx) => {
			return PA.NO_ACTION;
		}),

		...Create_Rules_From_Token_Map_That_Pushes_Token([
			'NATURAL', 'RIGHTWARDS_ARROW', 'COLON',
		]),

	]),

});



function conditional_split(sequence, condition) {
	const result = [[]];
	for (const item of sequence) {
		if (condition(item)) {
			result.push([]);
		} else {
			result.at(-1).push(item)
		}
	}
	return result;
}


function pop_label(sequence) {
	const [label, contents] = conditional_split(sequence, item => item.type === TS.COLON);
	if (label && label.length === 1 && contents !== undefined) {
		sequence.splice(0, 2);
		return label[0].value;
	}
}


function arrow_split(sequence) {
	const [left, right] = conditional_split(sequence, item => item.type === TS.RIGHTWARDS_ARROW);
	if (left.length && right.length) {
		return [left, right];
	}
}


class Symbolic_Rewrite_Rule {
	constructor(label, left, right) {
		this.label = label;
		this.left = left;
		this.right = right;
	}
}



const rule_tokens = pdef.parse('rule', 'Op₀ - Op₀');
//const rule_tokens = pdef.parse('rule', 'Op - Op');

class Regexp_Structural_Resolver extends Structural_Resolver {
	add_regexp_rule(pattern, handler) {
		this.rules.push(new Rule(item => pattern.test(item.value), handler));
	}

	/*
		Note: This experiment creates top level bindings but now we are using it on the regex strucural resolver.
		This experiment is set up in a flawed way where we sort of have all the components but we are not properly putting them together.

		We should also improve Match-objects to already contain Structural_Resolver references

		But this showcases a few ideas we can expand upon.


	*/

	resolve(item, ctx={}) {
		if (!this.bindings) {	//Only create bindings for top level calls in case we use nested matching
			this.bindings = {};
			const result = super.resolve(item, ctx);
			return result;
			delete this.bindings;
		} else {
			return super.resolve(item, ctx);
		}
	}
}

const resolve_rules = new Regexp_Structural_Resolver('resolve_rules');

resolve_rules.rules.push(new Rule(item => item.value.match(/Op([₀₁₂₃₄₅₆₇₈₉0-9])*/), (match, ctx) => {

	const operand_index = match.value[1];	//If set, we are specifying a specific one

	console.log(resolve_rules.stack.top);
	//console.log(match.value[1]);


	return 'Hello';
}));




resolve_rules.add_regexp_rule(/-/, (item, ctx) => {
	return 'new RC.Identity(AST.Subtraction)';
})

console.log(resolve_rules.resolve_array(rule_tokens));

/*



resolve_rules.add_regexp_rule(/Z/, (item, ctx) => {
	return 'NOTHING';
})


resolve_rules.add_regexp_rule(/\+/, (item, ctx) => {
	return 'new RC.Identity(AST.Addition)';
})

console.log(resolve_rules.resolve_array(r.left));
*/