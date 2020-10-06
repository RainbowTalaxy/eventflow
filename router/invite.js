var router = new require('express').Router()
const invitation_db = require('../sql/invitation')
const team_db = require('../sql/team')
const account_db = require('../sql/account')
const member_db = require('../sql/member')
const other_db = require('../sql/others')
const code = require('./code')

router.get('/invite/list', (req, res) => {
    if (req.session.u_name && req.session.u_pwd) {
        other_db.findUsersInvitation(req.session.u_name, (error, result) => {
            if (error) {
                res.send(code[200])
            } else {
                res.send({
                    status: code[100],
                    list: result
                })
            }
        })
    } else {
        res.send(code[304])
    }
})

router.post('/invite/invite', (req, res) => {
    let params = (req.query.t_id && req.query.u_name) ? req.query : req.body
    if (req.session.u_name && req.session.u_pwd) {
        team_db.findById(params.t_id, (error, result) => {
            if (error) {
                res.send(code[200])
            } else {
                if (result.length == 0) {
                    res.send(code[309])
                } else if (result[0].founder != req.session.u_name) {
                    res.send(code[312])
                } else {
                    account_db.findByName(params.u_name, (error, result) => {
                        if (result.length == 0) {
                            res.send(code[300])
                        } else {
                            other_db.findTeamsMembers(params.t_id, (error, result) => {
                                if (result.some(i => i.u_name == params.u_name)) {
                                    res.send(code[306])
                                } else {
                                    invitation_db.add({ t_id: params.t_id, u_name: params.u_name }, () => {
                                        res.send(code[100])
                                    })
                                }
                            })
                        }
                    })
                }
            }
        })
    } else {
        res.send(code[304])
    }
})

router.post('/invite/accept', (req, res) => {
    let params = (req.query.t_id) ? req.query : req.body
    if (req.session.u_name && req.session.u_pwd) {
        team_db.findById(params.t_id, (error, result) => {
            if (error) {
                res.send(code[200])
            } else {
                if (result.length == 0) {
                    res.send(code[309])
                } else {
                    invitation_db.removeByKeys(params.t_id, req.session.u_name, (error, result) => {
                        if (error) {
                            res.send(code[(params.t_id && req.session.u_name) ? 307 : 202])
                        } else {
                            member_db.add({ t_id: params.t_id, u_name: req.session.u_name }, () => {
                                res.send(code[100])
                            })
                        }
                    })
                }
            }
        })
    } else {
        res.send(code[304])
    }
})

module.exports = router