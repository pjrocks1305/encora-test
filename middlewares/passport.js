var Service = require('../service');
var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;
var authModel = require('../models/AuthModel');
var configVar = require('../config/config.json');
var errCode = require('../error-code.json');

module.exports = function(passport) {
    var opts = {};
    opts.secretOrKey = configVar.secretOrKey ;
    opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme('JWT');
    passport.use(new JwtStrategy(opts, function(jwt_payload, next) {
        Service.findByObject({id: jwt_payload.id}, authModel.User, function (err, data) {
            if (err) {
                return next({status: 500, message: errCode.ERROR_INTERNAL_SERVER_ERROR, error: err});
            }
            if (data) {
                next(null, data);
            } else {
                next(null, false);
            }
        });
    }));

    passport.serializeUser(function(user, next) {
        next(null, user);
    });

    passport.deserializeUser(function(user, next) {
        next(null, user);
    });
};