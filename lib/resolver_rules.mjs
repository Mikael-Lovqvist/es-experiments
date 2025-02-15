import { Match } from './resolver_match.mjs';

//TODO - detect erroneous config early

export class Rule {
	constructor(predicate, handler) {
		this.predicate = predicate;
		this.handler = handler;
	}
}



export class Sequence_Rule extends Rule {
	get length() {
		return this.predicate.length;
	}
}


export class Tail_Sequence extends Sequence_Rule {
	match(sequence) {
		const length = this.length;
		const tail = sequence.slice(-length);

		if (tail.length == length) {
			const resulting_sequence = [];
			for (let i=0; i<length; i++) {
				const match = this.predicate[i].match(tail[i]);
				if (match === undefined) {
					return;
				}
				resulting_sequence.push(match);
			}
			return new Match(this, resulting_sequence);
		}


	}
}

export class Tail_Sequence_Identity extends Tail_Sequence {

	match(sequence) {
		const length = this.length;
		const tail = sequence.slice(-length);
		if (tail.length == length) {
			for (let i=0; i<length; i++) {
				if (tail[i] !== this.predicate[i]) {
					return;
				}
			}
			return new Match(this, sequence);
		}
	}
};