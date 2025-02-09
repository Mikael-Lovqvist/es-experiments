// Step 1 - define a simple parser that in turn uses another one. Classical one could be expressions consisting of paranthesis and strings with some simple escape.
import { inspect } from 'util';

import * as PA from 'ml-es-experiments/parser_action.mjs';
import * as P from 'ml-es-experiments/parser.mjs';
import * as PR from 'ml-es-experiments/parser_rule.mjs';
import * as PRL from 'ml-es-experiments/parser_rule_list.mjs';

/*
	Specification in EBNF-like language (not formally defined yet)
	Notice: We are not aiming to just be able to ingest this and spit out a parser (at least not now)
			This is just in order to have a strict definition for the case study

	expression:
		- '(' expression ')'
		- ( string | WHITESPACE )+

	string_innards:
		- '\"'
		- !('"')

	string:
		- '"' string_innards '"'


	low level definitions:
		expression:
			- LPAR expression RPAR
			- ( string | WHITESPACE )+

		string_innards:
			- ESCAPED_DOUBLE_QUOTE
			- Anything

		string:
			- DOUBLE_QUOTE string_innards DOUBLE_QUOTE

	tokens:
		WHITESPACE: /\w+/y
		DOUBLE_QUOTE: /"/y
		ESCAPED_DOUBLE_QUOTE: /\\"/y
		LPAR: /\(/y
		RPAR: /\)/y

	example expressions:
		- "hello" ("world" "!")
		- "this is a \"qoutation\""


*/


class TOKEN {
	static WHITESPACE = /\w+/;
	static DOUBLE_QUOTE = /"/;
	static ESCAPED_DOUBLE_QUOTE = /\\"/;
	static LPAR = /\(/;
	static RPAR = /\)/;
};


// Refactor naming to reflect what is a rule, pattern, match, action and so forth




const pdef = new P.Rule_Based_Parser({

	string: new PRL.Parser_Rule_List([
		new PR.Pattern_Rule(TOKEN.DOUBLE_QUOTE, (ctx) => {
			return new PA.Enter_Parser('string_innards');
		}),
	]),

	string_innards: new PRL.Parser_Rule_List([
		new PR.Pattern_Rule(TOKEN.DOUBLE_QUOTE, (ctx) => {
			return new PA.Push_To_Parent(ctx.named_rule);
		}),
		new PR.Pattern_Rule(TOKEN.ESCAPED_DOUBLE_QUOTE, (ctx) => {
			return PA.PUSH_TO_RESULT;
		}),
		new PR.Default_Rule((ctx) => {
			return PA.PUSH_TO_RESULT;
		}),
	]),
});


//const test_string = '##2---1--1';
//const test_string = 'blaargh';
const test_string = '"\\"hello\\" world" more stuff';


const res = pdef.parse('string', test_string);
console.log(inspect(res, { depth: null, colors: true }));