'use strict'
const chalk = require('chalk')
const db = require('../')

async function run () {
  const config = {
    database: process.env.DB_NAME || 'platziverse',
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASS,
    host: process.env.DB_HOST || 'localhost',
    dialect: 'postgres'
  }

  const { Agent, Metric } = await db(config).catch(handleFatalError)

  const agent = await Agent.createOrUpdate({
    uuid: 'yyy',
    name: 'test',
    username: 'test',
    hostname: 'test',
    pid: 1,
    connected: true
  }).catch(handleFatalError)

  console.log('-- agent --')
  console.log(agent)

  const agents = await Agent.findAll().catch(handleFatalError)
  console.log('-- agents --')
  console.log(agents)

  await Metric.create(agent.uuid, { type: 'memory', value: 300 })

  const metrics = await Metric.findByAgentUuid(agent.uuid)
  console.log('-- metrics --')
  console.log(metrics)

  const metricsByType = await Metric.findByTypeAgentUuid('memory', agent.uuid)
  console.log('-- metrics --')
  console.log(metricsByType)
}

function handleFatalError (err) {
  console.error(`${chalk.red('{Fatal error}')} ${err.message}`)
  console.error(err.stack)
}

run()
