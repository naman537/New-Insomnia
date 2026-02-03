const fs = require('fs');
const yaml = require('js-yaml');

const openapi = yaml.load(fs.readFileSync('openapi.yaml', 'utf8'));

// Transform paths and operations to Kong services/routes
const deck = {
  _format_version: "1.1",
  services: Object.keys(openapi.paths).map(path => ({
    name: path.replace(/\//g, '-'),
    url: openapi.servers?.[0]?.url || 'http://localhost:8080',
    routes: [{ paths: [path] }]
  }))
};

fs.writeFileSync('deck.yaml', yaml.dump(deck), 'utf8');
