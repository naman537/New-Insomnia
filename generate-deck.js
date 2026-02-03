const fs = require('fs');
const yaml = require('js-yaml');

// Load Insomnia export
const insomnia = yaml.load(fs.readFileSync('openapi.yaml', 'utf8'));
const openapi = insomnia.spec?.contents;

if (!openapi || !openapi.paths) {
  console.error("❌ OpenAPI content missing 'paths' section or is invalid!");
  process.exit(1);
}

// Generate deck.yaml for Kong
const deck = {
  _format_version: "1.1",
  services: Object.keys(openapi.paths).map(path => ({
    name: path.replace(/\//g, '-').replace(/^-/, ''),
    url: openapi.servers?.[0]?.url || 'http://localhost:8080',
    routes: [{
      name: path.replace(/\//g, '-').replace(/^-/, '') + '-route', // ✅ unique route name
      paths: [path],
      methods: Object.keys(openapi.paths[path]) || ['GET'],       // include HTTP methods
      protocols: ['http', 'https']                                // required
    }]
  }))
};

// Write deck.yaml
fs.writeFileSync('deck.yaml', yaml.dump(deck), 'utf8');
console.log('✅ deck.yaml generated successfully');
