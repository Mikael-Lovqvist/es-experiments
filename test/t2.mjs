import * as G from '../lib/generative_factories.mjs';

const f_list = G.Namespace([
	G.Function_Definition('hello', ['a', 'b'], 'return a + b'),
	G.Function_Definition('world', ['a', 'b'], 'return a * b'),
]);

const S = f_list.eval(G);


