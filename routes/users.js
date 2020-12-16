const express = require('express');
const router = express.Router();
const db = require('../models/index')
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
}), (req, res, next) => {
    // Finds the validation errors in this request and wraps them in an object with handy functions
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }
    next()
})


/**
 * check the user profile on the social media
 */
router.get('/check', async function (req, res) {
    const {username, type} = req.body
    try {
        const exists = await db.user.findOne({
            where: {
                [type]: username
            },
        })
        // check the query result
        if (!exists) {
            res.status(404).json({
                'message': 'user not found or not verified yet!'
            })
        } else {
            res.status(200).json({
                'message': 'user is verified'
            })
        }
    } catch (error) {
        console.log(error)
    }
})


module.exports = router;
