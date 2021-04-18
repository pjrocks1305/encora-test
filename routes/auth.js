var express = require('express');
var router = express.Router();
var service = require('../service');
var authModel = require('../models/AuthModel');
var jwt = require("jsonwebtoken");
var async = require("async");
var bcrypt = require("bcrypt");
var errCode = require('../error-code.json');
var configVar = require("../config/config.json");


/**
 * @swagger
 * /auth/signup:
 *   post:
 *     tags:
 *       - Authentication & Password
 *     description: user signup api
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: body
 *         name: User details
 *         description: User registration
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             name:
 *               type: string
 *             email:
 *               type: string
 *             password:
 *               type: string
 *     responses:
 *       200:
 *         description: Redirecting to the dashboard
 *         schema:
 *         type: object
 *         properties:
 *             success:
 *               type: boolean
 *             message:
 *               type: String
 *             data:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *
 *       400:
 *         description: Invalid Input
 *         schema:
 *         type: object
 *         properties:
 *             success:
 *               type: boolean
 *             message:
 *               type: object
 *               properties:
 *                  code:
 *                    type: string
 *                  title:
 *                    type: string
 *                  detail:
 *                    type: string
 *             error:
 *               type: string
 *             detail:
 *               type: string
 *
 */
router.post('/signup', (req, res, next) => {
    if(req.body.name && req.body.email && req.body.password){
        const tasks = [
            (callback) => {
                service.findByObject({ email: req.body.email }, authModel.User, (err, user) => {
                    if (err) {
                        return callback({status: 500, message : errCode.ERROR_INTERNAL_SERVER_ERROR, error: "Internal server error"}, null);
                    } else if (user) {
                        return callback({status: 400, message: errCode.ERROR_BAD_REQUEST, error: "A user with email ID already exists"}, null);
                    } else {
                        return callback(null, null);
                    }
                });
            },
            (callback) => {
                const obj = {
                    name: req.body.name,
                    email: req.body.email,
                    password: req.body.password
                };
                service.postSingleRow(obj, authModel.User, (err, userData) => {
                    if (err) {
                        return callback({status: 500, message : errCode.ERROR_INTERNAL_SERVER_ERROR, error: "Internal server error"}, null);
                    } else {
                        const usr = userData.toJSON();
                        delete usr.password;
                        const token = jwt.sign(usr, configVar.secretOrKey);
                        return callback(null, { token: `JWT ${token}` });
                    }
                });
            },
        ];
        async.series(tasks, (err, results) => {
            if (err) {
                return next({status: err.status, message: err.message, error: err.error})
            } else {
                res.status(201).json({
                    success: true,
                    message: 'User registered successfully',
                    data: results[1],
                });
            }
        });
    } else {
        return next({status : 400, message: errCode.ERROR_BAD_REQUEST, error: "The error is caused due to some invalid input value"})
    }
});

router.post('/login', (req, res, next) => {
    if(req.body.email && req.body.password){
        const tasks = [
            (callback) => {
                service.findByObject({email: req.body.email}, authModel.User, (err, user) => {
                    if (err) {
                        return callback({status: 500, message : errCode.ERROR_INTERNAL_SERVER_ERROR, error: "Internal server error"}, null);
                    } else if (!user) {
                        return callback({status: 400, message: errCode.ERROR_BAD_REQUEST, error: "This email id does not exist in our system"}, null)
                    } else {
                        return callback(null, user);
                    }
                });
            },
            (user, callback) => {
                bcrypt.compare(req.body.password, user.get('password'), (error, isMatch) => {
                    if (isMatch && !error) {
                        const token = jwt.sign(user.toJSON(), configVar.secretOrKey);
                        return callback(null, { success: true, token: `JWT ${token}` });
                    } else {
                        return callback({status: 400, message: errCode.ERROR_BAD_REQUEST, error: "Your password is not correct"}, null);
                    }
                });
            }
        ];
        async.waterfall(tasks, (err, results) => {
            if (err) {
                return next({status: err.status, message: err.message, error: err.error});
            } else {
                res.status(200).json({
                    success: true,
                    message: 'User Logged in successfully',
                    data: results,
                });
            }
        });
    } else {
        return next({status: 400, message: errCode.ERROR_BAD_REQUEST, error: "The error is caused due to some invalid input value"});
    }

});

module.exports = router;