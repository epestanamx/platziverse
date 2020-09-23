'use strict'
const test = require('ava')
const request = require('supertest')
const server = require('../server')

test.serial('/api/agents', async t => {
  const res = await request(server)
    .get('/api/agents')

  t.regex(res.headers['content-type'], /json/, 'response Content Type should be json type')
  t.deepEqual(res.statusCode, 200, 'response status code should be 200')
  t.deepEqual(res.body, {}, 'response body should be the expected')
})
