var jwt = require('jwt-simple');
const configVar = require('../config/config.json');

module.exports = {
    check: function () {
        return function (req, res, next) {
            if (req.headers && req.headers.authorization) {
                const parted = req.headers.authorization.split(' ');
                if (parted.length === 2) {
                    const token =  parted[1];
                    const  decoded = jwt.decode(token, configVar.secretOrKey);
                    req.user = decoded;
                    next(null);
                } else {
                    next(null);
                }
            } else {
               next(null);
            }
        }
    }
};
