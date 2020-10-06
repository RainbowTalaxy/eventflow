const { select, insert, remove, update, selectBy } = require('./config')

const tableName = 'team'

const findAll = select(tableName)

const findById = selectBy(tableName, 't_id')

const findByName = selectBy(tableName, 'founder')

const add = insert(tableName)

const removeById = remove(tableName, 't_id')

const change = update(tableName, 't_id')

module.exports = {
    findAll, add, removeById, change, findById, findByName
}

// var demo = {
//     't_name': '3013宿舍',
//     'founder': '舍暴'
// }

// add(demo)

// change(demo, 2)

// findAll()

// removeById(3)
