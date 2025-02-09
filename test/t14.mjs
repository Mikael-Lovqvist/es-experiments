// Separate tokens as symbols and patterns

import { inspect } from 'util';

import * as P from 'ml-es-experiments/parser.mjs';
import * as PRL from 'ml-es-experiments/parser_rule_list.mjs';
import * as PR from 'ml-es-experiments/parser_rule.mjs';
import * as PA from 'ml-es-experiments/parser_action.mjs';
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

const res = pdef.parse('expression', test_string);
console.log(inspect(res, { depth: null, colors: true }));

