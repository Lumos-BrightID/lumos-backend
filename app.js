const createError = require('http-errors')
const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const rateLimit = require("express-rate-limit");
const indexRouter = require('./routes/index')
const usersRouter = require('./routes/users')
const verifyRouter = require('./routes/verify')
const pollsRouter = require('./routes/polls')


const app = express()

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({extended: false}))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 40 // limit each IP to 100 requests per windowMs
})

app.use('/api/', limiter)

app.use('/', indexRouter)
app.use('/api/login', verifyRouter)
app.use('/api/user', usersRouter)
app.use('/api/poll', pollsRouter)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404))
})
// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message
    res.locals.error = req.app.get('env') === 'development' ? err : {}

    // render the error page
    res.status(err.status || 500)
    res.render('error')
})

module.exports = app
