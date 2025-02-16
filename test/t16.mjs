/*

	This is a crazy experiment in which to make it easier to implement rewrite systems.
	The purpose here is to be able to do something like

	Head transformation variants

		Op₀ - - Op₁ ... → Op₀ + Op₁ ...

		HEAD: Op0 - - Op1 → Op0 + Op1


		HEAD: Op₀ - - Op₁ → Op₀ + Op₁



*/

import { Character_Mapping } from 'ml-es-experiments/string_utils.mjs';
import * as P from 'ml-es-experiments/parser.mjs';
import * as PR from 'ml-es-experiments/parser_rule.mjs';
import * as PRL from 'ml-es-experiments/parser_rule_list.mjs';
import * as PA from 'ml-es-experiments/parser_action.mjs';

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

function define_rule(rule) {
	const rule_tokens = pdef.parse('rule', rule)
	const label = pop_label(rule_tokens);
	const [left, right] = arrow_split(rule_tokens);
	return new Symbolic_Rewrite_Rule(label, left, right);
}

class Symbolic_Rewrite_Rule {
	constructor(label, left, right) {
		this.label = label;
		this.left = left;
		this.right = right;
	}
}



const r = define_rule('Head: Op₀ - - Op₁ → Op₀ + Op₁');