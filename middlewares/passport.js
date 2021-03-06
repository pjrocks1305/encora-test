const Service = require('../service');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const authModel = require('../models/AuthModel');
const configVar = require('../config/config.json');
const errCode = require('../error-code.json');

module.exports =  function(passport) {
    const opts = {};
    opts.secretOrKey = configVar.secretOrKey ;
    opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme('JWT');
    passport.use(new JwtStrategy(opts, async function(jwt_payload, next) {
        try{
            const data =  await Service.findByObject({id: jwt_payload.id}, authModel.User);
            if (data) {
                next(null, data);
            } else {
                next(null, false);
            }
        } catch(err){
            return next({status: 500, message: errCode.ERROR_INTERNAL_SERVER_ERROR, error: err});

        }
    }));

    passport.serializeUser(function(user, next) {
        next(null, user);
    });

    passport.deserializeUser(function(user, next) {
        next(null, user);
    });
};