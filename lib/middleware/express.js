'use strict'

function Express (passport) {
  this._passport = passport
}

/**
 * Expressjs middleware for initialization.
 * @returns {*}
 */
Express.prototype.initialize = function () {
  return this._passport.initialize()
}

/**
 * Expressjs middleware for authentication.
 * @param opts {Object} Options for authentication
 * @returns {*}
 */
Express.prototype.authenticate = function (opts) {
  opts = opts || {}
  opts.session = false
  return this._passport.authenticate('jwt', opts)
}

/**
 * Expressjs middleware for initialization and authentication.
 * @param app {Object} Expressjs app instance
 * @param opts {Object} Options for authentication
 */
Express.prototype.configure = function (app, opts) {
  app.use(this.initialize())
  app.use(this.authenticate(opts))
}

module.exports = Express
