const {check} = require("express-validator")
const express = require('express');
const router = express.Router();
const db = require('../models/index')


router.post('/', [
    check('data').isArray(),
    check('data.*').isString()
], async function (req, res) {
    const data = req.body.data
    res.json({
        data
    })
})

module.exports = router