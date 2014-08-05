var passport = require('passport');

var settings = require('../settings/settings');
var users = settings.getDB("users");

var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

passport.use(new GoogleStrategy({
        clientID: "335800780801-v5o7ahbg84ulgepb6ev3822l945bsjsj.apps.googleusercontent.com",
        clientSecret: "XhZhfUp-E2kE_6HBvj7s5o43",
        callbackURL: "http://merpg.herokuapp.com/login/google/callback"
        //callbackURL: "http://127.0.0.1:3000/login/google/callback"
    },
    function (accessToken, refreshToken, profile, done) {
        return done(null, profile);
    }
));


exports.google = passport.authenticate('google', {scope: 'email'});

exports.googlecb = passport.authenticate('google', {successRedirect: '/', failureRedirect: '/' });

//*** settings for passport module ***
passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (obj, done) {
    done(null, obj);
});

exports.passport = passport;