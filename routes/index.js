var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {title: 'Lumos'});
});


router.get('/services', function (req, res, next) {
    res.render('service', {title: 'Lumos services'});
});

router.get('/about', function (req, res, next) {
    res.redirect('https://yazdaaniam.medium.com/lumos-e221313141df')
});

router.get('/guideline', function (req, res, next) {
    res.redirect('https://yazdaaniam.medium.com/how-to-use-lumos-5808bb35bf23')
});


router.get('/api-document', function (req, res, next) {
    res.redirect('https://lumos.stoplight.io/docs/lumos/reference/poll.v1.json/paths/poll/post')
});

module.exports = router;
