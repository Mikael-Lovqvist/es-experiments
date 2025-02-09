//Now deprecated in favor of t14.mjs
/* We are aiming to get back to t11 but first we want to reimplement simple_parser used in

 	- lib/derived_units.mjs
 	- test/t4.mjs
 	- test/t5.mjs
 	- test/t8.mjs
 	- test/t9.mjs
 	- test/t10.mjs
 	- test/t11.mjs
 	- test/t11.mjs


We aim to parse 'kg·m²·s⁻²' by defining a parser using the improved parser system.
Once this is done we could erase t13 because it has served its purpose by then.


*/

import { inspect } from 'util';


import * as PA from 'ml-es-experiments/parser_action.mjs';
import * as P from 'ml-es-experiments/parser.mjs';
import * as PR from 'ml-es-experiments/parser_rule.mjs';
import * as PRL from 'ml-es-experiments/parser_rule_list.mjs';

import { Character_Mapping } from 'ml-es-experiments/string_utils.mjs';




class TOKEN {
	//Single character
	static LEFT_PARENTHESIS = /\(/;
	static RIGHT_PARENTHESIS = /\)/;

	static MIDDLE_DOT = /·/;
	static ASTERISK = /\*/;

	static SOLIDUS = /\//;
	static DIVISION_SIGN = /÷/;

	static PLUS_SIGN = /\+/;
	static HYPHEN_MINUS = /-/;

	//Multi character
	static IDENTIFIER = /\w+/;
	static SCALAR = /[-]?(?:\d+|\.\d+|\d+\.\d+)(?:[eE][+-]?\d+)?/;
	static SUPERSCRIPT = /[⁺⁻]?[⁰¹²³⁴⁵⁶⁷⁸⁹]+/;
	static SUBSCRIPT = /[₀₁₂₃₄₅₆₇₈₉]+/;
	static WHITESPACE = /\s+/;

	//Translations
	static SUPERSCRIPT_TRANSLATION = new Character_Mapping('⁺⁻⁰¹²³⁴⁵⁶⁷⁸⁹', '+-0123456789');
	static SUBSCRIPT_TRANSLATION = new Character_Mapping('₀₁₂₃₄₅₆₇₈₉', '0123456789');

};


const pdef = new P.Rule_Based_Parser({

	expression: new PRL.Parser_Rule_List([
		new PR.Default_Rule((ctx) => {
			return PA.PUSH_TO_RESULT;
		}),

		new PR.Pattern_Rule(TOKEN.RIGHT_PARENTHESIS, (ctx) => {
			return new PA.Push_To_Parent('expression');	//TODO - should we call it this? Should it be a symbol?
		}),
		new PR.Pattern_Rule(TOKEN.LEFT_PARENTHESIS, (ctx) => {
			return new PA.Enter_Parser('expression');
		}),
		new PR.Pattern_Rule(TOKEN.WHITESPACE, (ctx) => {
			return PA.NO_ACTION;
		}),

		...PR.Create_Multiple_Pattern_Rules([
			TOKEN.MIDDLE_DOT, TOKEN.ASTERISK,
			TOKEN.SOLIDUS, TOKEN.DIVISION_SIGN,
			TOKEN.PLUS_SIGN, TOKEN.HYPHEN_MINUS,
			TOKEN.SUPERSCRIPT, TOKEN.SUBSCRIPT,
			TOKEN.SCALAR,
			], (ctx) => {
				return PA.PUSH_TO_RESULT;
			}
		),

	]),
});


const test_string = '100V / (10 MΩ + 10Ω)';

const res = pdef.parse('expression', test_string);
console.log(inspect(res, { depth: null, colors: true }));

