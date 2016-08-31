'use strict'

const ApiKey = require('./apikey')
const AuthStrategy = require('./strategy')
const JwtIssuer = require('./jwt_issuer')

module.exports = AuthStrategy
module.exports.ApiKey = ApiKey
module.exports.issueToken = JwtIssuer.issueToken
module.exports.decodeToken = JwtIssuer.decodeToken
