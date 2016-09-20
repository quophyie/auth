'use strict'

const Hoek = require('hoek')
const Passport = require('passport').Authenticator
const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt
const Express = require('./lib/middleware/express')
const Jwt = require('jsonwebtoken')
const Uuid = require('node-uuid')

const BEARER_AUTH_SCHEME = 'Bearer'

class AuthStrategy {
  /**
   * AuthStrategy constructor.
   *
   * @param {Object} opts
   * @constructor
   */
  constructor (opts = {}) {
    if (!opts.tokenQueryParameterName) opts.tokenQueryParameterName = 'auth_token'

    if (!opts.jwtFromRequest) {
      opts.jwtFromRequest = ExtractJwt.fromExtractors([
        ExtractJwt.fromAuthHeaderWithScheme(BEARER_AUTH_SCHEME),
        ExtractJwt.fromUrlQueryParameter(opts.tokenQueryParameterName)
      ])
    }

    Hoek.assert(typeof opts.verify === 'function', 'Invalid opts.verify value: must be a function')
    Hoek.assert(typeof opts.secretOrKey === 'string', 'Invalid opts.secretOrKey value: must be a string')

    this._secret = opts.secretOrKey

    this._passport = new Passport()
    this._passport.use(new JwtStrategy(opts, opts.verify))

    this.express = new Express(this._passport)
  }

  /**
   * Issues a new Json Web Token with the AuthStrategy's secret
   *
   * @param {Object} payload
   * @param {Object} opts
   * @param {Function} callback
   * @returns {Promise}
   */
  issueToken (payload, opts = { expiresIn: '15d' } , callback) {
    // Unique token ID for revoking purposes
    payload.jti = Uuid.v4()

    // sign supports both sync and async calls
    return Jwt.sign(payload, this._secret, opts, callback)
  }

  /**
   * Decodes a token. The token signature is not verified
   * @param {string} token - Token to decode
   * @returns {String|Array}
   */
  decodeToken (token) {
    return Jwt.decode(token)
  }
}

module.exports = AuthStrategy
