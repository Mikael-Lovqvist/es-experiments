export class Character_Mapping extends Map {
	constructor(source_characters, target_characters) {
		super();
		const length = source_characters.length;
		if (source_characters.length != target_characters.length) {
			throw 'source_characters and target_characters must be same length';
		}
		for (let i=0; i<length; i++) {
			this.set(source_characters[i], target_characters[i]);
		}
	}

	translate_string(string) {
		return string.split('').map(char => this.get(char) ?? char).join('');
	}
}
