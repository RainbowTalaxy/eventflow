const { select, insert, removeWithTwoKeys, remove } = require('./config')

const tableName = 'invitation'

const findAll = select(tableName)

const add = insert(tableName)

const removeByKeys = removeWithTwoKeys(tableName, 't_id', 'u_name')

const removeByTeam = remove(tableName, 't_id')

module.exports = {
    findAll, add, removeByKeys, removeByTeam
}

// var demo = {
//     't_id': 8,
//     'u_name': '宿霸'
// }

// add(demo)

// removeByKeys(1, '路人')

// findAll()