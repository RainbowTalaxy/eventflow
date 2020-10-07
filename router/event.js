var router = new require('express').Router()
const team_db = require('../sql/team')
const member_db = require('../sql/member')
const invitation_db = require('../sql/invitation')
const flow_db = require('../sql/flow')
const other_db = require('../sql/others')
const code = require('./code')
const tool = require('./tool')

router.get('/event/list', (req, res) => {
    let params = (req.query.f_id) ? req.query : req.body
    if (req.session.u_name && req.session.u_pwd) {
        team_db.findById(params.t_id, (error, result) => {
            if (error) {
                res.send(code[params.t_id ? 200 : 202])
            } else if (result.length == 0) {
                res.send(code[309])
            } else {
                other_db.findTeamsFlow(params.t_id, req.session.u_name, (error, result) => {
                    if (error) {
                        res.send(code[params.t_id ? 200 : 202])
                    } else {
                        res.send({
                            status: code[100].status,
                            list: result
                        })
                    }
                })
            }
        })
    } else {
        res.send(code[304])
    }
})

router.post('/event/add', (req, res) => {
    let params = (req.query.t_id && req.query.f_type) ? req.query : req.body
    if (req.session.u_name && req.session.u_pwd) {
        team_db.findById(params.t_id, (error, result) => {
            if (error) {
                res.send(code[params.t_id ? 200 : 202])
            } else if (params.f_type) {
                if (result.length == 0) {
                    res.send(code[309])
                } else if (result[0].founder != req.session.u_name) {
                    res.send(code[312])
                } else {
                    other_db.findTeamsMembers(params.t_id, (error, result) => {
                        let members = result.map(i => i.u_name)
                        let { completed, current, inqueue } = tool.flowNext([], null, members, params.f_type)
                        let flow = {
                            t_id: params.t_id,
                            completed: completed.toString(),
                            current: current,
                            inqueue: inqueue.toString(),
                            f_type: params.f_type,
                            f_state: 1
                        }
                        flow_db.add(flow, (error) => {
                            res.send(code[error ? 200 : 100])
                        })
                    })
                }
            } else {
                res.send(code[202])
            }
        })
    } else {
        res.send(code[304])
    }
})

router.post('/event/delete', (req, res) => {
    let params = (req.query.f_id) ? req.query : req.body
    if (req.session.u_name && req.session.u_pwd) {
        flow_db.findById(params.f_id, (error, result) => {
            if (error) {
                res.send(code[params.f_id ? 200 : 202])
            } else if (result.length == 0) {
                res.send(code[310])
            } else {
                team_db.findById(result[0].t_id, (error, result) => {
                    if (error) {
                        res.send(code[200])
                    } else {
                        if (result.length == 0) {
                            res.send(code[309])
                        } else if (result[0].founder != req.session.u_name) {
                            res.send(code[312])
                        } else {
                            flow_db.removeById(params.f_id, () => {})
                            res.send(code[100])
                        }
                    }
                })
            }
        })
    } else {
        res.send(code[304])
    }
})

router.post('/event/submit', (req, res) => {
    let params = (req.query.f_id) ? req.query : req.body
    if (req.session.u_name && req.session.u_pwd) {
        flow_db.findById(params.f_id, (error, result) => {
            if (error) {
                res.send(code[params.f_id ? 200 : 202])
            } else if (result.length == 0) {
                res.send(code[310])
            } else if (result[0].current != req.session.u_name) {
                res.send(code[311])
            } else {
                let record = result[0]
                record.f_state = 2
                flow_db.change(record, record.f_id, () => { 
                    res.send(code[100])
                })
            }
        })
    } else {
        res.send(code[304])
    }
})

router.post('/event/grant', (req, res) => {
    let params = (req.query.f_id) ? req.query : req.body
    if (req.session.u_name && req.session.u_pwd) {
        flow_db.findById(params.f_id, (error, result) => {
            if (error) {
                res.send(code[200])
            } else if (result.length == 0) {
                res.send(code[310])
            } else {
                team_db.findById(result[0].t_id, (error, teams) => {
                    if (error) {
                        res.send(code[200])
                    } else if (teams[0].founder != req.session.u_name) {
                        res.send(code[312])
                    } else {
                        let record = result[0]
                        console.log(record)
                        let completed = record.completed.split(',').filter(i => (i != params.u_name && i != ''))
                        let inqueue = record.inqueue.split(',').filter(i => (i != params.u_name && i != ''))
                        if (record.f_state == 2) {
                            let result = tool.flowNext(completed, record.current, inqueue, record.f_type)
                            console.log(result)
                            completed = result.completed
                            inqueue = result.inqueue
                            record.current = result.current
                            record.f_state = record.current ? 1 : 3
                        }
                        record.completed = completed.toString()
                        record.inqueue = inqueue.toString()
                        flow_db.change(record, record.f_id, () => { 
                            res.send(code[100])
                         })
                    }
                })
            }
        })
    } else {
        res.send(code[304])
    }
})

module.exports = router