'use strict'
const Sequelize = require('sequelize')
let sequelize = null

module.exports = function setupDatebase (config) {
  if (!sequelize) {
    sequelize = new Sequelize(config)
  }

  return sequelize
}
