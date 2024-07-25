const { Sequelize } = require('sequelize')

const sequelize = new Sequelize('thoughts', 'root', '', {
  host: 'localhost',
  dialect: 'mysql',
  module: 'mysql2'
})

try {
  sequelize.authenticate()
  console.log('Conectamos com o Sequelize!')
} catch (error) {
  console.error('Não foi possível conectar:', error)
}

module.exports = sequelize

// const { Sequelize } = require('sequelize')

// const sequelize = new Sequelize("mysql://root:YIDlXOQWyVgkqLoHGcFotOhkJProOKGY@monorail.proxy.rlwy.net:31533/railway", {
//   host: 'localhost',
//   dialect: 'mysql',
//   dialectModule: require('mysql2'),
// })

// try {
//   sequelize.authenticate()
//   console.log('Conectamos com o Sequelize!')
// } catch (error) {
//   console.error('Não foi possível conectar:', error)
// }

// module.exports = sequelize