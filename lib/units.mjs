import { Unit } from './core_types.mjs';
import * as D from './dimensions.mjs';
import { Abbrevations as P } from './prefixes.mjs';

// SI-units                        Dimension      		  Name          Abbreviation    Default Prefix
export const Meter     = new Unit(D.Length,       		'Meter|s',    	'm',             null,		null);
export const Kilogram  = new Unit(D.Mass,         		'Gram|s',     	'g',            P.k ,		null);
export const Second    = new Unit(D.Time,         		'Second|s',   	's',             null,		null);
export const Ampere    = new Unit(D.Electric_Current,   'Ampere|s',   	'A',             null,		null);
export const Kelvin    = new Unit(D.Temperature,  		'Kelvin|s',   	'K',             null,		null);
export const Mole      = new Unit(D.Amount,       		'Mole|s',     	'mol',           null,		null);
export const Candela   = new Unit(D.Luminous,     		'Candela|s',  	'cd',            null,		null);
export const Steradian = new Unit(null, 	      		'Steradian|s', 	'sr',            null,		null);
export const Count = 	 new Unit(D.Count, 	      		'Piece|s',  	'pc',            null,		null);


// Non-SI Units
// Dimension  Name				Dimension		Name				Abbrev		DPfx		ID		sub unit
export const Inch       = new Unit(D.Length,       'Inch|es',       'in',		null,		null);
export const Foot       = new Unit(D.Length,       'Foot|~|Feet',   'ft',		null,		null);
export const Yard       = new Unit(D.Length,       'Yard|s',        'yd',		null,		null);
export const Mile       = new Unit(D.Length,       'Mile|s',        'mi',		null,		null);

export const Ounce      = new Unit(D.Mass,         'Ounce|s',       'oz',		null,		null);
export const Pound      = new Unit(D.Mass,         'Pound|s',       'lb',		null,		null);
export const Stone      = new Unit(D.Mass,         'Stone|s',       'st',		null,		null);
export const Ton        = new Unit(D.Mass,         'Ton|s',         'ton',		null,		null);

export const Pint       = new Unit(D.Volume,       'Pint|s',        'pt',		null,		null);
export const Quart      = new Unit(D.Volume,       'Quart|s',       'qt',		null,		null);
export const Gallon     = new Unit(D.Volume,       'Gallon|s',      'gal',		null,		null);

export const Degree = 	new Unit(D.Dimensionless,  'Degree|s',    	'°',      null,			'deg');
export const Radian = 	new Unit(D.Dimensionless,  'Radian|s',    	'°',      null,			'rad');
export const Turn = 	new Unit(D.Dimensionless,  'Turn|s',    	't',      null,			null);

export const Celsius = 		new Unit(D.Temperature,  'Celsius',    	'C',      null,			null, 	Degree);	//Specify as sub unit
export const Fahrenheit = 	new Unit(D.Temperature,  'Fahrenheit',  'F',      null,			null, 	Degree);

// Add more as needed, such as Nautical Miles, Barrels, etc.




export const List_of_SI_Units = [Meter, Kilogram, Second, Ampere, Kelvin, Mole, Candela, Steradian, Count];
export const List_of_all_Units = [...List_of_SI_Units, Inch, Foot, Yard, Mile, Ounce, Pound, Stone, Ton, Pint, Quart, Gallon, Celsius, Fahrenheit];
export const Abbrevations = Object.fromEntries(List_of_all_Units.map(item => [item.identifier, item]));	//TODO - here and other places, a strict utility function that also checks that we are getting proper identifiers
export const All_Units = Object.fromEntries(List_of_all_Units.map(item => [item.name.singular, item]));

