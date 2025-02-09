import { Character_Mapping } from '../../string_utils.mjs';
import * as P from '../../parser.mjs';
import * as PR from '../../parser_rule.mjs';
import * as PA from '../../parser_action.mjs';

export const Token_Definitions = P.Create_Symbols_And_Patterns({

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

export const SUPERSCRIPT_TRANSLATION = new Character_Mapping('⁺⁻⁰¹²³⁴⁵⁶⁷⁸⁹', '+-0123456789');
export const SUBSCRIPT_TRANSLATION = new Character_Mapping('₀₁₂₃₄₅₆₇₈₉', '0123456789');

export const SYMBOL = Token_Definitions.symbol_lut_object;
export const PATTERN = Token_Definitions.pattern_lut_object;


export function *Create_Rules_From_Token_Map_That_Pushes_Token(token_list) {
	for (const token of token_list) {
		const symbol = Token_Definitions.resolve_symbol(token);
		const pattern = Token_Definitions.require(symbol);
		yield new PR.Pattern_Rule(pattern, (ctx) => {
			return new PA.Push_Token(symbol);
		});
	}
}


