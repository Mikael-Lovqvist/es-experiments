// Step 1 - define a simple parser that in turn uses another one. Classical one could be expressions consisting of paranthesis and strings with some simple escape.

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

class S {
	static Rule = Symbol('Rule');
}


class TOKEN {
	static WHITESPACE = /\w+/;
	static DOUBLE_QUOTE = /"/;
	static ESCAPED_DOUBLE_QUOTE = /\\"/;
	static LPAR = /\(/;
	static RPAR = /\)/;
};



class Default_Match {
	constructor(value, index, end_index, rule) {
		this.value = value;
		this.index = index;
		this.end_index = end_index;
		this[S.Rule] = rule;	//We could refine this later by not hijacking the match objects and clean things up
	}
};




class Simple_Parser_Definition {
	constructor(named_rules) {
		this.named_rules = named_rules;
	}
};


class Simple_Pattern_Rule {
	constructor(pattern, handler) {
		this.pattern = pattern;
		this.handler = handler;
	}

};

class Simple_Default_Rule {
	constructor(handler) {
		this.handler = handler;
	}
};




class Simple_Parser_Rule_List {
	constructor(rules) {
		this.rules = rules;
	}

	get default_rule() {
		for (const rule of this.rules) {
			if (rule instanceof Simple_Default_Rule) {
				return rule;
			}
		}
	}

	feed(text, position=0) {

		for (const M of this.find_matches(text, position)) {
			console.log('M', M);
		}

	}

	_handle_default_match(value, index, end_index=null) {
		const default_rule = this.default_rule;
		if (!default_rule) {
			throw `Parsing failed, no match for ${JSON.stringify(value)}` ; //TODO actual exception object
		}
		return new Default_Match(value, index, end_index, default_rule);
	}

	*find_matches(text, position=0) {
		// First pass - immediate matches
		for (const rule of this.rules) {
			if (rule instanceof Simple_Pattern_Rule) {
				const pattern = new RegExp(rule.pattern.source, rule.pattern.flags + 'y');
				pattern.lastIndex = position;
				const match = pattern.exec(text);
				if (match) {
					match[S.Rule] = rule;
					yield match;
					return;
				}
			}
		}

		// Second pass - global matches
		let best_match;
		for (const rule of this.rules) {
			if (rule instanceof Simple_Pattern_Rule) {
				const pattern = new RegExp(rule.pattern.source, rule.pattern.flags + 'g');
				pattern.lastIndex = position;
				const match = pattern.exec(text);

				if (match) {
					if ((best_match === undefined) || (best_match.index > match.index)) {
						match[S.Rule] = rule;
						best_match = match;
					}
				}
			}
		}

		// There was no match, just get the tail
		if (!best_match) {
			const tail = text.slice(position);
			if (tail.length) {
				yield this._handle_default_match(tail, position);
			}
			return;
		}

		// There was a match, check the head
		const head = text.slice(position, best_match.index);
		if (head.length) {
			yield this._handle_default_match(head, position, best_match.index);
		}

		yield best_match;

	}

};

/*
 else if (rule instanceof Simple_Default_Rule) {
				default_rule = rule;
			}*/


const pdef = new Simple_Parser_Definition({

	string_innards: new Simple_Parser_Rule_List([
		new Simple_Pattern_Rule(TOKEN.ESCAPED_DOUBLE_QUOTE, (ctx) => {
			console.log('DBL QUOT', ctx);
		}),
		new Simple_Default_Rule((ctx) => {
			console.log('DEFAULT', ctx);
		}),
	]),

	test: new Simple_Parser_Rule_List([
		new Simple_Pattern_Rule(/1/, (ctx) => {
			console.log('ONE', ctx);
		}),
		new Simple_Pattern_Rule(/2/, (ctx) => {
			console.log('TWO', ctx);
		}),
		new Simple_Default_Rule((ctx) => {
			console.log('DEFAULT', ctx);
		}),
	]),

});


//pdef.named_rules.string_innards.feed('\\"hello\\" world!');

pdef.named_rules.test.feed('em2pty');
//pdef.named_rules.test.feed('2---1--1');



//console.log(pdef.named_rules.string_innards);
