const code = {
    100: {
        status: {
            code: 100,
            message: 'success'
        }
    },
    200: {
        status: {
            code: 200,
            message: 'database error'
        }
    },
    201: {
        status: {
            code: 201,
            message: 'session expired'
        }
    },
    202: {
        status: {
            code: 202,
            message: 'lack of params'
        }
    },
    300: {
        status: {
            code: 300,
            message: 'account does not exist'
        }
    },
    301: {
        status: {
            code: 301,
            message: 'wrong password'
        }
    },
    302: {
        status: {
            code: 302,
            message: 'account exists or database error'
        }
    },
    303: {
        status: {
            code: 303,
            message: 'account not exist or other database error'
        }
    },
    304: {
        status: {
            code: 304,
            message = 'please sign in before logout'
        }
    },
    305: {
        status: {
            code:305,
            message: 'member does not exist or other database error'
        }
    }
}

module.exports = code