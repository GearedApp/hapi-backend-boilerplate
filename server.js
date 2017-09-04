'use strict';

const Hapi = require('Hapi');

// Requires
require('dotenv').config();
require('./database');

// Create server connection using host and port
const server = new Hapi.Server();
server.connection({ host: 'localhost', port: 8000 });

// Start the server
server.start((err) => {
  if (err) throw err;

  console.log(`Server running at: ${server.info.uri}`);
});
