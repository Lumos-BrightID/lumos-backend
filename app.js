require('dotenv').config();
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
const authRouter = require('./routes/auth')
const checkRouter = require('./routes/check')
const passport = require('passport');
const passportJWT = require('passport-jwt');
const {FindUser} = require("./helper/UserHelper")

// ExtractJwt to help extract the token
let ExtractJwt = passportJWT.ExtractJwt;
// JwtStrategy which is the strategy for the authentication
let JwtStrategy = passportJWT.Strategy;
let jwtOptions = {};
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
jwtOptions.secretOrKey = process.env.JWT_SECRET;


const app = express()

/**
 * @type {JwtStrategy}
 */
let strategy = new JwtStrategy(jwtOptions, function(jwt_payload, next) {
    let user = FindUser({ contextId: jwt_payload.contextId })
    if (user) {
        next(null, user)
    } else {
        next(null, false)
    }
});
// use the strategy
passport.use(strategy)
app.use(passport.initialize())

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({extended: true}))
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
app.use('/api/auth', authRouter)
app.use('/api/check', checkRouter)
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
