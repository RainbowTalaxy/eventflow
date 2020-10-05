const { select, insert, removeWithTwoKeys } = require('./config')

const tableName = 'member'

const findAll = select(tableName)

const add = insert(tableName)

const removeByKeys = removeWithTwoKeys(tableName, 'u_name', 't_id')

module.exports = {
    findAll, add, removeByKeys
}

// add({
//     'u_name': '11',
//     't_id': 1
// })

// findAll()
