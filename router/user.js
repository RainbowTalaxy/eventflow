var router = new require('express').Router()
const account_db = require('../sql/account')
const team_db = require('../sql/team')
const member_db = require('../sql/member')
const invitation_db = require('../sql/invitation')
const flow_db = require('../sql/flow')
const other_db = require('../sql/others')
const code = require('./code')
const tool = require('./tool')

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
            res.send(code[params.u_name ? 302 : 202])
        } else {
            res.send(code[100])
        }
    })
})

// 待完善
// 删除自己的团队（/team/delete）
// 退出包含自己的团队
router.get('/user/logout', (req, res) => {
    if (req.session.u_name && req.session.u_pwd) {
        account_db.removeByName(req.session.u_name, (error, result) => {
            if (error) {
                res.send(code[303])
            } else {
                let u_name = req.session.u_name
                req.session.u_name = null
                req.session.u_pwd = null
                res.send(code[100])
                member_db.findByName(u_name, (error, result) => {
                    for (let member of result) {
                        flow_db.findByTeam(member.t_id, (error, result) => {
                            for (let record of result) {
                                let completed = record.completed.split(',').filter(i => (i != u_name && i != ''))
                                let inqueue = record.inqueue.split(',').filter(i => (i != u_name && i != ''))
                                if (record.current == u_name) {
                                    let result = tool.flowNext(completed, record.current, inqueue, record.f_type, false)
                                    completed = result.completed
                                    inqueue = result.inqueue
                                    record.current = result.current
                                    record.f_state = record.current ? 1 : 3
                                }
                                record.completed = completed.toString()
                                record.inqueue = inqueue.toString()
                                flow_db.change(record, record.f_id, () => {})
                            }
                        })
                    }
                    member_db.removeByName(u_name, () => {
                        team_db.findByName(u_name, (error, result) => {
                            for (let team of result) {
                                team_db.removeById(team.t_id, () => {})
                                invitation_db.removeByTeam(team.t_id, () => {})
                                flow_db.removeByTeam(team.t_id, () => {})
                                team_db.removeById(team.t_id, () => {})
                            }
                        })
                    })
                })
            }
        })
    } else {
        res.send(code[304])
    }
})

module.exports = router