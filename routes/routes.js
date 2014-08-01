var express = require('express');
var router = express.Router();

var login = require('../server/js/login');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('layout', { title: 'MERS BattleApp' });
});

router.get('/login/facebook', function (req, res, next) {
    return login.facebook(req, res, next);
});
router.get('/login/facebook/callback', function (req, res, next) {
    login.facebookcb(req, res, next);
});

module.exports = router;
