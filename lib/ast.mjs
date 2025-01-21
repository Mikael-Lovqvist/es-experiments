export class Function_Body {
	constructor(body) {
		this.body = body
	}

	to_code(G) {
		return this.body;
	}

}

export class Function_Name {
	constructor(name) {
		this.name = name
	}

	to_code(G) {
		return this.name;
	}

}

export class Function_Argument_List extends Array {
	to_code(G) {
		return this.map(item => item.to_code(G)).join(', ');
	}
}


export class Namespace extends Array {
	to_code(G) {
		return this.map(item => item.to_code(G)).join('; ');
	}

	eval(G) {
		//We convert this to an IIFE but we should probably have a function just for that
		const definition = this.to_code(G);
		const expression = this.map(item => item.name.to_code(G)).join(', ');
		return eval(`(() => {${definition}; return {${expression}}})()`)
	}
}

export class Function_Argument {
	constructor(name) {
		this.name = name
	}

	to_code(G) {
		return this.name;
	}

}

export class Function_Definition {
	constructor(name, f_arguments, body) {
		this.name = name
		this.arguments = f_arguments
		this.body = body
	}

	to_code(G) {
		return `function ${this.name.to_code(G)}(${this.arguments.to_code(G)}) { ${this.body.to_code(G)} }`
	}

	eval(G) {
		//We convert this to an IIFE but we should probably have a function just for that
		return eval(`(() => {${this.to_code(G)}; return ${this.name.to_code(G)}})()`)
	}
}