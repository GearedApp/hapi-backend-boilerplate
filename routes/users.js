'use strict';

const Joi = require('joi');
const Users = require('../controllers/users');

exports.register = (server, options, next) => {
  server.route([
    {
      method: 'GET',
      path: '/api/v1/users',
      handler: Users.getAll,
    },
    {
      method: 'GET',
      path: '/api/v1/users/{id}',
      handler: Users.getOne,
    },
    {
      method: 'PUT',
      path: '/api/v1/users/{id}',
      config: {
        validate: {
          payload: {
            email: Joi.string().optional(),
          }
        }
      },
      handler: Users.update,
    },
    {
      method: 'PUT',
      path: '/api/v1/users/change-password/{id}',
      config: {
        validate: {
          payload: {
            oldPassword: Joi.string().min(6).required(),
            newPassword: Joi.string().min(6).required(),
          }
        }
      },
      handler: Users.updatePassword,
    },
    {
      method: 'DELETE',
      path: '/api/v1/users/{id}',
      handler: Users.remove,
    },
  ]);

  next();
};

exports.register.attributes = {
  name: 'routes-users'
};
