'use stric'
const chalk = require('chalk')

const configDb = (packageName, setup = false) => {
  const debug = require('debug')(packageName)

  return {
    database: process.env.DB_NAME || 'platziverse',
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASS,
    host: process.env.DB_HOST || 'localhost',
    dialect: 'postgres',
    logging: (s) => debug(s),
    setup
  }
}

const parsePayload = (payload) => {
  if (payload instanceof Buffer) {
    payload = payload.toString('utf-8')
  }

  try {
    payload = JSON.parse(payload)
  } catch (e) {
    payload = null
  }

  return payload
}

const handleFatalError = (err) => {
  console.error(`${chalk.red('[fatal error]')} ${err.message}`)
  console.error(err.stack)
  process.exit(1)
}

const handleError = (err) => {
  console.error(`${chalk.red('[error]')} ${err.message}`)
  console.error(err.stack)
}

const extend = (obj, values) => {
  const clone = Object.assign({}, obj)
  return Object.assign(clone, values)
}

module.exports = {
  configDb,
  parsePayload,
  handleError,
  handleFatalError,
  extend
}
