// Step 1 - define a simple parser that in turn uses another one. Classical one could be expressions consisting of paranthesis and strings with some simple escape.
import { inspect } from 'util';


//TODO - when moving to library this should live in its own module that we could import as A or PA for parser action perhaps
class Push_To_Parent {
	constructor(type) {
		this.type = type;
	}
}

class Enter_Parser {
	constructor(name) {
		this.name = name;
	}
}


class PA {
	static PUSH_TO_RESULT = Symbol('AS.PUSH_TO_RESULT');
	static Push_To_Parent = Push_To_Parent;
	static Enter_Parser = Enter_Parser;
}




//Move to iterator util module

class Switchable_Iterator {
	constructor(iterator=null) {
		this.iterator = iterator;
	}

	switch_to(iterator) {
		this.iterator = iterator;
	}

	next() {
		return this.iterator.next();
	}

	[Symbol.iterator]() {
		return this;
	}

}



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

class Sequence_Match {
	constructor(type, sequence) {
		this.type = type;
		this.sequence = sequence;
	}
}

class Default_Match {
	constructor(value, index, end_index, rule) {
		this.value = value;
		this.index = index;
		this.end_index = end_index;
		this.rule = rule;
	}

	get pending_index() {
		if (this.end_index === null) {
			return null;
		} else {
			return this.end_index;
		}
	}

};

class Pattern_Match {
	constructor(match, rule) {
		this.match = match;
		this.rule = rule;
	}

	get pending_index() {
		return this.match.index + this.match[0].length;
	}

};



class Simple_Parser_Definition {
	constructor(named_rules) {
		this.named_rules = named_rules;
	}

	parse(rule_name, source, position=0, additional_context={}) {
		const ctx = {
			stack: [[]],
			parser: this,
			named_rule: rule_name,
			source: source,
		};

		ctx.parser.feed(ctx, position);
		return ctx.stack.pop();	//TODO - verify stack is sound
	}

	feed(ctx, position) {
		const rule_set = this.named_rules[ctx.named_rule];
		const iterator = new Switchable_Iterator(rule_set.feed(ctx.source, position));

		for (const M of iterator) {

			const pending_result = ctx.stack.at(-1);

			const action = M.rule.handler({
				...ctx,
				match: M,
			});

			if (action === PA.PUSH_TO_RESULT) {
				pending_result.push(M);
			} else if (action instanceof PA.Push_To_Parent) {

				const popped_from_stack = ctx.stack.pop();
				const pending_result = ctx.stack.at(-1);
				pending_result.push(new Sequence_Match(action.type, popped_from_stack));

			} else if (action instanceof PA.Enter_Parser) {
				ctx.stack.push([]);
				const rule_set = this.named_rules[action.name];
				iterator.switch_to(rule_set.feed(ctx.source, M.pending_index));
			} else {
				throw `Unknown action: ${inspect(action, { depth: null, colors: true })}`;
			}

		}

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

	*feed(text, position=0) {

		while (true) {
			const new_chunk = [...this.find_matches(text, position)];

			if (new_chunk.length) {
				position = new_chunk.at(-1).pending_index;
				yield* new_chunk;
			} else {
				position = null;
			}

			if (position === null) {
				return;
			}
		}

	}

	_handle_default_match(value, index, end_index=null) {
		const default_rule = this.default_rule;
		if (!default_rule) {
			throw `Parsing failed, no match for ${JSON.stringify(value)} (${inspect(this, { depth: null, colors: true })})` ; //TODO actual exception object
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
					yield new Pattern_Match(match, rule);
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
					if ((best_match === undefined) || (best_match.match.index > match.index)) {
						best_match = new Pattern_Match(match, rule);
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
		const head = text.slice(position, best_match.match.index);
		if (head.length) {
			yield this._handle_default_match(head, position, best_match.match.index);
		}

		yield best_match;

	}

};


const pdef = new Simple_Parser_Definition({

	string: new Simple_Parser_Rule_List([
		new Simple_Pattern_Rule(TOKEN.DOUBLE_QUOTE, (ctx) => {
			return new PA.Enter_Parser('string_innards');
		}),
	]),

	string_innards: new Simple_Parser_Rule_List([
		new Simple_Pattern_Rule(TOKEN.DOUBLE_QUOTE, (ctx) => {
			return new PA.Push_To_Parent(ctx.named_rule);
		}),
		new Simple_Pattern_Rule(TOKEN.ESCAPED_DOUBLE_QUOTE, (ctx) => {
			return PA.PUSH_TO_RESULT;
		}),
		new Simple_Default_Rule((ctx) => {
			return PA.PUSH_TO_RESULT;
		}),
	]),


});


//const test_string = '##2---1--1';
//const test_string = 'blaargh';
const test_string = '"\\"hello\\" world" more stuff';


const res = pdef.parse('string', test_string);
console.log(inspect(res, { depth: null, colors: true }));