import { Switchable_Iterator } from './iteration_utils.mjs';
import * as PA from './parser_action.mjs';
import * as PM from './parser_match.mjs';
import { inspect } from 'util';



export class Rule_Based_Parser {
	constructor(named_rules) {
		this.named_rules = named_rules;
	}

	parse(rule_name, source, position=0, additional_context={}) {
		const ctx = {
			stack: [[]],
			parser: this,
			named_rule: rule_name,
			source: source,
		};

		ctx.parser.feed(ctx, position);
		return ctx.stack.pop();	//TODO - verify stack is sound
	}

	feed(ctx, position) {
		const rule_set = this.named_rules[ctx.named_rule];	//TODO - catch undefined and throw proper exception (check other places as well)
		const iterator = new Switchable_Iterator(rule_set.feed(ctx.source, position));

		for (const M of iterator) {

			const pending_result = ctx.stack.at(-1);

			const action = M.rule.handler({
				...ctx,
				match: M,
			});

			if (action === PA.PUSH_TO_RESULT) {
				pending_result.push(M);
			} else if (action === PA.NO_ACTION) {

			} else if (action instanceof PA.Push_To_Parent) {

				const popped_from_stack = ctx.stack.pop();
				const pending_result = ctx.stack.at(-1);
				pending_result.push(new PM.Sequence_Match(action.type, popped_from_stack));

			} else if (action instanceof PA.Enter_Parser) {
				ctx.stack.push([]);
				const rule_set = this.named_rules[action.name];
				iterator.switch_to(rule_set.feed(ctx.source, M.pending_index));
			} else {
				throw `Unknown action: ${inspect(action, { depth: null, colors: true })}`;
			}

		}

	}

};

