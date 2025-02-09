import { Switchable_Iterator } from './iteration_utils.mjs';
import * as PA from './parser_action.mjs';
import * as PM from './parser_match.mjs';
import { inspect } from 'util';


export class Token_Map extends Map {

	require(key) {
		const result = this.get(key);
		if (result === undefined) {
			throw 'Could not resolve'; //TODO improve
		}
		return result;
	}


	get name_symbol_lut() {
		if (this._cached_name_symbol_lut === undefined) {
			this._cached_name_symbol_lut = new Map();

			for (const [symbol, pattern] of this.entries()) {
				this._cached_name_symbol_lut.set(symbol.description, symbol);
			}
		}

		return this._cached_name_symbol_lut;
	}

	get_pattern_by_name(name) {
		return this.get(this.name_symbol_lut.get(name));
	}

	get_symbol_by_name(name) {
		return this.name_symbol_lut.get(name);
	}

	require_pattern_by_name(name) {
		const result = this.get(this.name_symbol_lut.get(name));
		if (result === undefined) {
			throw 'Could not resolve'; //TODO improve
		}
		return result;
	}

	require_symbol_by_name(name) {
		const result = this.name_symbol_lut.get(name);
		if (result === undefined) {
			throw 'Could not resolve'; //TODO improve
		}
		return result;
	}

	resolve_symbol(token) {
		if (typeof token === 'string') {
			return this.require_symbol_by_name(token);
		} else if (typeof token === 'symbol') {
			return token;
		} else {
			throw 'Can not resolve this type';	//TODO improve
		}
	}

	resolve(token) {
		return this.require(this.resolve_symbol(token));
	}

}

export function Create_Symbols_And_Patterns(entries) {
	const result = new Token_Map();
	for (const [name, pattern] of Object.entries(entries)) {
		const symbol = Symbol(name);
		result.set(symbol, pattern)
	}
	return result;
}

export class Parser_Frame {
	constructor (parser, rule_name, result=[]) {
		this.parser = parser;
		this.rule_name = rule_name;
		this.result = result;
	}

	get rule_set() {
		const result = this.parser.named_rules[this.rule_name];
		if (result === undefined) {
			throw 'No such named rule';
		}
		return result;
	}

}


export class Rule_Based_Parser {
	constructor(named_rules) {
		this.named_rules = named_rules;
	}

	parse(rule_name, source, position=0, additional_context={}) {
		const ctx = {
			stack: [new Parser_Frame(this, rule_name)],
			parser: this,
			source: source,
		};

		ctx.parser.feed(ctx, position);

		const result = ctx.stack.pop().result;
		if (ctx.stack.length) {
			throw 'Stack not clean'	//TODO improve
		}

		return result;

	}

	feed(ctx, position) {
		const rule_set = ctx.stack.at(-1).rule_set;
		const iterator = new Switchable_Iterator(rule_set.feed(ctx.source, position));

		for (const M of iterator) {

			const current_frame = ctx.stack.at(-1);
			const pending_result = current_frame.result;

			const action = M.rule.handler({
				...ctx,
				match: M,
			});

			if (action === PA.PUSH_TO_RESULT) {
				pending_result.push(M);
			} else if (action === PA.NO_ACTION) {

			} else if (action instanceof PA.Push_Token) {
				M.type = action.type;
				pending_result.push(M);
			} else if (action instanceof PA.Push_To_Parent) {
				const popped_from_stack = ctx.stack.pop();
				const current_frame = ctx.stack.at(-1);
				const pending_result = current_frame.result;

				pending_result.push(new PM.Sequence_Match(action.type, popped_from_stack.result));
				iterator.switch_to(current_frame.rule_set.feed(ctx.source, M.pending_index));

			} else if (action instanceof PA.Enter_Parser) {
				const pending_rule_name = action.name ?? current_frame.rule_name;
				const new_frame = new Parser_Frame(this, pending_rule_name);
				ctx.stack.push(new_frame);
				iterator.switch_to(new_frame.rule_set.feed(ctx.source, M.pending_index));
			} else {
				throw `Unknown action: ${inspect(action, { depth: null, colors: true })}`;
			}

		}

	}

};

