var router = new require('express').Router()
const team_db = require('../sql/team')
const member_db = require('../sql/member')
const invitation_db = require('../sql/invitation')
const flow_db = require('../sql/flow')
const other_db = require('../sql/others')
const code = require('./code')

router.post('/team/create', (req, res) => {
    let params = req.query.t_name ? req.query : req.body
    if (req.session.u_name && req.session.u_pwd) {
        team_db.add({ t_name: params.t_name, founder: req.session.u_name }, (error, result) => {
            if (error) {
                res.send(code[params.t_name ? 200 : 202])
            } else {
                member_db.add({ t_id: result.insertId, u_name: req.session.u_name }, (error, result) => {
                    res.send(code[100])
                })
            }
        })
    } else {
        res.send(code[304])
    }
})

router.get('/team/list', (req, res) => {
    if (req.session.u_name && req.session.u_pwd) {
        other_db.findUsersTeams(req.session.u_name, (error, result) => {
            if (error) {
                res.send(code[200])
            } else {
                let message = code[100]
                message.list = result
                res.send(message)
            }
        })
    } else {
        res.send(code[304])
    }
})

router.post('/team/edit', (req, res) => {
    let params = (req.query.t_id && req.query.t_name) ? req.query : req.body
    if (req.session.u_name && req.session.u_pwd) {
        team_db.change({ t_name: params.t_name }, params.t_id, (error, result) => {
            if (error) {
                res.send(code[(params.t_id && params.t_name) ? 200 : 202])
            } else {
                res.send(code[100])
            }
        })
    } else {
        res.send(code[304])
    }
})

router.post('/team/delete', (req, res) => {
    let params = (req.query.t_id) ? req.query : req.body
    if (req.session.u_name && req.session.u_pwd) {
        team_db.removeById(params.t_id, (error, result) => {
            if (error) {
                res.send(code[params.t_id ? 200 : 202])
            } else {
                invitation_db.removeByTeam(params.t_id, () => {
                    member_db.removeByTeam(params.t_id, () => {
                        flow_db.removeByTeam(params.t_id, () => {
                            res.send(code[100])
                        })
                    })
                })
            }
        })
    } else {
        res.send(code[304])
    }
})

router.post('/team/member/delete', (req, res) => {
    let params = (req.query.t_id && req.query.t_name) ? req.query : req.body
    if (req.session.u_name && req.session.u_pwd) {
        member_db.removeByKeys({ t_id: params.t_id, u_name: params.u_name }, () => {
            if (error) {
                res.send(code[(params.t_id && params.u_name) ? 305 : 202])
            } else {
                res.send(code[100])
            }
        })
    } else {
        res.send(code[304])
    }
})

router.post('/team/member/list', (req, res) => {
    let params = (req.query.t_id && req.query.t_name) ? req.query : req.body
    if (req.session.u_name && req.session.u_pwd) {
        member_db.removeByKeys({ t_id: params.t_id, u_name: params.u_name }, () => {
            if (error) {
                res.send(code[(params.t_id && params.u_name) ? 305 : 202])
            } else {
                res.send(code[100])
            }
        })
    } else {
        res.send(code[304])
    }
})

module.exports = router