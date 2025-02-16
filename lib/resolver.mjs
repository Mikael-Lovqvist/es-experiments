//import * as CT from './core_types.mjs';
//import * as T from './tokens.mjs';
//import * as F from './functions.mjs';
import { inspect } from 'util';
import * as R from './resolver_rules.mjs';

/*
export class Resolver {
	constructor (scope) {
		this.scope = scope;
	}

	resolve(value) {
		if (value instanceof T.Variable) {
			const result = this.scope[value.name];
			if (result == undefined) {
				throw `The variable "${value.name}" was not resolved in ${this.scope}`;
			}
			return result;
		} else if (value instanceof T.Constant) {
			return value;
		} else if (value instanceof F.Product) {
			return new F.Product(...value.operands.map(item => this.resolve(item)));
		} else if (value instanceof F.Power) {
			return new F.Power(
				this.resolve(value.base),
				this.resolve(value.exponent),
			);
		} else {
			throw `Could not process: ${value.constructor.name} ${inspect(value, { depth: null, colors: true })}`;	//TODO - define utility function for this
		}
	}
}

*/


export const HANDLER_RESULT = Symbol('HANDLER_RESULT');
export const HANDLER = Symbol('HANDLER');


export class Resolver {
	constructor (name, strict=true, return_value=HANDLER_RESULT, rules=[]) {
		this.name = name;
		this.strict = strict;
		this.return_value = return_value;
		this.rules = rules;
	}
}

export class Mapping_Resolver extends Resolver {

	constructor (name, strict=true, return_value=HANDLER_RESULT, rules=new Map()) {
		super(name, strict, return_value, rules);
	}

	add_rule(type, handler) {
		this.rules.set(type, handler);
	}

	resolve_by_constructor(item, ctx) {
		return this.resolve_by_key(item.constructor, item, ctx)
	}

	resolve_by_key(key, item, ctx) {
		const handler = this.rules.get(key);
		if (handler) {
			const handler_result = handler(item, ctx);
			if (this.return_value === HANDLER) {
				return handler;
			} else if (this.return_value === HANDLER_RESULT) {
				return handler_result;
			} else {
				throw 'Wrong return_value';	//TODO improve
			}
		} else if (this.strict) {
			throw `Resolver('${this.name}') has no handler for: ${inspect(key, { depth: null, colors: true })} ${inspect(item, { depth: null, colors: true })}`;	//TODO - define utility function for this
		}

	}


};

export class Structural_Resolver extends Resolver {

	add_identity_tail_sequence_rule(sub_sequence, handler) {
		this.rules.push(new R.Tail_Sequence_Identity(sub_sequence, handler));
	}

	add_tail_sequence_rule(sub_sequence, handler) {
		this.rules.push(new R.Tail_Sequence(sub_sequence, handler));
	}

	resolve(sequence, ctx) {
		for (const rule of this.rules) {
			const match = rule.match(sequence);
			if (match) {
				const handler_result = rule.handler(match, ctx);
				if (this.return_value === HANDLER) {
					return rule.handler;
				} else if (this.return_value === HANDLER_RESULT) {
					return handler_result;
				} else {
					throw 'Wrong return_value';	//TODO improve
				}
			}
		}

		if (this.strict) {
			throw `Resolver('${this.name}') has no handler for: ${inspect(sequence, { depth: null, colors: true })}`;	//TODO - define utility function for this
		}

	}

}
