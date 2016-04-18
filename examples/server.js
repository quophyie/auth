'use strict'

const AuthStrategy = require('../lib/auth')
const Express = require('express')
const bodyParser = require('body-parser')

const server = new Express()

const users = {
  'john@doe.com': 'some_password'
}
const clients = {}

const auth = new AuthStrategy({
  secretOrKey: 'secret',
  verify: (jwtPayload, done) => {
    // Do some JWT checking here
    done(null, jwtPayload)  // This is passed onto `req.user`
  }
})

server.use(bodyParser.json())
server.use(auth.express.initialize())

server.post('/login', (req, res) => {
  let password = users[req.body.email]
  if (password !== req.body.password) {
    return res
      .status(401)
      .send({ error: 'Invalid credentials' })
  }
  let token = auth.issueToken({ email: req.body.email })
  res.send({ token: token })
})

server.post('/credentials', (req, res) => {
  let credentials = AuthStrategy.ApiKey.generate()
  clients[credentials.apiId] = credentials.apiKey
  res.send(credentials)
})

server.post('/token', (req, res) => {
  if (!clients[req.body.apiId] || req.body.apiKey !== clients[req.body.apiId]) {
    return res
      .status(401)
      .send({ error: 'Invalid credentials' })
  }
  let token = auth.issueTokenForApiKey(req.body, { apiId: req.body.apiId })
  res.send({ token: token })
})

server.use(auth.express.authenticate())

server.get('/some-auth-route', (req, res) => {
  res.send({ response: 'some secret content' })
})

server.listen(9000, () => {
  console.log('Listening on http://localhost:9000')
})
