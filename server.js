'use strict';

const Hapi = require('Hapi');
const Path = require('path');
const { validate } = require('./utils/authentication');

// Requires
require('dotenv').config();
require('./database');

// Create server connection using host and port
const server = new Hapi.Server();
server.connection({ host: process.env.HOST || 'localhost', port: process.env.PORT || 8000 });

// Load plugins and start the server
server.register([
  require('inert'),
  require('hapi-auth-jwt'),
  require('./routes/auth'),
  require('./routes/users'),
  require('./routes/documents'),
], (err) => {
  if (err) throw err;

  server.auth.strategy('token', 'jwt', {
    key: process.env.SECRET_KEY,
    validateFunc: validate,
    verifyOptions: {
      algorithms:['HS256'],
    }
  });

  server.auth.default('token');

  server.route({
    method: 'GET',
    path: '/{path*}',
    handler: {
      directory: {
        path: Path.join(__dirname, 'client/build'),
        listing: false,
        index: true
      }
    }
  });

  server.start((err) => {
    console.log('Server running at:', server.info.uri);
  });
});
