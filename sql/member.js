const { select, insert, removeWithTwoKeys, remove, selectBy } = require('./config')

const tableName = 'member'

const findAll = select(tableName)

const findByName = selectBy(tableName, 'u_name')

const add = insert(tableName)

const removeByKeys = removeWithTwoKeys(tableName, 'u_name', 't_id')

const removeByTeam = remove(tableName, 't_id')

const removeByName = remove(tableName, 'u_name')

module.exports = {
    findAll, add, removeByKeys, removeByTeam, findByName, removeByName
}

// add({
//     'u_name': '11',
//     't_id': 1
// })

// findAll()
