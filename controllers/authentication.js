'use strict';

const Boom = require('boom');
const User = require('../models/User');
const Jwt = require('jsonwebtoken');
const { generateAuthToken, generatePasswordToken, decodeToken } = require('../utils/tokens');
const { sendMail } = require('../utils/emails');

/**
 * Create new Account and return auth token
 * @param  {String}  email       Email address
 * @param  {String}  password    Password
 * @return {Response}            Auth token
 */
exports.signup = async (request, reply) => {
  let user = new User(request.payload);

  try {
    await user.save();
    let token = await generateAuthToken({ id: user._id });

    reply({ code: 202, status: 'success', message: 'Account successfully created', token }).code(202);
  } catch (err) {
    return reply(Boom.wrap(err, 'Internal MongoDB error'));
  }
};

/**
 * Login user generating an auth token
 * @param  {String} email       Email address
 * @param  {String} password    Password
 * @return {Response}           Auth token
 */
exports.login = (request, reply) => {
  let data = request.payload;

  User.findOne({ email: data.email }).select('+password').exec(function (err, user) {
    if (err) {
      return reply(Boom.wrap(err, 'Internal MongoDB error'));
    }

    if (!user) {
      return reply(Boom.notFound('User not found'));
    }

    user.comparePassword(data.password, (err, isMatch) => {
      if (err) {
        return reply(Boom.wrap(err, 'Internal MongoDB error'));
      }

      if (!isMatch) {
        return reply(Boom.badRequest('Email or password is incorrect'));
      }

      let token = Jwt.sign({ id: user._id }, process.env.SECRET_KEY, { expiresIn: '1d' });
      reply({ code: 200, status: 'success', token }).code(200);
    });
  });
};

/**
 * Generate a token and send an email
 * with the token and url to recover password page
 * @param {String} email Email address
 * @return {Response}
 */
exports.forgotPassword = async (request, reply) => {
  const email = request.payload['email'];

  try {
    let user = await User.findOne({ email });
    let token = await generatePasswordToken({ id: user._id });

    let url = `${process.env.ROOT_URL}/reset-password`;
    await sendMail({ email, url }, 'Forgot Password' ,'forgotPassword');

    reply({ code: 200, status: 'success', message: 'Email successfully sent' }).code(200);
  } catch (err) {
    return reply(Boom.wrap(err, 'Internal MongoDB error'));
  }
};

/**
 * Check token and reset user's password
 * @param  {String}  token      Password token
 * @param  {String}  password   New Password
 * @return {Response}
 */
exports.recoverPassword = async (request, reply) => {
  const token = request.query['token'];
  const password = request.payload['password'];

  try {
    let decoded = await decodeToken(token);
    let user = await User.findOne({ _id: decoded.id });

    user.password = password;
    user.passwordToken = undefined;

    await user.save();
    reply({ code: 200, status: 'success', message: 'Password successfully updated' }).code(200);
  } catch (err) {
    return reply(Boom.wrap(err, 'Internal MongoDB error'));
  }
};

/**
 * Remove current user session
 * @return {Response}
 */
exports.logout = (request, reply) => {
  request.user = undefined;

  reply({ code: 200, status: 'success', message: 'Logged out' }).code(200);
};
