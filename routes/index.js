var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {title: 'Lumos'});
});


router.get('/services', function (req, res, next) {
    res.render('index', {title: 'Lumos'});
});

router.get('/about', function (req, res, next) {
    res.render('index', {title: 'Lumos'});
});

router.get('/guideline', function (req, res, next) {
    res.render('index', {title: 'Lumos'});
});


router.get('/api-document', function (req, res, next) {
    res.render('index', {title: 'Lumos'});
});

module.exports = router;
