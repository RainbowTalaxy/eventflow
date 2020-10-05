const { select, insert, update, remove } = require('./config')

const tableName = 'flow'

const findAll = select(tableName)

const add = insert(tableName)

const change = update(tableName, 'f_id')

const removeById = remove(tableName, 'f_id')

const removeByTeam = remove(tableName, 't_id')

module.exports = {
    findAll, add, change, removeById, removeByTeam
}

// var demo = {
//     't_id': 1,
//     'completed': ['肥宅'].toString(),
//     'current': '宿霸',
//     'inqueue': ['舍暴', '11'].toString(),
//     'f_type': 1,
//     'f_state': 2
// }

// add(demo)

// change({
//     'inqueue': ['11'].toString()
// }, 1)

// removeById(1)

// change(demo, 2)

// findAll()