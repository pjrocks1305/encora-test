const service = require('../service');
const bcrypt = require("bcrypt");
const errCode = require('../error-code.json');
const authModel = require('../models/AuthModel');
const jwt = require("jsonwebtoken");
const configVar = require("../config/config.json");


const signup = async(req) => {
    try{
        const data = await service.findByObject({ email: req.body.email }, authModel.User);
        if(data){
            return {success: false, status: 400, message: errCode.ERROR_BAD_REQUEST, error: "A user with email ID already exists"};
        }
        const obj = {
            name: req.body.name,
            email: req.body.email,
            password: req.body.password
        };
        const  userData = await service.postSingleRow(obj, authModel.User);
                const usr = userData;
                delete usr.password;
                const token = jwt.sign(usr, configVar.secretOrKey);
                return {success: true, token: `JWT ${token}`} 

    } catch (err){
        console.log(err);
        throw err;
    }
}

const login = async(req) => {
    try{
        const user = await service.findByObject({email: req.body.email}, authModel.User);
        console.log(user);
        if(!user){
           return  {success: false, status: 400, message: errCode.ERROR_BAD_REQUEST, error: "This email id does not exist in our system"}
        }
        const compPassword = await bcrypt.compare(req.body.password, user.password );
        if(compPassword){
            const token = jwt.sign(user, configVar.secretOrKey);
            return {success: true, token: `JWT ${token}`} 
        } else {
            return {success: false, status: 400, message: errCode.ERROR_BAD_REQUEST, error: "Your password is not correct"};
        }
        

    } catch(err){
        throw err;
    }
}

module.exports =  {
    signup : signup,
    login : login
};