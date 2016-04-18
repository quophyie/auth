'use strict'

const Hoek = require('hoek')
const Jwt = require('jsonwebtoken')
const Uuid = require('node-uuid')

const defaultOpts = {
  expiresIn: '15d'  // expires in 15 days
}

/**
 * Issues a new Json Web Token.
 *
 * @param payload
 * @param secret
 * @param otherOpts
 * @param callback
 */
module.exports.issueToken = function (payload, secret, otherOpts, callback) {
  var opts = Hoek.applyToDefaults(defaultOpts, otherOpts, true)

  // Unique token ID for revoking purposes
  payload.jti = Uuid.v4() // FIXME return this ID for storing ?

  // sign supports both sync and async calls
  return Jwt.sign(payload, secret, opts, callback)
}