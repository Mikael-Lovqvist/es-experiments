import { Abbrevations as D } from '../lib/dimensions.mjs';
import { Abbrevations as U } from '../lib/derived_units.mjs';

import { Simple_Parser } from '../lib/simple_parser.mjs';
import { Dimensional_Resolver } from '../lib/resolver.mjs';


//This only works in node, just for testing
import { inspect } from 'util';



console.log(Object.keys(U))
console.log(inspect(U.V, { depth: null, colors: true }));

console.log();

const DUV = (new Dimensional_Resolver()).resolve(U.V);
console.log(inspect(DUV, { depth: null, colors: true }));

//Kvadratlängdmassa över kubtidampere