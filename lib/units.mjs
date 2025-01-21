import { Unit } from './core_types.mjs';
import { Abbrevations as D } from './dimensions.mjs';
import { Abbrevations as P } from './prefixes.mjs';


// SI-units                        Dimension        Name          Abbreviation    Default Prefix
export const Meter     = new Unit(D.Length,       'Meter|s',    'm'             );
export const Kilogram  = new Unit(D.Mass,         'Gram|s',     'g',            P.k );
export const Second    = new Unit(D.Time,         'Second|s',   's'             );
export const Ampere    = new Unit(D.Current,      'Ampere|s',   'A'             );
export const Kelvin    = new Unit(D.Temperature,  'Kelvin|s',   'K'             );
export const Mole      = new Unit(D.Amount,       'Mole|s',     'mol'           );
export const Candela   = new Unit(D.Luminous,     'Candela|s',  'cd'            );

export const List_of_SI_Units = [Meter, Kilogram, Second, Ampere, Kelvin, Mole, Candela];
export const Abbrevations = Object.fromEntries(List_of_SI_Units.map(item => [item.identifier, item]));