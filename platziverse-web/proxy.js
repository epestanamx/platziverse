'use strcit'
const express = require('express')
const request = require('request-promise-native')
const { endpoint, apiToken } = require('./config')

const api = express.Router()

const options = {
  method: 'get',
  headers: {
    Authorization: `Bearer ${apiToken}`
  },
  json: true
}

api.get('/agents', async (req, res, next) => {
  try {
    const result = await request({ ...options, url: `${endpoint}/api/agents` })

    return res.send(result)
  } catch (e) {
    return next(e)
  }
})

api.get('/agents/:uuid', async (req, res, next) => {

})

api.get('/metrics/:uuid', async (req, res, next) => {

})

api.get('/metrics/:uuid/:type', async (req, res, next) => {

})

module.exports = api
