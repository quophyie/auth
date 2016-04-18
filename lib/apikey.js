'use strict'

const Hoek = require('hoek')
const JwtIssuer = require('./jwt_issuer')
const Randomstring = require('randomstring')

/**
 * Generates and returns a new set of id/key credentials for external APIs.
 *
 * @returns {Object} credentials object with `apiId` and `apiKey` properties
 */
module.exports.generate = function () {
  return {
    apiId: Randomstring.generate({ charset: 'alphanumeric' }),
    apiKey: Randomstring.generate({ length: 64, charset: 'alphanumeric' })
  }
}

/**
 * Issues a token for the given API credentials. he audience is set as the apiId.
 *
 * @param credentials {Object}
 * @param payload {Object}
 * @param opts
 * @returns {*}
 */
module.exports.issueToken = function (credentials, payload, secret, opts, callback) {
  Hoek.assert(credentials && typeof credentials === 'object', 'Invalid credentials value: must be an object')
  Hoek.assert(credentials.apiId && typeof credentials.apiId === 'string', 'Invalid credentials.apiId value: must be an string')
  Hoek.assert(credentials.apiKey && typeof credentials.apiKey === 'string', 'Invalid credentials.apiKey value: must be an string')

  opts = opts || {}
  opts.audience = credentials.apiId

  return JwtIssuer.issueToken(
    payload,
    secret, // new Buffer(credentials.apiKey, 'base64').toString('binary'),  // FIXME probably don't need this
    opts,
    callback)
}
