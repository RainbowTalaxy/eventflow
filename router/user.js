var router = new require('express').Router()
const account_db = require('../sql/account')
const code = require('./code')

router.get('/user/signin', (req, res) => {
    account_db.findByName(req.session.u_name, (error, result) => {
        if (error) {
            res.send(code[req.session.u_name ? 200 : 201])
        } else {
            if (result.length == 0) {
                res.send(code[300])
            } else {
                res.send(code[result[0].u_pwd == req.session.u_pwd ? 100 : 301])
            }
        }
    })
})

router.post('/user/signin', (req, res) => {
    let params = (req.query.u_name && req.query.u_pwd) ? req.query : req.body
    account_db.findByName(params.u_name, (error, result) => {
        if (error) {
            res.send(code[params.u_name ? 200 : 202])
        } else {
            if (result.length == 0) {
                res.send(code[300])
            } else {
                if (result[0].u_pwd == params.u_pwd) {
                    req.session.u_name = params.u_name
                    req.session.u_pwd = params.u_pwd
                    res.send(code[100])
                } else {
                    res.send(code[301])
                }
            }
        }
    })
})

router.get('/user/signout', (req, res) => {
    req.session.u_name = null
    req.session.u_pwd = null
    res.send(code[100])
})

router.post('/user/login', (req, res) => {
    let params = (req.query.u_name && req.query.u_pwd) ? req.query : req.body
    account_db.add({ u_name: params.u_name, u_pwd: params.u_pwd }, (error) => {
        if (error) {
            res.send(params.u_name ? 302 : 202)
        } else {
            res.send(code[100])
        }
    })
})

// 待完善
router.get('/user/logout', (req, res) => {
    if (req.session.u_name && req.session.u_pwd) {
        account_db.removeByName(req.session.u_name, (error, result) => {
            if (error) {
                res.send(code[303])
            } else {
                req.session.u_name = null
                req.session.u_pwd = null
                res.send(code[100])
            }
        })
    } else {
        res.send(code[304])
    }
})

module.exports = router