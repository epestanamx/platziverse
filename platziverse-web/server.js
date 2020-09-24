'use strict'
const debug = require('debug')('platziverse:web')
const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')
const chalk = require('chalk')
const { handleFatalError } = require('platziverse-utils')
const PlatziverseAgent = require('platziverse-agent')

const port = process.env.PORT || 8080
const app = express()
const server = http.createServer(app)
const io = socketio(server)
const agent = new PlatziverseAgent()

// Socke.io
io.on('connect', socket => {
  debug(`Connected ${socket.id}`)

  // agent.on('agent/connected', payload => {
  //   socket.emit('agent/connected', payload)
  // })

  // agent.on('agent/message', payload => {
  //   socket.emit('agent/message', payload)
  // })

  // agent.on('agent/disconnected', payload => {
  //   socket.emit('agent/disconnected', payload)
  // })

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

process.on('uncaughtException', handleFatalError)
process.on('unhandledRejection', handleFatalError)

server.listen(port, () => {
  console.log(`${chalk.green('[platziverse-web]')} server listening on port ${port}`)
  agent.connect()
})
