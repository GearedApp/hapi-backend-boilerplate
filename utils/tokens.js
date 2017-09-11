'use strict';

const Jwt = require('jsonwebtoken');

/**
 * Generate Auth Token for authentication
 * @param  {Object}   payload  User's information
 * @param  {Function} callback Callback function
 * @return {Object}            Token's information
 */
exports.generateAuthToken = async (payload) => {
  try {
    const token = await Jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: '1d' });

    return token;
  } catch (err) {
    return err;
  }
};

/**
 * Generate Auth Token for recover password
 * @param  {Object}   payload  User's information
 * @param  {Function} callback Callback function
 * @return {Object}            Token's information
 */
exports.generatePasswordToken = async (payload) => {
  try {
    const token = await Jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: '1h' });

    return token;
  } catch (err) {
    return err;
  }
};

/**
 * Decode Token
 * @param  {String}   token    User's token
 * @param  {Function} callback Callback function
 * @return {Object}            Token decoded
 */
exports.decodeToken = async (token) => {
  try {
    const decoded = await Jwt.verify(token, process.env.SECRET_KEY);

    return decoded;
  } catch (err) {
    return err;
  }
};
