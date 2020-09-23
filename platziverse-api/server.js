'use strict'
const debug = require('debug')('platziverse:api')
const chalk = require('chalk')
const http = require('http')
const express = require('express')
const { handleFatalError } = require('platziverse-utils')

const api = require('./api')

const port = process.env.PORT || 3000
const app = express()

app.use('/api', api)

app.use((err, req, res, next) => {
  debug(`Error: ${err.message}`)
  
  if (err.message.match(/not found/)) {
    return res.status(404).send({ error: err.message })
  }
})

const server = http.createServer(app);

if (!module.parent) {
  process.on('uncaughtException', handleFatalError)
  process.on('unhandledRejection', handleFatalError)

  server.listen(port, () => {
    console.log(`${chalk.green('[platziverse-api]')} server listening on port ${port}`)
  })
}

module.exports = server
