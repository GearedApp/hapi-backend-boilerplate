'use strict';

const Boom = require('boom');
const User = require('../models/User');

/**
 * Get all users
 * @return {Array}  Users
 */
exports.getAll = async (request, reply) => {
  try {
    let users = await User.find();

    reply({ code: 200, status: 'success', users }).code(200);
  } catch (err) {
    return reply(Boom.wrap(err, 'Internal MongoDB error'));
  }
};

/**
 * Get one user
 * @param  {String}  id       User's id
 * @return {Object}           User
 */
exports.getOne = async (request, reply) => {
  try {
    let user = await User.findById(request.params['id']);

    reply({ code: 200, status: 'success', user }).code(200);
  } catch (err) {
    return reply(Boom.notFound('User not found'));
  }
};

/**
 * Update an user
 * @param  {String}  email   User's email
 * @param  {String}  id      User's id
 * @return {Response}
 */
exports.update = async (request, reply) => {
  try {
    await User.findByIdAndUpdate(request.params['id'], { $set: request.payload });

    reply({ code: 200, status: 'success', message: 'Account successfully updated' }).code(200);
  } catch (err) {
    return reply(Boom.notFound('User not found'));
  }
};

/**
 * Update user's password
 * @param  {String}  oldPassword   Old Password
 * @param  {String}  newPassword   New Password
 * @param  {String}  id            User's id
 * @return {Response}
 */
exports.updatePassword = (request, reply) => {
  User.findById(request.params['id']).select('+password').exec(function (err, user) {
    if (err) {
      return reply(Boom.wrap(err, 'Internal MongoDB error'));
    }

    if (!user) {
      return repy(Boom.notFound('User not found'));
    }

    user.comparePassword(request.payload['oldPassword'], function (err, isMatch) {
      if (err) {
        return reply(Boom.wrap(err, 'Internal MongoDB error'));
      }

      if (!isMatch) {
        return reply(Bood.badRequest('Password does not match'));
      }

      user.password = request.payload['newPassword'];

      user.save((err) => {
        if (err) {
          return reply(Boom.wrap(err, 'Internal MongoDB error'));
        }

        reply({ code: 200, status: 'success', message: 'Password successfully updated' }).code(200);
      });
    });
  });
};

/**
 * Remove an user
 * @param  {String}    id    User's id
 * @return {Response}
 */
exports.remove = async (request, reply) => {
  try {
    await User.findByIdAndRemove(request.params['id']);

    reply({ code: 200, status: '200', message: 'Accounts successfully removed' }).code(200);
  } catch (err) {
    return reply(Boom.notFound('User not found'));
  }
};
