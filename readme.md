# Introduction
This project is essentially just a playground in EcmaScript.
Currently I am experimenting a bit with a unit and dimension system.
Goals include:
- Semantic type system
- Transpiled/synthesized expression factories

## This document
Since this project is very informal, I will add notes right here in this file. This may later be cleaned up if this project becomes useful.

## Notes

### Derived Unit Definitions

This could be based on either specific units or just dimensions.
I do not think it would make sense to mix those, that would be an invalid expression which will have undefined behavior.

- Unit based
	```js
	'kg·m²·s⁻²' // F.Product(Kilogram, F.Squared(Meter), F.Reciprocal(F.Squared(Second)))
	```
- Dimension based
	```js
	'M·L²·T⁻²' // F.Product(D.Mass, F.Squared(D.Length), F.Reciprocal(F.Squared(D.Time)))
	```

> [!CAUTION]
> Mixing dimensions and units results in undefined behavior. There might later be some sort of audit function to make debug-related assertions easier.

