'use strict'
const test = require('ava')
const request = require('supertest')
const sinon = require('sinon')
const proxyquire = require('proxyquire')

const agentFixtures = require('./fixtures/agent')

let sandbox
let server
let dbStub
let AgentStub = {}
let MetricStub = {}

test.beforeEach(() => {
  sandbox = sinon.createSandbox()

  AgentStub.findConnected = sandbox.stub()
  AgentStub.findConnected.returns(agentFixtures.connected)

  dbStub = sandbox.stub()
  dbStub.returns({
    Agent: AgentStub,
    Metric: MetricStub
  })

  server = proxyquire('../server', {
    'platziverse-db': dbStub
  })
})

test.afterEach(() => {
  sandbox && sinon.restore()
})

// test.serial.cb('/api/agents', t => {
//   request(server)
//     .get('/api/agents')
//     .expect(200)
//     .expect('Content-Type', /js/)
//     .end((err, res) => {
//       t.end()
//     })
// })
test.serial('/api/agents', async t => {
  const res = await request(server)
    .get('/api/agents')

  t.regex(res.headers['content-type'], /json/, 'response Content Type should be json type')
  t.deepEqual(res.statusCode, 200, 'response status code should be 200')
  t.deepEqual(JSON.stringify(res.body), JSON.stringify(agentFixtures.connected), 'response body should be the expected')
})

test.serial.todo('/api/agent/:uuid')
test.serial.todo('/api/agent/:uuid - not found')

test.serial.todo('/api/metrics/:uuid')
test.serial.todo('/api/metrics/:uuid - not found')

test.serial.todo('/api/metrics/:uuid/:type')
test.serial.todo('/api/metrics/:uuid/:type - not found')
