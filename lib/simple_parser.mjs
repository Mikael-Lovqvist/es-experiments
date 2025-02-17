import * as T from './tokens.mjs';
import * as F from './functions.mjs';

/*
	#tokens
	- paranthesis
	- identifiers
	- middle dot (·) asterix (*)
	- slash (/) division (÷)
	- superscript numbers (powers such as ⁰¹²³⁴⁵⁶⁷⁸⁹ and also ⁻⁺)
	- regular numbers (scaling such as 0123456789.e+)
	- plus (+) minus (-)
*/

//TODO - move to some other module
class Character_Mapping extends Map {
	constructor(source_characters, target_characters) {
		super();
		const length = source_characters.length;
		if (source_characters.length != target_characters.length) {
			throw 'source_characters and target_characters must be same length';
		}
		for (let i=0; i<length; i++) {
			this.set(source_characters[i], target_characters[i]);
		}
	}

	translate_string(string) {
		return string.split('').map(char => this.get(char) ?? char).join('');
	}
}



class TOKEN {
	static enter_paranthesized_expression = /\(/y;
	static exit_paranthesized_expression = /\)/y;
	static identifier = /\w+/y;
	static multiplication = /[·*]|\s+/y;
	static division = /[/÷]/y;
	static superscript = /[⁺⁻]?[⁰¹²³⁴⁵⁶⁷⁸⁹]+/y;
	static scalar = /[-]?(?:\d+|\.\d+|\d+\.\d+)(?:[eE][+-]?\d+)?/y;
	static addition = /[+]/y;
	static subtraction = /[-]/y;


	static superscript_translation = new Character_Mapping('⁺⁻⁰¹²³⁴⁵⁶⁷⁸⁹', '+-0123456789');

};




function match_pending_token(expression, position, list_of_tokens) {
	for (const [pattern, value] of list_of_tokens) {
		pattern.lastIndex = position;
		const match = pattern.exec(expression);
		if (match) {
			return [match, value];
		}
	}
}





export function Simple_Parser(expression, start=0) {

	let position = start;
	let result = undefined;
	let pending_operations = [];
	const stack = [];

	function op(value) {
		const pending_op = pending_operations.length > 0 ? pending_operations.pop() : multiply;

		pending_op(value);

	}


	function upgrade(value) {
		if (value instanceof T.Variable) {
			return value;
		} else if (value instanceof T.Constant) {
			return value;
		} else if (value instanceof F.Negated) {
			return value;
		} else if (value instanceof F.Sum) {
			return value;
		} else if (value instanceof F.Product) {
			return value;
		} else {
			throw `Could not process: ${value.constructor.name} ${JSON.stringify(value, null, 2)}`;	//TODO - define utility function for this
		}

	}

	function add(value) {
		value = upgrade(value)

		if (result == undefined) {
			result = value;
		} else if (result instanceof F.Sum) {
			result.operands.push(value);
		} else {
			result = new F.Sum(result, value);
		}
	}

	function subtract(value) {
		add(new F.Negated(upgrade(value)));
	}


	function multiply(value) {
		value = upgrade(value)

		if (result == undefined) {
			result = value;
		} else if (result instanceof F.Product) {
			result.operands.push(value);
		} else {
			result = new F.Product(result, value);
		}

	}

	function raise(value) {
		value = upgrade(value)

		if (result == undefined) {
			throw 'Baseless power';
		} else if (result instanceof F.Power) {
			const current_result = result;
			result = current_result.exponent;
			multiply(value);
			current_result.exponent = result;
			result = current_result;

		} else if (result instanceof F.Product) {
			const current_result = result;
			result = current_result.operands.pop();
			raise(value);
			current_result.operands.push(result);
			result = current_result;

		} else if (result instanceof T.Variable) {
			result = new F.Power(result, value);
		} else {
			throw `Could not raise: ${result.constructor.name} ${JSON.stringify(result, null, 2)}`;	//TODO - define utility function for this
		}

	}

	const to_check = [
		[TOKEN.exit_paranthesized_expression,	(match) => {
			const previous_result = result;
			[result, pending_operations] = stack.pop();
			op(previous_result);

		}],
		[TOKEN.enter_paranthesized_expression,	(match) => {
			stack.push([result, pending_operations]);
			result = undefined;
			pending_operations = [];
		}],
		[TOKEN.identifier,	(match) => {
			op(new T.Variable(match[0]));
		}],
		[TOKEN.multiplication,	null],
		[TOKEN.division,	(match) => {
			console.log('TODO', match);
		}],
		[TOKEN.superscript,	(match) => {
			raise(new T.Constant(parseInt(TOKEN.superscript_translation.translate_string(match[0]))));
		}],
		[TOKEN.scalar,	(match) => {
			console.log('TODO', match);
		}],
		[TOKEN.addition,	(match) => {
			pending_operations.push(add);
		}],
		[TOKEN.subtraction,	(match) => {
			pending_operations.push(subtract);
		}],	];

	while (true) {
		const match_token = match_pending_token(expression, position, to_check);

		//console.log('token', match_token, result);

		if (match_token == undefined) {
			break;
		}
		const [match, value] = match_token;
		position = (value && value(match)) ?? (match.index + match[0].length);
	}

	return result;

}