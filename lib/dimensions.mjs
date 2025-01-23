import { Dimension } from './core_types.mjs';

//			 Name										Name					Abbreviation
export const Length = new Dimension(					'Length',				'L');
export const Mass = new Dimension(						'Mass',					'M');
export const Time = new Dimension(						'Time',					'T');
export const Electric_Current = new Dimension(			'Electric_Current',		'I');
export const Temperature = new Dimension(				'Temperature',			'K');
export const Amount_of_Substance = new Dimension(		'Amount_of_Substance',	'N');
export const Luminous_Intensity = new Dimension(		'Luminous_Intensity',	'J');

export const List_of_Dimensions = [Length, Mass, Time, Electric_Current, Temperature, Amount_of_Substance, Luminous_Intensity];
export const Abbrevations = Object.fromEntries(List_of_Dimensions.map(item => [item.abbreviation, item]));

