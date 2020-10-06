const code = {
    100: {
        status: {
            code: 100,
            message: '成功'
        }
    },
    200: {
        status: {
            code: 200,
            message: '数据库错误'
        }
    },
    201: {
        status: {
            code: 201,
            message: 'session 过期'
        }
    },
    202: {
        status: {
            code: 202,
            message: '缺少参数'
        }
    },
    300: {
        status: {
            code: 300,
            message: '账户不存在'
        }
    },
    301: {
        status: {
            code: 301,
            message: '密码错误'
        }
    },
    302: {
        status: {
            code: 302,
            message: '账户存在或者其他错误'
        }
    },
    303: {
        status: {
            code: 303,
            message: '账户不存在或者其他错误'
        }
    },
    304: {
        status: {
            code: 304,
            message: '请先登录'
        }
    },
    305: {
        status: {
            code:305,
            message: '成员不存在或者其他错误'
        }
    },
    306: {
        status: {
            code: 306,
            message: '已经是该团队的一个成员'
        }
    },
    307: {
        status: {
            code: 307,
            message: '邀请不存在或者其他错误'
        }
    },
    308: {
        status: {
            code: 308,
            message: '组长不可退出工作组'
        }
    },
    309: {
        status: {
            code: 309,
            message: '工作组不存在'
        }
    },
    310: {
        status: {
            code: 310,
            message: '事件流程不存在'
        }
    },
    311: {
        status: {
            code: 311,
            message: '当前事件流程的轮次不是自己'
        }
    },
    312: {
        status: {
            code: 312,
            message: '非组长人员无法操作'
        }
    }
}

module.exports = code