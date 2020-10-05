const { select, insert, remove, update } = require('./config')

const tableName = 'team'

const findAll = select(tableName)

const add = insert(tableName)

const removeById = remove(tableName, 't_id')

const change = update(tableName, 't_id')

module.exports = {
    findAll, add, removeById, change
}

// var demo = {
//     't_name': '3013宿舍',
//     'founder': '舍暴'
// }

// add(demo)

// change(demo, 2)

findAll()
