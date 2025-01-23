import YAML from 'yaml';

const yamlString = `
name: John Doe
age: 30
hobbies:
  - reading
  - cycling
  - hiking
`;

// Parse YAML to JavaScript object
const data = YAML.parse(yamlString);
console.log(data);
// Output: { name: 'John Doe', age: 30, hobbies: [ 'reading', 'cycling', 'hiking' ] }

// Stringify JavaScript object to YAML
const newYamlString = YAML.stringify(data);
console.log(newYamlString);
// Output:
// name: John Doe
// age: 30
// hobbies:
//   - reading
//   - cycling
//   - hiking
