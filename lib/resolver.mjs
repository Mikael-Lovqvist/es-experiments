import * as CT from './core_types.mjs';
import * as T from './tokens.mjs';
import * as F from './functions.mjs';
import { inspect } from 'util';


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




export class Type_Resolver {
	constructor (name, parent, rules) {
		this.rules = rules ?? new Map();
		this.name = name;
		this.parent = parent;
	}

	add_rule(type, handler) {
		this.rules.set(type, handler);
	}

	resolve(item) {
		const handler = this.rules.get(item.constructor);
		if (!handler) {
			throw `Resolver('${this.name}') has no handler for: ${item.constructor.name} ${inspect(item, { depth: null, colors: true })}`;	//TODO - define utility function for this
		}
		return handler(item);
	}


};


export class Mapping_Resolver {
	constructor (name, parent, rules=new Map()) {
		this.rules = rules;
		this.name = name;
		this.parent = parent;
	}

	add_rule(type, handler) {
		this.rules.set(type, handler);
	}

	resolve_by_key(key, item, ctx) {
		const handler = this.rules.get(key);
		if (!handler) {
			throw `Resolver('${this.name}') has no handler for: ${inspect(key, { depth: null, colors: true })} ${inspect(item, { depth: null, colors: true })}`;	//TODO - define utility function for this
		}
		return handler(item, ctx);
	}


};