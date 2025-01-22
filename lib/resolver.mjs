import * as T from './tokens.mjs';
import * as F from './functions.mjs';

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