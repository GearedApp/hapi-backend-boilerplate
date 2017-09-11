'use require';

const Joi = require('Joi');
const Authentication = require('../controllers/authentication');

exports.register = (server, options, next) => {
  server.route([
    {
      method: 'POST',
      path: '/api/v1/auth/signup',
      config: {
        auth: false,
        validate: {
          payload: {
            email: Joi.string().required(),
            password: Joi.string().min(6).required(),
            is_admin: Joi.boolean().optional(),
          }
        }
      },
      handler: Authentication.signup,
    },
    {
      method: 'POST',
      path: '/api/v1/auth/login',
      config: {
        auth: false,
        validate: {
          payload: {
            email: Joi.string().required(),
            password: Joi.string().required(),
          }
        }
      },
      handler: Authentication.login,
    },
    {
      method: 'POST',
      path: '/api/v1/auth/forgot-password',
      config: {
        auth: false,
        validate: {
          payload: {
            email: Joi.string().required(),
          }
        }
      },
      handler: Authentication.forgotPassword,
    },
    {
      method: 'POST',
      path: '/api/v1/auth/reset/:token',
      config: {
        auth: false,
        validate: {
          query: {
            token: Joi.string().required(),
          },
          payload: {
            password: Joi.string().required(),
          }
        }
      },
      handler: Authentication.recoverPassword,
    },
    {
      method: 'GET',
      path: '/api/v1/auth/logout',
      handler: Authentication.logout,
    }
  ]);

  next();
};

exports.register.attributes = {
  name: 'routes-users'
};
