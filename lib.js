

var supertest = require('supertest'),
  Test = supertest.Test


Test.prototype.api = function fniss(a, b) {
  // TODO: also assert on the HTTP header code
  var code,
    isObject;

  isObject = 'object' === typeof a
  if ('object' === typeof a) {
    code = a.code
  } else if ('number' === typeof a) {
    code = a
  }
  if (code === 0) {
      this._asserts.push(function(res) {
        return res.body.status === 'ok' ? null : 'Expected response body to have status "ok"'
      })
  } else {
      this._asserts.push(function(res) {
        return res.body.status === 'fail' ? null : 'Expected response body to have status "fail"'
      })    
      this._asserts.push(function(res) {
        var exp, act, msg = '';
        if (res.body.code !== code) {
          if (isObject) {
            msg += 'Expected response to be "' + a.response + '". Actual: "' + res.body.response + '"\n'
          }
          msg += 'Expected code: ' + code + '. Actual code: ' + res.body.code
          return msg
        }
      })
  }

  if ('function' === typeof b) {
    this.end(b)
  }

  return this;
}
