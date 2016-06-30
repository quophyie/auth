/* eslint-env mocha */
'use strict'

const AuthStrategy = require('../lib')
const createServer = require('./mock_server')
const Code = require('code')
const expect = Code.expect
const supertest = require('supertest')

let server

let auth = new AuthStrategy({
  secretOrKey: 'secret',
  tokenQueryParameterName: 'token',
  verify: (jwtPayload, done) => { done(null, jwtPayload) }
})

describe('Auth', function () {
  beforeEach(function () {
    server = createServer()
  })

  it('should fail authentication', function (done) {
    auth.express.configure(server)
    server.get('/some-authenticated-route', () => {
      Code.fail('It should not be possible to access this route')
    })
    supertest(server)
      .get('/some-authenticated-route')
      .expect(401)
      .end(done)
  })

  it('should allow access to unauthenticated route', function (done) {
    server.use(auth.express.initialize())
    server.get('/some-unauthenticated-route', (req, res) => {
      res.send()
    })
    server.use(auth.express.authenticate())
    supertest(server)
      .get('/some-unauthenticated-route')
      .expect(200)
      .end(done)
  })

  it('should allow access to authenticated route', function (done) {
    auth.express.configure(server)
    server.get('/some-authenticated-route', (req, res) => {
      res.send()
    })
    supertest(server)
      .get('/some-authenticated-route')
      .set('authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWV9.TJVA95OrM7E2cBab30RMHrHDcEfxjoYZgeFONFh7HgQ')
      .expect(200)
      .end(done)
  })

  it('should allow access to authenticated route by extracting the auth token from the url', function (done) {
    auth.express.configure(server)
    server.get('/some-authenticated-route', (req, res) => {
      res.send()
  })
    supertest(server)
        .get('/some-authenticated-route?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWV9.TJVA95OrM7E2cBab30RMHrHDcEfxjoYZgeFONFh7HgQ')
        .expect(200)
        .end(done)
  })

  it('should issue a new token', function (done) {
    auth.issueToken({some: 'claims'}, null, (token) => {
      expect(token).to.be.a.string()
      expect(token.length).to.be.at.least(1)
      done()
    })
  })

  it('should issue a new set of credentials', function () {
    let credentials = auth.generateApiKey()
    expect(credentials.apiId).to.be.string().and.length(32)
    expect(credentials.apiKey).to.be.string().and.length(64)
  })

  it('should issue a new token for a given set of credentials', function () {
    let credentials = {
      apiId: '12345',
      apiKey: '12345'
    }
    let token = auth.issueTokenForApiKey(credentials, { some: 'payload' }, null)
    expect(token).to.be.string()
  })
})
