const fs = require('fs');
const yaml = require('js-yaml');

// Load OpenAPI spec
const openapi = yaml.load(fs.readFileSync('openapi.yaml', 'utf8'));

// Validate paths exist
if (!openapi || !openapi.paths) {
  console.error("❌ openapi.yaml is missing 'paths' section or is invalid!");
  process.exit(1);
}

// Transform OpenAPI paths to Kong services & routes
const deck = {
  _format_version: "1.1",
  services: Object.keys(openapi.paths).map(path => ({
    name: path.replace(/\//g, '-').replace(/^-/, ''),
    url: openapi.servers?.[0]?.url || 'http://localhost:8080',
    routes: [{ paths: [path] }]
  }))
};

// Write deck.yaml
fs.writeFileSync('deck.yaml', yaml.dump(deck), 'utf8');
console.log('✅ deck.yaml generated successfully');
