'use strict'
const debug = require('debug')('platziverse:web')
const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')
const chalk = require('chalk')
const { handleFatalError } = require('platziverse-utils')
const PlatziverseAgent = require('platziverse-agent')

const proxy = require('./proxy')

const port = process.env.PORT || 8080
const app = express()
const server = http.createServer(app)
const io = socketio(server)
const agent = new PlatziverseAgent()

// Socke.io
io.on('connect', socket => {
  debug(`Connected ${socket.id}`)

  pipe(agent, socket)
})

function pipe (source, target) {
  if (!source.emit || !target.emit) {
    throw TypeError("Please pass EventEmitter's as arguments")
  }

  const emit = (source._emit = source.emit)

  source.emit = function () {
    emit.apply(source, arguments)
    target.emit.apply(target, arguments)
    return source
  }
}

app.use(express.static(path.join(__dirname, 'public')))

app.use('/', proxy)

app.use((err, req, res, next) => {
  debug(`Error: ${err.message}`)

  if (err.message.match(/not found/)) {
    return res.status(404).send({ error: err.message })
  }

  if (err.name === 'UnauthorizedError') {
    return res.status(401).send({ error: err.message })
  }

  res.status(500).send({ error: err.message })
})

process.on('uncaughtException', handleFatalError)
process.on('unhandledRejection', handleFatalError)

server.listen(port, () => {
  console.log(`${chalk.green('[platziverse-web]')} server listening on port ${port}`)
  agent.connect()
})
