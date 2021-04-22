const express = require('express');
const router = express.Router();
const errCode = require('../error-code.json');
const authController = require("../controller/authController");


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
router.post('/signup', async (req, res, next) => {
    if(req.body.name && req.body.email && req.body.password){
        try{
            const data = await authController.signup(req);
            if(data.success === false){
                return next(data);
            } else{
                res.status(201).json({
                    success: true,
                    message: 'User registered successfully',
                    data: data.token
                });
            }
        } catch(err){
            next({status: 500, message: errCode.ERROR_INTERNAL_SERVER_ERROR, error : err})
        }
    } else {
        return next({status : 400, message: errCode.ERROR_BAD_REQUEST, error: "The error is caused due to some invalid input value"})
    }
});

router.post('/login', async (req, res, next) => {
    if(req.body.email && req.body.password){
        const data = await authController.login(req);
        if(data.success === false){
            return next(data);
        } else{
            res.status(200).json({
                success: true,
                message: 'User Logged in successfully',
                data: data.token,
            });
        }
    } else {
        return next({status: 400, message: errCode.ERROR_BAD_REQUEST, error: "The error is caused due to some invalid input value"});
    }

});

module.exports = router;