const fs = require('fs');
const yaml = require('js-yaml');

// Load Insomnia OpenAPI export
const insomnia = yaml.load(fs.readFileSync('openapi.yaml', 'utf8'));
const openapi = insomnia.spec?.contents || insomnia;

// Basic validation
if (!openapi || !openapi.paths) {
  console.error("OpenAPI content missing 'paths' section or is invalid!");
  process.exit(1);
}

// Build routes from OpenAPI paths
const routes = Object.entries(openapi.paths).map(([path, methods]) => ({
  name: path.replace(/\//g, '-').replace(/^-/, ''),
  paths: [path],
  methods: Object.keys(methods).map(m => m.toUpperCase()),
  protocols: ['http', 'https']
}));

// Build deck.yaml
const deck = {
  _format_version: "3.0",
  services: [
    {
      name: "backend-service",
      url: openapi.servers?.[0]?.url || "http://httpbin.org:8001",
      routes
    }
  ]
};

// Write deck.yaml
fs.writeFileSync('deck.yaml', yaml.dump(deck, { noRefs: true }), 'utf8');
console.log('deck.yaml generated successfully');
