const { select, insert, remove } = require('./config')

const tableName = 'account'

const findAll = select(tableName)

const add = insert(tableName)

const removeByName = remove(tableName, 'u_name')

module.exports = {
    findAll, add, removeByName
}

// var demo = {
//     'u_name': 'Talaxy',
//     'u_pwd': 'admin'
// }

// add(demo)

// remove('Talaxy')

// findAll()