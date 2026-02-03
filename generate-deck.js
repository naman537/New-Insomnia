// generate-deck.js
const fs = require('fs');
const yaml = require('js-yaml');

// Load OpenAPI spec
const openapi = yaml.load(fs.readFileSync('openapi.yaml', 'utf8'));

// Placeholder: create minimal deck.yaml structure
// You can expand this to map OpenAPI paths → Kong services/routes
const deck = {
  _format_version: "1.1",
  services: [] // fill dynamically if you like
};

// Write deck.yaml
fs.writeFileSync('deck.yaml', yaml.dump(deck));
console.log("deck.yaml generated successfully!");
