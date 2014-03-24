var apisend = require('apisend')
var apitest = require('./lib')

var request = require('supertest')

// TODO: describe error modes, and when the asserts should fail
describe('apisend basic', function() {
  var app,
    closer;

  before(function(done) {
    var express = require('express')
    app = express()

    var errors = {
      UNAUTH: {
        http: 401,
        code: 1,
        response: 'You are not authorized'
      }
    }
    app.use(apisend(errors))
    app.get('/', function(req, res) {
      res.apisend(0)
    })
    app.get('/code1', function(req, res) {
      res.apisend(1)
    })
    app.get('/string_conts', function(req, res) {
      res.apisend(0, 'some_result')
    })
    closer = app.listen(3000, done)
  })

  it('should send a basic 200 response', function(done) {
    request(app).get('/').api(0).expect(200).end(function(err, res) {
      if (err) return done(err)
      done()
    })
  })

  it('should accept code 1', function(done) {
    request(app).get('/code1').api(1).end(function(err, res) {
      if (err) return done(err)
      done()
    })
  })

  it('should accept code 1, with done as second parameter', function(done) {
    request(app).get('/code1').api(1, done)
  })


  after(function(done) {
    closer.close(done)
  })
})
