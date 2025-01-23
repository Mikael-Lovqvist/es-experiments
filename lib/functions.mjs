export class Operator {
	constructor(...operands) {
		this.operands = operands;
	}
}

export class Product extends Operator {}

export class Binary_Operator extends Operator {
	get left() {
		return this.operands[0];
	}

	get right() {
		return this.operands[1];
	}
}


export class Divide extends Binary_Operator {
	get dividend() {
		return this.operands[0];
	}

	get divisor() {
		return this.operands[1];
	}
}

export class Power extends Binary_Operator {
	get base() {
		return this.operands[0];
	}

	set base(value) {	//TODO - add setters to other classes (also consider immutable ones)
		this.operands[0] = value;
	}

	get exponent() {
		return this.operands[1];
	}
}

export class Fraction extends Binary_Operator {
	get numerator() {
		return this.operands[0];
	}

	get denominator() {
		return this.operands[1];
	}
}



export class Binary_Comparison extends Binary_Operator {

}

export class Less_Than extends Binary_Comparison {}
