// Separate tokens as symbols and patterns

import { inspect } from 'util';

import * as P from 'ml-es-experiments/parser.mjs';
import * as PRL from 'ml-es-experiments/parser_rule_list.mjs';
import * as PR from 'ml-es-experiments/parser_rule.mjs';
import * as PA from 'ml-es-experiments/parser_action.mjs';
import { Character_Mapping } from 'ml-es-experiments/string_utils.mjs';


const Token_Definitions = P.Create_Symbols_And_Patterns({

	//Single character
	LEFT_PARENTHESIS: /\(/,
	RIGHT_PARENTHESIS: /\)/,

	MIDDLE_DOT: /·/,
	ASTERISK: /\*/,

	SOLIDUS: /\//,
	DIVISION_SIGN: /÷/,

	PLUS_SIGN: /\+/,
	HYPHEN_MINUS: /-/,

	DBL_QUOTE: /"/,

	//Multi character
	TEXT: null,	//Should we have a special DEFAULT symbol that we could use here? That could be incorporated in pattern factories
	EXPRESSION: null, //This however is not a default thing, just a token without a pattern
	STRING: null,

	SCALAR: /[-]?(?:\d+|\.\d+|\d+\.\d+)(?:[eE][+-]?\d+)?/,
	SUPERSCRIPT: /[⁺⁻]?[⁰¹²³⁴⁵⁶⁷⁸⁹]+/,
	SUBSCRIPT: /[₀₁₂₃₄₅₆₇₈₉]+/,
	WHITESPACE: /\s+/,

});

const SUPERSCRIPT_TRANSLATION = new Character_Mapping('⁺⁻⁰¹²³⁴⁵⁶⁷⁸⁹', '+-0123456789');
const SUBSCRIPT_TRANSLATION = new Character_Mapping('₀₁₂₃₄₅₆₇₈₉', '0123456789');


console.log(Token_Definitions.get_pattern_by_name('SOLIDUS'));
console.log(Token_Definitions.get_symbol_by_name('SOLIDUS'));


function *Create_Rules_From_Token_Map_That_Pushes_Token(token_definitions, token_list) {
	for (const token of token_list) {
		const symbol = token_definitions.resolve_symbol(token);
		const pattern = token_definitions.require(symbol);
		yield new PR.Pattern_Rule(pattern, (ctx) => {
			return new PA.Push_Token(symbol);
		});
	}
}




const pdef = new P.Rule_Based_Parser({

	string: new PRL.Parser_Rule_List([
		new PR.Default_Rule((ctx) => {
			return new PA.Push_Token(Token_Definitions.resolve_symbol('TEXT'));
		}),
		new PR.Pattern_Rule(Token_Definitions.resolve('DBL_QUOTE'), (ctx) => {
			return new PA.Push_To_Parent(Token_Definitions.resolve_symbol('STRING'));
		}),
	]),

	expression: new PRL.Parser_Rule_List([
		new PR.Default_Rule((ctx) => {	//See note about TEXT in token def, we may later be able to simply put this in the Create_Rules_From_Token_Map_That_Pushes_Token
			return new PA.Push_Token(Token_Definitions.resolve_symbol('TEXT'));
		}),
		new PR.Pattern_Rule(Token_Definitions.resolve('WHITESPACE'), (ctx) => {
			return PA.NO_ACTION;
		}),

		new PR.Pattern_Rule(Token_Definitions.resolve('RIGHT_PARENTHESIS'), (ctx) => {
			return new PA.Push_To_Parent(Token_Definitions.resolve_symbol('EXPRESSION'));
		}),

		new PR.Pattern_Rule(Token_Definitions.resolve('LEFT_PARENTHESIS'), (ctx) => {
			return new PA.Enter_Parser();
		}),


		new PR.Pattern_Rule(Token_Definitions.resolve('DBL_QUOTE'), (ctx) => {
			return new PA.Enter_Parser('string');
		}),



		...Create_Rules_From_Token_Map_That_Pushes_Token(Token_Definitions, [
			'MIDDLE_DOT', 'ASTERISK',
			'SOLIDUS', 'DIVISION_SIGN',
			'PLUS_SIGN', 'HYPHEN_MINUS',
			'SCALAR', 'SUPERSCRIPT', 'SUBSCRIPT'
		]),


/*
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
*/
	]),
});

//const test_string = '100V / (10 MΩ + 10Ω)';
const test_string = '1 + "SOME STRING" + 2';

const res = pdef.parse('expression', test_string);
console.log(inspect(res, { depth: null, colors: true }));

