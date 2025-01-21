import * as A from './ast.mjs';


export function Namespace(items) {
	return new A.Namespace(...items);
}

export function Function_Name(name) {
	return new A.Function_Name(name);
}

export function Function_Argument(name) {
	return new A.Function_Argument(name);
}

export function Function_Argument_List(args) {
	return new A.Function_Argument_List(...args.map(item => Function_Argument(item)));
}

export function Function_Body(body) {
	return new A.Function_Body(body);
}

export function Function_Definition(...args) {

	if (args.length == 3) {
		return ((f_name, f_arguments, f_body) => {
			return new A.Function_Definition(
				Function_Name(f_name),
				Function_Argument_List(f_arguments),
				Function_Body(f_body),
			)
		})(...args);
	}

}