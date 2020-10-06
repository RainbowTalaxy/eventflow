var express = require('express')
var bodyParser = require("body-parser");
var session = require('express-session')

var app = express()

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

app.listen(3000, () => {
    console.log('listening on port 3000...')
})