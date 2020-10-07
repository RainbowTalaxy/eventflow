var express = require('express')
var bodyParser = require("body-parser");
var session = require('express-session')

var app = express()
var port = 8112

app.all("*", function (req, res, next) {
    res.header("Access-Control-Allow-Origin", req.get('origin'))
    res.header("Access-Control-Max-Age", "80000")
    res.header("Access-Control-Allow-Credentials", true)
    res.header("Access-Control-Allow-Headers", "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With")
    res.header("Access-Control-Allow-Methods", "DELETE,PUT,POST,GET,OPTIONS")
    next()
})

app.use(bodyParser.urlencoded({ 
    extended: false 
}))

app.use(session({
    secret: '3013',
    cookie: {
        maxAge: 60000
    }
}))

app.get('/hello', (req, res) => {
    res.send('Hello World!')
})

app.use(require('./router/user'))

app.use(require('./router/team'))

app.use(require('./router/invite'))

app.use(require('./router/event'))

app.listen(port, () => {
    console.log('listening on port ' + port + '...')
})