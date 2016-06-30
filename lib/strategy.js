'use strict'

const Hoek = require('hoek')
const Passport = require('passport').Authenticator
const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt
const Express = require('./middleware/express')
const ApiKey = require('./apikey')
const JwtIssuer = require('./jwt_issuer')

const BEARER_AUTH_SCHEME = 'Bearer'

/**
 * AuthStrategy constructor.
 *
 * @param opts
 * @constructor
 */
function AuthStrategy (opts) {
  opts = opts || {}

  if (!opts.tokenQueryParameterName) opts.tokenQueryParameterName = 'auth_token'
  if (!opts['jwtFromRequest']) {
    opts.jwtFromRequest = ExtractJwt.fromExtractors (
        [
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
 * @param payload
 * @param secret
 * @param otherOpts
 * @param callback
 */
AuthStrategy.prototype.issueToken = function (payload, opts, callback) {
  return JwtIssuer.issueToken(payload, this._secret, opts, callback)
}

/**
 * Issues a token for the given API credentials. he audience is set as the apiId.
 *
 * @param credentials {Object}
 * @param payload {Object}
 * @param opts
 * @returns {*}
 */
AuthStrategy.prototype.issueTokenForApiKey = function (credentials, payload, opts, callback) {
  return ApiKey.issueToken(credentials, payload, this._secret, opts, callback)
}

/**
 * Generates and returns a new set of id/key credentials for external APIs.
 *
 * @returns {Object} credentials object with `apiId` and `apiKey` properties
 */
AuthStrategy.prototype.generateApiKey = function () {
  return ApiKey.generate()
}

module.exports = AuthStrategy
