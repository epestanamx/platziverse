'use strict'
const test = require('ava')

const config = {
  logging: () => {}
}

let db = null

test.beforeEach(async () => {
  const setupDatabase = require('../')
  db = await setupDatabase(config)
})

test('Agent', t => {
  t.truthy(db.Agent)
})
