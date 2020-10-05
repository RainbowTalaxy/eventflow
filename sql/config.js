var mysql = require('mysql')

var config = {
    host: 'localhost',
    user: 'root',
    password: 'huangdaju',
    database: 'eventflow'
}

function query(callback) {
    var connection = mysql.createConnection(config)
    connection.connect()
    callback(connection)
    connection.end()
}

function select(tableName) {
    return (callback = console.log) => {
        query(connection => {
            connection.query('select * from ' + tableName, (error, results) => {
                callback(error, results)
            })
        })
    }
}

function selectBy(tableName, field) {
    return (value, callback = console.log) => {
        query(connection => {
            connection.query('select * from ' + tableName + ' where ' + field + ' = ?', value, (error, results) => {
                callback(error, results)
            })
        })
    }
}

function insert(tableName) {
    return (object, callback = console.log) => {
        query(connection => {
            connection.query('insert into ' + tableName + ' set ?', object, (error, results) => {
                callback(error, results)
            })
        })
    }
}

function update(tableName, field) {
    return (object, value, callback = console.log) => {
        query(connection => {
            connection.query('update ' + tableName + ' set ? where ' + field + ' = ?', [object, value], (error, results) => {
                callback(error, results)
            })
        })
    }
}

function remove(tableName, field) {
    return (value, callback = console.log) => {
        query(connection => {
            connection.query('delete from ' + tableName + ' where ' + field + ' = ?', value, function (error, results) {
                callback(error, results)
            })
        })
    }
}

function removeWithTwoKeys(tableName, field_1, field_2) {
    return (value_1, value_2, callback = console.log) => {
        query(connection => {
            connection.query(
                'delete from ' + tableName + ' where ' + field_1 + ' = ? and ' + field_2 + ' = ?', 
                [value_1, value_2], 
                (error, results) => {
                    callback(error, results)
                }
            )
        })
    }
}

module.exports = {
    query, select, insert, remove, update, removeWithTwoKeys, selectBy
}

// query(connection => {
//     connection.query('select ? from team', 't_id founder',  function (error, results) {
//         console.log(error, results)
//     })
// })