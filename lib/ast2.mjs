// Root abstractions
export class Operand {};
export class Operation extends Operand {};


// Abstractions
export class Unary_Operation extends Operation {};
export class Binary_Operation extends Operation {
	constructor (left, right) {
		super();
		this.left = left;
		this.right = right;
	}

	toString() {
		return `${this.constructor.name}(${this.left.toString()}, ${this.right.toString()})`
	}
};
export class N_ary_Operation extends Operation {};


// Concrete
export class Subtraction extends Binary_Operation {};
export class Addition extends Binary_Operation {};
export class Multiplication extends Binary_Operation {};
export class Division extends Binary_Operation {};
export class Power extends Binary_Operation {};



export class Number extends Operand {
	constructor(value) {
		super();
		this.value = value;
	}

	toString() {
		return `${this.constructor.name}(${JSON.stringify(this.value)})`
	}
};



export class Variable extends Operand {
	constructor(name) {
		super();
		this.name = name;
	}

	toString() {
		return `${this.constructor.name}(${JSON.stringify(this.name)})`
	}
};

export class Sub_Expression extends Operand {
	constructor(value) {
		super();
		this.value = value;
	}

	toString() {
		return `${this.constructor.name}(${this.value})`	//TODO - formatting?
	}
};


export class Index_of extends Operand {
	constructor(reference, index) {
		super();
		this.reference = reference;
		this.index = index;
	}

	toString() {
		return `${this.constructor.name}(${this.reference}, ${this.index})`	//TODO - formatting?
	}
};




//  _____ ___ __  __ ___
// |_   _| __|  \/  | _ \
//   | | | _|| |\/| |  _/
//   |_| |___|_|  |_|_|
/*
export class Unparsed {
	constructor(text) {
		this.text = text;
	}
};

export class Unimplemented extends Operand {
	constructor(value) {
		super();
		this.value = value;
	}
};

*/