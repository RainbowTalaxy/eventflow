const { select, selectBy, insert, remove } = require('./config')

const tableName = 'account'

const findAll = select(tableName)

const findByName = selectBy(tableName, 'u_name')

const add = insert(tableName)

const removeByName = remove(tableName, 'u_name')

module.exports = {
    findAll, add, removeByName, findByName
}

// var demo = {
//     'u_name': 'Talaxy',
//     'u_pwd': 'admin'
// }

// add(demo)

// remove('Talaxy')

// findAll()