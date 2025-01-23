
//In node we can import from xmldom, this should otherwise exist in browsers.
import { DOMParser } from 'xmldom';

const xmlString = `
<note>
  <to>Tove</to>
  <from>Jani</from>
  <heading>Reminder</heading>
  <body>Don't forget me this weekend!</body>
</note>`;

// Parse the XML string
const parser = new DOMParser();
const xmlDoc = parser.parseFromString(xmlString, "application/xml");

// Access elements
console.log(xmlDoc.getElementsByTagName("to")[0].textContent); // Output: "Tove"
console.log(xmlDoc.getElementsByTagName("from")[0].textContent); // Output: "Jani"
