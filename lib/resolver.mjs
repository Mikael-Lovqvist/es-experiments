import * as CT from './core_types.mjs';
import * as T from './tokens.mjs';
import * as F from './functions.mjs';
import * as DU from './derived_units.mjs';

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
			throw `Could not process: ${value.constructor.name} ${JSON.stringify(value, null, 2)}`;	//TODO - define utility function for this
		}
	}
}

export class Dimensional_Resolver {
	constructor (scope, require_unit_dimension=true) {
		this.scope = scope;
		this.require_unit_dimension = require_unit_dimension;
	}

	resolve(value) {
		if (value instanceof T.Variable) {
			return value;
		} else if (value instanceof T.Constant) {
			return value;
		} else if (value instanceof CT.Unit) {
			if (value.dimension) {
				return value.dimension;
			} else if (this.require_unit_dimension) {
				throw new Error(`Missing required dimension for ${value.constructor.name} ${JSON.stringify(value, null, 2)}`);
			}
		} else if (value instanceof F.Product) {
			return new F.Product(...value.operands.map(item => this.resolve(item)));
		} else if (value instanceof F.Power) {
			return new F.Power(
				this.resolve(value.base),
				this.resolve(value.exponent),
			);
		} else if (value instanceof DU.Derived_Unit) {
			return this.resolve(value.expression);
		} else {
			throw `Could not process: ${value.constructor.name} ${JSON.stringify(value, null, 2)}`;	//TODO - define utility function for this
		}
	}
};



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
			throw `Resolver('${this.name}') has no handler for: ${item.constructor.name} ${JSON.stringify(item, null, 2)}`;	//TODO - define utility function for this
		}
		return handler(item);
	}


};