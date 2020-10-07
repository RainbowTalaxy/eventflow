const { query } = require('./config')

// 根据用户名称，查找所在的工作组列表
const findUsersTeams = (u_name, callback = console.log) => {
    query(connection => {
        connection.query(
            'select team.t_id, t_name, founder, u_name = founder as isSelf from team, member where team.t_id = member.t_id and member.u_name = ?', 
            u_name, 
            (error, results) => {
                callback(error, results)
            }
        )
    })
}

// 根据用户名称，查找发出邀请的工作组信息
const findUsersInvitation = (u_name, callback = console.log) => {
    query(connection => {
        connection.query(
            'select team.t_id, t_name, founder from team, invitation where team.t_id = invitation.t_id and invitation.u_name = ?',
            u_name,
            (error, results) => {
                callback(error, results)
            }
        )
    })
}

// 根据工作组 ID ，查找组内成员
const findTeamsMembers = (t_id, callback = console.log) => {
    query(connection => {
        connection.query(
            'select u_name from team, member where team.t_id = member.t_id and team.t_id = ?',
            t_id,
            (error, results) => {
                callback(error, results)
            }
        )
    })
}

// 根据工作组 ID 和用户名称，查找组内的事件流程
const findTeamsFlow = (t_id, u_name, callback = console.log) => {
    query(connection => {
        connection.query(
            'select f_id, f_name, completed, current, inqueue, f_type, f_state, ? = current as isSelf, ? = founder as isFounder ' + 
            'from team, flow where team.t_id = flow.t_id and team.t_id = ?',
            [u_name, u_name, t_id],
            (error, results) => {
                callback(error, results)
            }
        )
    })
}

module.exports = {
    findUsersTeams, findUsersInvitation, findTeamsMembers, findTeamsFlow
}

// findOnesTeams('舍暴')

// findUsersInvitation('顾思远')

// findTeamsMembers(1)

// findTeamsFlow(1, '宿霸')
