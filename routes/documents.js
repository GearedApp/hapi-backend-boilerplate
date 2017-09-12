'use strict';

const Joi = require('joi');
const Documents = require('../controllers/documents');

exports.register = (server, options, next) => {
  server.route([
    {
      method: 'POST',
      path: '/api/v1/documents',
      config: {
        payload: {
          output: 'stream',
          parse: true,
          allow: 'multipart/form-data',
        }
      },
      handler: Documents.create,
    },
    {
      method: 'GET',
      path: '/api/v1/documents',
      handler: Documents.getAll,
    },
    {
      method: 'GET',
      path: '/api/v1/documents/{id}',
      handler: Documents.getOne,
    },
    {
      method: 'DELETE',
      path: '/api/v1/documents/{id}',
      handler: Documents.remove,
    },
    {
      method: 'PUT',
      path: '/api/v1/documents/{id}',
      config: {
        payload: {
          output: 'stream',
          parse: true,
          allow: 'multipart/form-data',
        }
      },
      handler: Documents.update,
    },
  ]);

  next();
};

exports.register.attributes = {
  name: 'routes-documents',
};
