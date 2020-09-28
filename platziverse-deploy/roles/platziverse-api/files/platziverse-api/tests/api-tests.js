'use strict'
const test = require('ava')
const request = require('supertest')
const sinon = require('sinon')
const proxyquire = require('proxyquire')
const { promisify } = require('util')

const { auth: { secret } } = require('../config')
const agentFixtures = require('./fixtures/agent')
const auth = require('../auth')
const sign = promisify(auth.sign)

let sandbox
let server
let dbStub
let token
const AgentStub = {}
const MetricStub = {}

test.beforeEach(async () => {
  sandbox = sinon.createSandbox()

  AgentStub.findConnected = sandbox.stub()
  AgentStub.findConnected.returns(agentFixtures.connected)

  dbStub = sandbox.stub()
  dbStub.returns({
    Agent: AgentStub,
    Metric: MetricStub
  })

  token = await sign({ admin: true, username: 'platzi', 'permissions': [ 'metrics:read' ] }, secret)

  server = proxyquire('../server', {
    'platziverse-db': dbStub
  })
})

test.afterEach(() => {
  sandbox && sinon.restore()
})

test.serial('/api/agents', async t => {
  const res = await request(server)
    .get('/api/agents')
    .set('Authorization', `Bearer ${token}`)

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
