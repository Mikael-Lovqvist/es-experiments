import * as PR from './parser_rule.mjs';
import * as PM from './parser_match.mjs';


export class Parser_Rule_List {
	constructor(rules) {
		this.rules = rules;
	}

	get default_rule() {
		for (const rule of this.rules) {
			if (rule instanceof PR.Default_Rule) {
				return rule;
			}
		}
	}

	*feed(text, position=0) {

		while (true) {
			const new_chunk = [...this.find_matches(text, position)];

			if (new_chunk.length) {
				position = new_chunk.at(-1).pending_index;
				yield* new_chunk;
			} else {
				position = null;
			}

			if (position === null) {
				return;
			}
		}

	}

	_handle_default_match(value, index, end_index=null) {
		const default_rule = this.default_rule;
		if (!default_rule) {
			throw `Parsing failed, no match for ${JSON.stringify(value)} (${inspect(this, { depth: null, colors: true })})` ; //TODO actual exception object
		}
		return new PM.Default_Match(value, index, end_index, default_rule);
	}

	*find_matches(text, position=0) {
		// First pass - immediate matches
		for (const rule of this.rules) {
			if (rule instanceof PR.Pattern_Rule) {
				const pattern = new RegExp(rule.pattern.source, rule.pattern.flags + 'y');
				pattern.lastIndex = position;
				const match = pattern.exec(text);
				if (match) {
					yield new PM.Pattern_Match(match, rule);
					return;
				}
			}
		}

		// Second pass - global matches
		let best_match;
		for (const rule of this.rules) {
			if (rule instanceof PR.Pattern_Rule) {
				const pattern = new RegExp(rule.pattern.source, rule.pattern.flags + 'g');
				pattern.lastIndex = position;
				const match = pattern.exec(text);

				if (match) {
					if ((best_match === undefined) || (best_match.match.index > match.index)) {
						best_match = new PM.Pattern_Match(match, rule);
					}
				}
			}
		}

		// There was no match, just get the tail
		if (!best_match) {
			const tail = text.slice(position);
			if (tail.length) {
				yield this._handle_default_match(tail, position);
			}
			return;
		}

		// There was a match, check the head
		const head = text.slice(position, best_match.match.index);
		if (head.length) {
			yield this._handle_default_match(head, position, best_match.match.index);
		}

		yield best_match;

	}

};

