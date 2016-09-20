'use strict'

const Jwt = require('jsonwebtoken')

const ApiKey = require('./apikey')
const AuthStrategy = require('./strategy')
const JwtIssuer = require('./jwt_issuer')

module.exports = AuthStrategy
module.exports.ApiKey = ApiKey
module.exports.issueToken = JwtIssuer.issueToken

/**
 * Decodes a token. The token signature is not verified
 * @param {string} token - Token to decode
 * @returns {String|Array}
 */
module.exports.decodeToken = Jwt.decode
