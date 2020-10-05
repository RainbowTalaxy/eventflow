const { select, insert, removeWithTwoKeys } = require('./config')

const tableName = 'invitation'

const findAll = select(tableName)

const add = insert(tableName)

const removeByKeys = removeWithTwoKeys(tableName, 't_id', 'u_name')

module.exports = {
    findAll, add, removeByKeys
}

var demo = {
    't_id': 1,
    'u_name': '路人'
}

add(demo)

// removeByKeys(1, '路人')

findAll()