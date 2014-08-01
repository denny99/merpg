/**
 * Created by Denny on 01.08.2014.
 */

exports.isAuthenticated = function (req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.status(401).end();
};