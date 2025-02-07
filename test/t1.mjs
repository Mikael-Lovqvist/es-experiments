import * as G from 'ml-es-experiments/generative_factories.mjs';

const f_list = G.Namespace([
	G.Function_Definition('hello', ['a', 'b'], 'return a + b'),
	G.Function_Definition('world', ['a', 'b'], 'return a * b'),
]);

const S = f_list.eval(G);


console.log(S.hello(10, 20));	// 30
console.log(S.world(10, 20));	// 200

console.log(f_list[0].eval()(10, 20))