var router = new require('express').Router()
const team_db = require('../sql/team')
const member_db = require('../sql/member')
const invitation_db = require('../sql/invitation')
const flow_db = require('../sql/flow')
const other_db = require('../sql/others')
const code = require('./code')
const tool = require('./tool')

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
                res.send({
                    status: code[100].status,
                    list: result
                })
            }
        })
    } else {
        res.send(code[304])
    }
})

router.post('/team/edit', (req, res) => {
    let params = (req.query.t_id && req.query.t_name) ? req.query : req.body
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
                    team_db.change({ t_name: params.t_name }, params.t_id, (error) => {
                        if (error) {
                            res.send(code[(params.t_id && params.t_name) ? 200 : 202])
                        } else {
                            res.send(code[100])
                        }
                    })
                }
            }
        })
    } else {
        res.send(code[304])
    }
})

router.post('/team/delete', (req, res) => {
    let params = (req.query.t_id) ? req.query : req.body
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
                    team_db.removeById(params.t_id, (error) => {
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
                }
            }
        })
    } else {
        res.send(code[304])
    }
})

// todo
router.post('/team/member/delete', (req, res) => {
    let params = (req.query.t_id && req.query.u_name) ? req.query : req.body
    if (req.session.u_name && req.session.u_pwd) {
        if (params.u_name == req.session.u_name) {
            res.send(code[308])
        } else {
            team_db.findById(params.t_id, (error, result) => {
                if (error) {
                    res.send(code[200])
                } else {
                    if (result.length == 0) {
                        res.send(code[309])
                    } else if (result[0].founder != req.session.u_name) {
                        res.send(code[312])
                    } else {
                        member_db.removeByKeys(params.u_name, params.t_id, (error) => {
                            if (error) {
                                res.send(code[params.t_id ? 305 : 202])
                            } else {
                                flow_db.findByTeam(params.t_id, (error, result) => {
                                    for (let record of result) {
                                        let completed = record.completed.split(',').filter(i => (i != params.u_name && i != ''))
                                        let inqueue = record.inqueue.split(',').filter(i => (i != params.u_name && i != ''))
                                        if (record.current == params.u_name) {
                                            let result = tool.flowNext(completed, record.current, inqueue, record.f_type, false)
                                            completed = result.completed
                                            inqueue = result.inqueue
                                            record.current = result.current
                                            record.f_state = record.current ? 1 : 3
                                        }
                                        record.completed = completed.toString()
                                        record.inqueue = inqueue.toString()
                                        flow_db.change(record, record.f_id, () => { })
                                    }
                                    res.send(code[100])
                                })
                            }
                        })
                    }
                }
            })
        }
    } else {
        res.send(code[304])
    }
})

// todo
router.post('/team/quit', (req, res) => {
    let params = (req.query.t_id) ? req.query : req.body
    if (req.session.u_name && req.session.u_pwd) {
        team_db.findById(params.t_id, (error, result) => {
            if (error) {
                res.send(code[200])
            } else {
                if (result.length == 0) {
                    res.send(code[309])
                } else if (result[0].founder == req.session.u_name) {
                    res.send(code[308])
                } else {
                    member_db.removeByKeys(req.session.u_name, params.t_id, (error) => {
                        if (error) {
                            res.send(code[params.t_id ? 305 : 202])
                        } else {
                            flow_db.findByTeam(params.t_id, (error, result) => {
                                for (let record of result) {
                                    let completed = record.completed.split(',').filter(i => (i != req.session.u_name && i != ''))
                                    let inqueue = record.inqueue.split(',').filter(i => (i != req.session.u_name && i != ''))
                                    if (record.current == req.session.u_name) {
                                        let result = tool.flowNext(completed, record.current, inqueue, record.f_type, false)
                                        completed = result.completed
                                        inqueue = result.inqueue
                                        record.current = result.current
                                        record.f_state = record.current ? 1 : 3
                                    }
                                    record.completed = completed.toString()
                                    record.inqueue = inqueue.toString()
                                    flow_db.change(record, record.f_id, () => { })
                                }
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

router.get('/team/member/list', (req, res) => {
    let params = (req.query.t_id) ? req.query : req.body
    if (req.session.u_name && req.session.u_pwd) {
        other_db.findTeamsMembers(params.t_id, (error, result) => {
            if (error) {
                res.send(code[params.t_id ? 200 : 202])
            } else {
                res.send({
                    status: code[100].status,
                    list: result
                })
            }
        })
    } else {
        res.send(code[304])
    }
})

module.exports = router