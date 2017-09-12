'use strict';

const Boom = require('boom');
const Document = require('../models/Document');
const fs = require('fs');
const path = require('path');

/**
 * Upload documents
 * @param  {File} file  File
 * @return {Response}
 */
exports.create = (request, reply) => {
  let data = request.payload;

  if (data.file) {
    let name = data.file.hapi.filename;
    let url = path.resolve(__dirname, '..', 'uploads');
    let file = fs.createWriteStream(`${url}/${name}`);

    file.on('error', function (err) {
      console.error(err);
    });

    data.file.pipe(file);

    data.file.on('end', function (err) {
      if (err) {
        console.error(err);
      }

      let doc = new Document({ name, url, owner: request.auth.credentials._id });

      doc.save((err) => {
        if (err) {
          console.error(err);
        }

        reply({ code: 202, status: 'success', message: 'Document successfully created' }).code(202);
      });
    });
  }
};

/**
 * Update documents
 * @param  {File} file  File
 * @return {Response}
 */
exports.update = async (request, reply) => {
  let data = request.payload;

  if (data.file) {
    let name = data.file.hapi.filename;
    let url = path.resolve(__dirname, '..', 'uploads');
    let file = fs.createWriteStream(`${url}/${name}`);

    file.on('error', function (err) {
      console.error(err);
    });

    data.file.pipe(file);

    data.file.on('end', function (err) {
      if (err) {
        console.error(err);
      }

      Document.findOne({ _id: request.params['id'], owner: request.auth.credentials._id }).exec(function (err, doc) {
        if (err) {
          return reply(Boom.wrap(err, 'Internal MongoDB error'));
        }

        doc.name = name;
        doc.url = url;

        doc.save((err) => {
          if (err) {
            console.error(err);
          }

          reply({ code: 202, status: 'success', message: 'Document successfully updated' }).code(202);
        });
      });
    });
  }
};

/**
 * Get all documents by owner
 * @return {Array}
 */
exports.getAll = async (request, reply) => {
  try {
    let documents = await Document.find({ owner: request.auth.credentials._id });

    reply({ code: 200, status: 'success', documents }).code(200);
  } catch (err) {
    return reply(Boom.wrap(err, 'Internal MongoDB error'));
  }
};

/**
 * Get one document
 * @param  {String}  id     Document's id
 * @return {Object}         Document
 */
exports.getOne = async (request, reply) => {
  try {
    let doc = await Document.findOne({ _id: request.params['id'], owner: request.auth.credentials._id });

    reply({ code: 200, status: 'success', document: doc }).code(200);
  } catch (err) {
    return reply(Boom.wrap(err, 'Internal MongoDB error'));
  }
};

/**
 * Remove a document
 * @param  {String}  id   Document's id
 * @return {Response}
 */
exports.remove = (request, reply) => {
  Document.findById(request.params['id']).exec(function (err, doc) {
    if (err) {
      return reply(Boom.wrap(err, 'Internal MongoDB error'));
    }

    fs.unlink(doc.url, function (err) {
      if (err) {
        console.error(err);
      }

      Document.remove(doc, function (err) {
        if (err) {
          return reply(Boom.wrap(err, 'Internal MongoDB error'));
        }

        reply({ code: 200, status: 'success', message: 'Document successfully removed' }).code(200);
      });
    });
  });
};
