var router = new require('express').Router()
var account_db = require('../sql/account')

router.get('/user/signin', (req, res) => {
    account_db.findByName(req.session.u_name, (error, result) => {
        let message = {
            success: false
        }
        if (error) {
            message.info = req.session.u_name ? 'database error' : 'session expired'
        } else {
            if (result.length == 0) {
                message.info = 'no such username'
            } else {
                if (result[0].u_pwd == req.session.u_pwd) {
                    message.success = true
                } else {
                    message.info = 'wrong password'
                }
            }
        }
        res.send(message)
    })
})

router.post('/user/signin', (req, res) => {
    account_db.findByName(req.query.u_name, (error, result) => {
        let message = {
            success: false
        }
        if (error) {
            message.info = req.query.u_name ? 'database error' : 'lack of params'
        } else {
            if (result.length == 0) {
                message.info = 'no such username'
            } else {
                if (result[0].u_pwd == req.query.u_pwd) {
                    req.session.u_name = req.query.u_name
                    req.session.u_pwd = req.query.u_pwd
                    message.success = true
                } else {
                    message.info = 'wrong password'
                }
            }
        }
        res.send(message)
    })
})

router.get('/user', (req, res) => {
    res.send(req.session.u_name)
})

module.exports = router