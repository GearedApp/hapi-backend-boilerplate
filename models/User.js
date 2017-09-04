'use strict';

const Mongoose = require('mongoose');
const { comparePassword, hashPassword } = require('../utils/passwords');
const { generateAuthToken, generatePasswordToken } = require('../utils/tokens');

let TokenSchema = new Mongoose.Schema({
  access: {
    type: String,
    required: false,
    enum: ['auth', 'password'],
  },

  token: {
    type: String,
    required: false
  }
});

let UserSchema = new Mongoose.Schema({
  email: {
    type: String,
    required: 'Email Address is required',
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
  },

  password: {
    type: String,
    required: 'Password is required',
    minLenght: [6, 'The password must be at least 6 characters long'],
    select: false,
  },

  is_admin: {
    type: Boolean,
    required: true,
    default: false,
  },

  tokens: {
    type: [TokenSchema],
    select: false,
    required: false,
  },

  created_at: {
    type: Date,
    required: true,
    default: Date.now,
  },

  updated_at: {
    type: Date,
    required: false,
  },

  last_login: {
    type: Date,
    required: false,
  },
});

UserSchema.statics.findByCredentials = async (decodedToken) => {
  try {
    let user = await this.findById(decodedToken.id);

    return user;
  } catch (err) {
    return err;
  }
};

UserSchema.methods.generateAuthToken = async () => {
  let user = this;

  try {
    let token = await generateAuthToken({ id: user._id });

    return token;
  } catch (err) {
    return err;
  }
};

UserSchema.methods.generatePasswordToken = async () => {
  let user = this;

  try {
    let token = await generatePasswordToken({ id: user._id });

    return token;
  } catch (err) {
    return err;
  }
};

UserSchema.methods.destroyToken = async (token) => {
  let user = this;

  try {
    await user.update({ $pull: { tokens: token } });
  } catch (err) {
    return err;
  }
};

UserSchema.methods.comparePassword = (plainPassword) => {
  let user = this;

  comparePassword(plainPassword, user.password, (err, isMatch) => {
    if (err) return err;

    return isMatch;
  });
};

UserSchema.pre('save', function (next) {
  let user = this;

  hashPassword(user.password, (err, hash) => {
    if (err) return next(err);

    user.password = hash;
    next();
  });
});

let User = Mongoose.model('User', UserSchema, 'users');

module.exports = User;
