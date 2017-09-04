'use require';

const Boom = require('boom');
const Joi = require('Joi');
const User = require('../models/User');
const { decodeToken } = require('../utils/tokens');

exports.register = (server, options, next) => {
  server.route({
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
    handler: async (request, reply) => {
      let user = new User(request.payload);

      try {
        await user.save();

        reply({ code: 202, status: 'success', message: 'Account successfully created' }).code(202);
      } catch (err) {
        return reply(Boom.wrap(err, 'Internal MongoDB error'));
      }
    }
  });

  server.route({
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
    handler: async (request, reply) => {
      try {
        let user = await User.findOne({ email: request.payload['email'] }).select('+password');
        await user.comparePassword(request.payload['password']);
        let data = await user.generateAuthToken();
        await user.update({ $push: { tokens: data } });

        reply({ code: 200, status: 'success', token: data.token }).code(200);
      } catch (err) {
        return reply(Boom.wrap(err, 'Internal MongoDB error'));
      }
    }
  });

  server.route({
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
    handler: async (request, reply) => {
      try {
        let user = await User.findOne({ email: request.payload['email'] });
        let data = await user.generatePasswordToken();
        await user.update({ $push: { tokens: data } });

        // TODO: Send email to user with token and link to recover password

        reply({ code: 200, status: 'success', message: 'Email successfully sent' }).code(200);
      } catch (err) {
        return reply(Boom.wrap(err, 'Internal MongoDB error'));
      }
    }
  });

  server.route({
    method: 'POST',
    path: '/api/v1/auth/recover-password',
    config: {
      auth: false,
      validate: {
        payload: {
          token: Joi.string().required(),
          password: Joi.string().min(6).required(),
        }
      }
    },
    handler: async (request, reply) => {
      try {
        let credentials = await decodeToken(request.payload['token']);
        let user = await User.findByCredentials(credentials);

        user.password = request.payload['password'];
        await user.save();
        await user.destroyToken(token);

        reply({ code: 200, status: 'success', message: 'Password successfully updated' });
      } catch (err) {
        return reply(Boom.wrap(err, 'Internal MongoDB error'));
      }
    }
  });

  next();
};

exports.register.attributes = {
  name: 'routes-users'
};
