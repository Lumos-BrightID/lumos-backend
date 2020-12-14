const express = require('express');
const router = express.Router();

// simple middleware for checking requested body
// router.use(function timeLog(req, res, next) {
//     if (req.body.social == null) {
//         res.status(406).json({
//             status: 'not acceptable',
//             message: 'social is required'
//         })
//     }
//     next()
// })


// router.post('/profile', function (req, res, next) {
//     const token = req.cookies.login
//     // check brightid and uniqness of the contextId
// })

router.get('/check', function (req, res) {
    const {username, type} = req.body

})


module.exports = router;
