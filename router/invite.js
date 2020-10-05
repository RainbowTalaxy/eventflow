var router = new require('express').Router()
const invitation_db = require('../sql/invitation')
const account_db = require('../sql/account')
const member_db = require('../sql/member')
const other_db = require('../sql/others')

router.get('/invite/list', (req, res) => {
    let message = {
        success: false
    }
    if (req.session.u_name && req.session.u_pwd) {
        other_db.findUsersInvitation(req.session.u_name, (error, result) => {
            if (error) {
                message.info = 'database error'
            } else {
                message.success = true
                message.list = result
            }
            res.send(message)
        })
    } else {
        message.info = 'please sign in before logout'
        res.send(message)
    }
})

router.post('/invite/invite', (req, res) => {
    let message = {
        success: false
    }
    let params = (req.query.t_id && req.query.u_name) ? req.query : req.body
    if (req.session.u_name && req.session.u_pwd) {
        account_db.findByName(u_name, (error, result) => {
            if (result.length == 0) {
                message.info = 'account does not exist'
                res.send(message)
            } else {
                other_db.findTeamsMembers(params.t_id, (error, result) => {
                    if (result.some(i => i.u_name == params.u_name)) {
                        message.info = 'already a member of the team'
                        res.send(message)
                    } else {
                        invitation_db.add({ t_id: params.t_id, u_name: params.u_name }, () => {
                            message.success = true
                            res.send(message)
                        })
                    }
                })
            }
        })
    } else {
        message.info = 'please sign in before logout'
        res.send(message)
    }
})

router.post('/invite/accept', (req, res) => {
    let message = {
        success: false
    }
    let params = (req.query.t_id && req.query.u_name) ? req.query : req.body
    if (req.session.u_name && req.session.u_pwd) {
        invitation_db.removeByKeys(params.t_id, params.u_name, (error, result) => {
            if (error) {
                message.info = (params.t_id && params.u_name) ? 'invitation does not exist or other database error' : 'lack of parmas'
                res.send(message)
            } else {
                member_db.add({ t_id: params.t_id, u_name: params.u_name }, () => {
                    message.success = true
                    res.send(message)
                })
            }
        })
    } else {
        message.info = 'please sign in before logout'
        res.send(message)
    }
})

module.exports = router