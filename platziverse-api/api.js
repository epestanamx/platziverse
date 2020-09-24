const debug = require('debug')('platziverse:api:routes')
const express = require('express')

const api = express.Router()

api.get('/agents', async (req, res) => {
  debug('A request has come to /agents')
  try {
    const agents = await req.models.Agent.findConnected()
    return res.send(agents)
  } catch (e) {
    return next(e)
  }
})

api.get('/agents/:uuid', async (req, res, next) => {
  debug('A request has come to /agents/:uuid')
  const { uuid } = req.params

  try {
    const agent = await req.models.Agent.findByUuid(uuid)

    if (!agent) {
      return next(new Error(`Agent not found with uuid ${uuid}`))
    }

    return res.send(agent)
  } catch (e) {
    return next(e)
  }
})

api.get('/metrics/:uuid', async (req, res, next) => {
  debug('A request has come to /metrics/:uuid');
  const { uuid } = req.params

  try {
    const metrics = await req.models.Metric.findByAgentUuid(uuid)

    if (!metrics || metrics.length === 0) {
      return next(new Error(`Metrics not found for agent with uuid ${uuid}`));
    }

    res.send(metrics);
  } catch (e) {
    return next(e)
  }
})

api.get('/metrics/:uuid/:type', async (req, res, next) => {
  debug('A request has come to /metrics/:uuid/:type');
  const { uuid, type } = req.params

  try {
    const metrics = await req.models.Metric.findByTypeAgentUuid(type, uuid);

    if (!metrics || metrics.length === 0) {
      return next(new Error(`Metrics not found for agent with uuid ${uuid} and type ${type}`));
    }

    res.send(metrics);
  } catch (e) {
    return next(e);
  }
})

module.exports = api
