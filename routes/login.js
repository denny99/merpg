var express = require('express');
var router = express.Router();

var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;

var FACEBOOK_APP_ID = "1407742842797793";
var FACEBOOK_APP_SECRET = "aa868858e4d8b661710c8029e25b5f86";

var settings = require('../server/settings/settings');
var users = settings.getDB("users");

// facebook Strategie
passport.use(new FacebookStrategy({
        clientID: FACEBOOK_APP_ID,
        clientSecret: FACEBOOK_APP_SECRET,
        callbackURL: "http://127.0.0.1:3000/login/facebook/callback"
    },
    function (accessToken, refreshToken, profile, done) {
        process.nextTick(function () {
            // To keep the example simple, the user's Facebook profile is returned to
            // represent the logged-in user.  In a typical application, you would want
            // to associate the Facebook account with a user record in your database,
            // and return that user instead.
            return done(null, profile);
        });

    }
));


var facebook = passport.authenticate('facebook', {scope: 'email'});

var facebookcb = passport.authenticate('facebook', {successRedirect: '/', failureRedirect: '/' });

router.get('/login/facebook', function (req, res, next) {
    return facebook(req, res, next);
});
router.get('/login/facebook/callback', function (req, res, next) {
    facebookcb(req, res, next);
});

module.exports = router;