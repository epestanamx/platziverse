const chalk = require('chalk')
const http = require('http')
const express = require('express')

const api = require('./api')

const port = process.env.PORT || 3000
const app = express()

app.use('/api', api)

const server = http.createServer(app)

server.listen(port, () => {
  console.log(`${chalk.green('[platziverse-api]')} server listening on port ${port}`)
})
