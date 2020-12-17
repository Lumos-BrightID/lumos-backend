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



router.put('/profile', async function (req, res,next){
    const {username, type} = req.body
    const user = await req.user
    if (!user){
        res.status(404).json({
            'message': 'unauthorized'
        })
    }
    // update authenticated user
    try {
        const updatedUser = await db.user.update({
            [type]: username
        },{
            where: { id: user.dataValues.id }
        })
        res.status(200).json({
            'code': 'UPDATED',
            'message': 'user updated'
        })
    }catch(err){
        if(err.errors[0].validatorKey === 'not_unique'){
            res.status(409).json({
                'code': 'NOTUNIQE',
                'message': 'username on this social media already verified'
            })
            return
        }
        res.status(500).json({
            'message': err
        })
    }
})


module.exports = router