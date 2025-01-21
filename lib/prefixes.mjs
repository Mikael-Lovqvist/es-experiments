
import { Prefix } from './core_types.mjs';


//           Name                 Name            Abbreviation    Multiplier	Identifier override
export const Atto   = new Prefix( 'Atto',          'a',            1e-18);
export const Femto  = new Prefix( 'Femto',         'f',            1e-15);
export const Pico   = new Prefix( 'Pico',          'p',            1e-12);
export const Nano   = new Prefix( 'Nano',          'n',            1e-9);
export const Micro  = new Prefix( 'Micro',         'µ',            1e-6,		'u');
export const Milli  = new Prefix( 'Milli',         'm',            1e-3);
export const Centi  = new Prefix( 'Centi',         'c',            1e-2);
export const Deci   = new Prefix( 'Deci',          'd',            1e-1);

export const Deca   = new Prefix( 'Deca',          'da',           1e1);
export const Hecto  = new Prefix( 'Hecto',         'h',            1e2);
export const Kilo   = new Prefix( 'Kilo',          'k',            1e3);
export const Mega   = new Prefix( 'Mega',          'M',            1e6);
export const Giga   = new Prefix( 'Giga',          'G',            1e9);
export const Tera   = new Prefix( 'Tera',          'T',            1e12);
export const Peta   = new Prefix( 'Peta',          'P',            1e15);
export const Exa    = new Prefix( 'Exa',           'E',            1e18);



export const List_of_Dimensions = [Atto, Femto, Pico, Nano, Micro, Milli, Centi, Deci, Deca, Hecto, Kilo, Mega, Giga, Tera, Peta, Exa];
export const Abbrevations = Object.fromEntries(List_of_Dimensions.map(item => [item.identifier, item]));

