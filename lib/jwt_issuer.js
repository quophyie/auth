'use strict'

const Hoek = require('hoek')
const Jwt = require('jsonwebtoken')
const Uuid = require('node-uuid')

const defaultOpts = {
  expiresIn: '15d'  // expires in 15 days
}

module.exports = {
  /**
   * Issues a new Json Web Token.
   *
   * @param payload
   * @param secret
   * @param otherOpts
   * @param callback
   */
  issueToken: (payload, secret, otherOpts, callback) => {
    let opts = Hoek.applyToDefaults(defaultOpts, otherOpts, true)

    // Unique token ID for revoking purposes
    payload.jti = Uuid.v4() // FIXME return this ID for storing ?

    // sign supports both sync and async calls
    return Jwt.sign(payload, secret, opts, callback)
  },

  /**
   * Decodes a token. The token signature is not verified
   * @param {string} token - Token to decode
   * @returns {String|Array}
   */
  decodeToken: (token) => {
    return Jwt.decode(token)
  }
}
