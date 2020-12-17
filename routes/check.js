const express = require('express');
const router = express.Router();
const passport = require("passport")

router.use(passport.authenticate('jwt', { session: false }), (req, res, next) => {
    // Finds the validation errors in this request and wraps them in an object with handy functions
    next()
})


router.post('/',async function(req, res, next){
    const user = await req.user
    if (!user){
        res.status(404).json({
            'code': 'UNAUTH',
            'message': 'unauthorized'
        })
    }
    res.status(200).json({
        'code': 'AUTH',
        'message' : 'logged in'
    })
})


module.exports = router