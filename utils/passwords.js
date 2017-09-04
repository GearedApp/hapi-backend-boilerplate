'use strict';

const Bcrypt = require('bcrypt');

/**
 * Check if the plain password is equal to the current user's hash password
 * @param  {String}   plainPassword  Plain password from form
 * @param  {Binary}   hashPassword   User's password
 * @param  {Function} callback       Callback
 * @return {Promise}
 */
exports.comparePassword = async (plainPassword, hashPassword, callback) => {
  try {
    let isMatch = await Bcrypt.compare(plainPassword, hashPassword);

    callback(null, isMatch);
  } catch (err) {
    return callback(err);
  }
};

/**
 * Receive a plain password and convert it to a hash
 * @param  {String}   plainPassword Plain password from form
 * @param  {Function} callback      Callback
 * @return {Promise}
 */
exports.hashPassword = async (plainPassword, callback) => {
  try {
    let salt = await Bcrypt.genSalt(10);
    let hash = await Bcrypt.hash(plainPassword, salt);

    callback(null, hash);
  } catch (err) {
    return callback(err);
  }
};
