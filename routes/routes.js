var express = require('express');
var router = express.Router();

var login = require('../server/js/login');

/* GET home page. */
router.get('/', function (req, res) {
    res.render('layout', { title: 'MERS BattleApp', loginStatus: req.isAuthenticated()});
});

router.get('/login/google', function (req, res, next) {
    return login.google(req, res, next);
});
router.get('/login/google/callback', function (req, res, next) {
    login.googlecb(req, res, next);
});

router.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/');
});

module.exports = router;
