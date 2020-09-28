'use strict'

module.exports = {
  auth: {
    secret: process.env.SECRET || 'platzi',
    algorithms: ['HS256']
  }
}
