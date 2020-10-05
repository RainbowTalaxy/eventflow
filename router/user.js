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
    let params = (req.query.u_name && req.query.u_pwd) ? req.query : req.body
    account_db.findByName(params.u_name, (error, result) => {
        let message = {
            success: false
        }
        if (error) {
            message.info = params.u_name ? 'database error' : 'lack of params'
        } else {
            if (result.length == 0) {
                message.info = 'no such username'
            } else {
                if (result[0].u_pwd == params.u_pwd) {
                    req.session.u_name = params.u_name
                    req.session.u_pwd = params.u_pwd
                    message.success = true
                } else {
                    message.info = 'wrong password'
                }
            }
        }
        res.send(message)
    })
})

router.get('/user/signout', (req, res) => {
    req.session.u_name = null
    req.session.u_pwd = null
    res.send({
        success: true
    })
})

router.post('/user/login', (req, res) => {
    let params = (req.query.u_name && req.query.u_pwd) ? req.query : req.body
    account_db.add({ u_name: params.u_name, u_pwd: params.u_pwd }, (error) => {
        let message = {
            success: false
        }
        if (error) {
            message.info = params.u_name ? 'account exists or other database error' : 'lack of params'
        } else {
            message.success = true
        }
        res.send(message)
    })
})

router.get('/user/logout', (req, res) => {
    let message = {
        success: false
    }
    if (req.session.u_name && req.session.u_pwd) {
        account_db.removeByName(req.session.u_name, (error, result) => {
            if (error) {
                message.info = 'account not exist or other database error'
            } else {
                message.success = true
            }
            res.send(message)
        })
    } else {
        message.info = 'please sign in before logout'
        res.send(message)
    }
})

module.exports = router