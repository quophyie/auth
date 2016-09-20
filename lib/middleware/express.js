'use strict'

class Express {
  constructor (passport) {
    this._passport = passport
  }

  /**
   * Expressjs middleware for initialization.
   * @returns {Promise}
   */
  initialize () {
    return this._passport.initialize()
  }

  /**
   * Expressjs middleware for authentication.
   * @param {Object} opts Options for authentication
   * @returns {Promise}
   */
  authenticate (opts = {}) {
    opts.session = false
    return this._passport.authenticate('jwt', opts)
  }

  /**
   * Expressjs middleware for initialization and authentication.
   * @param {Object} app Expressjs app instance
   * @param {Object} opts Options for authentication
   */
  configure (app, opts) {
    app.use(this.initialize())
    app.use(this.authenticate(opts))
  }
}

module.exports = Express
