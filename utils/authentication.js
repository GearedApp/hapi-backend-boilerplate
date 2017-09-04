'use strict';

const User = require('../models/User');

/**
 * Receive a decoded token and check user credentials
 * @param  {Object}   decodedToken Token decoded
 * @param  {Function} callback     Callback
 * @return {Promise}
 */
exports.validate = async (request, decodedToken, callback) => {
  try {
    let user = await User.findByCredentials(decodedToken);

    callback(null, true, user);
  } catch (err) {
    return callback(err, false, user);
  }
};
