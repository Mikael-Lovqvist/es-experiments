import * as DU from './derived_units.mjs';
import * as F from './functions.mjs';
import * as CT from './core_types.mjs';
import * as T from './tokens.mjs';

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
