export class Switchable_Iterator {
	constructor(iterator=null) {
		this.iterator = iterator;
	}

	switch_to(iterator) {
		this.iterator = iterator;
	}

	next() {
		return this.iterator.next();
	}

	[Symbol.iterator]() {
		return this;
	}

}
