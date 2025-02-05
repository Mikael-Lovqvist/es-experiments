export class Text_Tree {
	constructor(line, title, parent, children=[]) {
		this.line = line;
		this.title = title;
		this.parent = parent;
		this.children = children;
	}

	get root() {
		return this.parent?.root ?? this.parent ?? this;
	}

	get last_child() {
		return this.children.at(-1);
	}

	add_child(line, title) {
		const new_node = new this.constructor(line, title, this);
		this.children.push(new_node);
		return new_node;
	}

	[Symbol.iterator]() {
		return this.children[Symbol.iterator]();
	}

	get_uncluttered_object() {
		const result = {};
		if (this.title) {
			result.title = this.title;
		}

		if (this.children.length) {
			result.children = [];
			for (const child of this.children) {
				result.children.push(child.get_uncluttered_object());
			}
		}

		if (!result.title && !result.children?.length) {
			return 'EMPTY';
		} else {
			return result;
		}

	}

	static from_text(text, root) {
		if (!root) {
			root = new this();
		}

		const stack = [root];
		for (const [line, captured_tabs, captured_line] of text.matchAll(/^(\t*)(.*)$/gm)) {
			const indent = captured_tabs.length;
			const title = captured_line.trim();

			const current_level = stack.length - 1;
			const current_node = stack.at(-1);
			const last_node = current_node.last_child;

			if (title) {
				if (indent == current_level) {
					current_node.add_child(line, title);
				} else if (indent == current_level + 1) {
					last_node.add_child(line, title);
					stack.push(last_node);
				} else if (indent < current_level) {
					stack.splice(indent - current_level);
					const updated_current_node = stack.at(-1);
					updated_current_node.add_child(line, title);
				}

			} else {
				current_node.add_child();
			}
		}

		if (stack[0] !== root) {
			throw 'tree lost its root'	//TODO - improved error reporting using custom exception type with useful info
		}

		return root;
	}
}
