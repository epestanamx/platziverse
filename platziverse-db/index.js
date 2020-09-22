'use strict'
const defaults = require('defaults')
const setupDatabase = require('./lib/db')
const setupAgentModel = require('./models/agent')
const setupMetricModel = require('./models/metric')

module.exports = async function (config) {
  config = defaults(config, {
    dialect: 'sqlite',
    pool: {
      max: 10,
      min: 0,
      idle: 10000
    },
    query: {
      raw: true
    }
  })

  const sequelize = setupDatabase(config)
  const AgentModel = setupAgentModel(config)
  const MetricModel = setupMetricModel(config)

  AgentModel.hasMany(MetricModel)
  MetricModel.belongsTo(AgentModel)

  const Agent = {}
  const Metric = {}

  await sequelize.authenticate()

  if (config.setup) {
    await sequelize.sync({ force: true })
  }

  return {
    Agent,
    Metric
  }
}
