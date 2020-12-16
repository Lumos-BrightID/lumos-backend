const express = require('express');
const router = express.Router();
const db = require('../models/index')
const passport = require("passport")
const {checkSchema, validationResult} = require('express-validator');

// simple middleware for checking requested body
router.use(checkSchema({
    username: {
        options: {
            min: 3,
            max: 40
        }
    },
    type: {
        in: ['body'],
        matches: {
            options: [/\b(?:telegram|twitter|instagram|phone|email|facebook|erc20Address)\b/],
            errorMessage: "Invalid type"
        }
    }
}),passport.authenticate('jwt', { session: false }), (req, res, next) => {
    // Finds the validation errors in this request and wraps them in an object with handy functions
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }
    next()
})



router.post('/profile', async function (req, res,next){
    const {username, type} = req.body
    const user = await req.user
    if (!user){
        res.status(404).json({
            'message': 'unauthorized'
        })
    }
    // update authenticated user
    try {
        const updatedUser = db.user.update({
            [type]: username
        },{
            where: { id: user.dataValues.id }
        })
        res.status(200).json({
            'message': 'user updated'
        })
    }catch(err){
        res.status(500).json({
            'message': 'Internal server error'
        })
    }
})


module.exports = router