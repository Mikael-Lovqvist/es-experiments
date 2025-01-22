export class Expression {
}

export class Product extends Expression {
	constructor(...operands) {
		super();
		this.operands = operands;
	}
}

export class Power extends Expression {
	constructor(base, exponent) {
		super();
		this.base = base;
		this.exponent = exponent;
	}
}
