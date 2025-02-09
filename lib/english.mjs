// Inspired by wiktionary from how they represent nouns and such

class Not_Countable {
	constructor(name) {
		this.name = name;
	}

};

class Countable {
	constructor(singular, plural) {
		this.singular = singular;
		this.plural = plural;
	}
};


export function parse_name(expression) {

	const pieces = expression.split('|');

	switch (pieces.length) {
		case 1:
			return new Not_Countable(...pieces);
		case 2: {
			const [singular, suffix] = pieces;
			return new Countable(singular, `${singular}${suffix}`);
		}
		case 3: {
			const [singular, _, plural] = pieces;
			return new Countable(singular, plural);
		}
	}

}