'use strict'
const inquirer = require('inquirer')
const db = require('./')
const { configDb, handleFatalError } = require('platziverse-utils')

const prompt = inquirer.createPromptModule()

async function setup () {
  if (!process.argv.includes('--yes') && !process.argv.includes('-y')) {
    const answer = await prompt([
      {
        type: 'confirm',
        name: 'setup',
        message: 'This will destroy your database, are you sure?'
      }
    ])

    if (!answer.setup) {
      return console.log('Nothing happended!')
    }
  }

  const config = configDb('platziverse:db:setup', true)

  await db(config).catch(handleFatalError)

  console.log('Success!')
  process.exit(0)
}

setup()
