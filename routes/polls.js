const {validationResult} = require('express-validator');
const {check,checkSchema} = require("express-validator")
const express = require('express');
const router = express.Router();
const db = require('../models/index')

/**
 * middleware that validate request body
 */
router.use([
    checkSchema({
       type:{
           in: ['body'],
           matches: {
               options: [/\b(?:telegram|twitter|instagram|phone|email|facebook|erc20Address)\b/],
               errorMessage: "Invalid type"
           }
       }
    }),
    check('data').isArray(),
    check('data.*').isString(),
],function(req, res,next){
    // Finds the validation errors in this request and wraps them in an object with handy functions
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }
    next()
})

/**
 * return a list of verified and unverified users
 */
router.post('/',  async function (req, res) {
    const {type, data} = req.body
    let list = []
    for (const username of data) {
        let user = await db.user.findOne({
            where: {
                [type]:username
            }
        })
        user ? list.push({ user: username,verified:1 }) : list.push({ user: username,verified:0 })
    }
    res.json({
        data: list
    })
})

module.exports = router