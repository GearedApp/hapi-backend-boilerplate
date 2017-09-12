'use strict';

const Mongoose = require('mongoose');

let DocumentSchema = new Mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    maxLength: 100,
    trim: true,
    lowercase: true,
    required: 'The document name is required',
    unique: true,
  },

  url: {
    type: String,
    required: 'The url name is required',
  },

  owner: {
    type: Mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: 'Owner is required',
  },

  created_at: {
    type: Date,
    required: 'Created At is required',
    default: Date.now,
  },

  updated_at: {
    type: Date,
    required: false,
  },
});

let Document = Mongoose.model('Document', DocumentSchema, 'documents');

module.exports = Document;
