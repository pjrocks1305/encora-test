var passport = require('passport');
var express = require('express');
var jwt = require('jwt-simple');
var router = express.Router();
var service = require('../service');
var notesDetailsModel = require('../models/NotesDetails');
var errCode = require('../error-code.json');
var tokenRetrive = require('../helper/get-token');
var configVar = require('../config/config.json');


require('../middlewares/passport')(passport);

// get user notes
router.get('/', passport.authenticate('jwt', {session: false}), function(req, res, next) {
  service.fetchAllObject(req.query, notesDetailsModel.NotesDetail, function (err, data) {
    if(err){
      next({status: 500, message: errCode.ERROR_INTERNAL_SERVER_ERROR, error : err})
    } else{
      res.status(200).json({success: true, data : data})
    }
  });
});


// get notes by user id
router.get('/:user_id', passport.authenticate('jwt', {session: false}), function(req, res, next) {
    var token = tokenRetrive.getToken(req.headers);
    var decoded = jwt.decode(token, configVar.secretOrKey);
    if(decoded.id == req.params.user_id){
        service.fetchAllObject({user_id: req.params.user_id}, notesDetailsModel.NotesDetail, function (err, data) {
            if(err){
                next({status: 500, message: errCode.ERROR_INTERNAL_SERVER_ERROR, error : err})
            } else{
                res.status(200).json({success: true, data : data})
            }
        });
    }
    else {
        return next({status: 400, message: errCode.ERROR_BAD_REQUEST, error: "The error is caused due to incorrect user id"});
    }

});

// post notes for user
router.post('/', passport.authenticate('jwt', {session: false}), function(req, res, next) {
    var token = tokenRetrive.getToken(req.headers);
    var decoded = jwt.decode(token, configVar.secretOrKey);
    var obj = {
        user_id: decoded.id,
        description: req.body.description
    }
    service.postSingleRow(obj, notesDetailsModel.NotesDetail, function (err, data) {
        if(err){
            next({status: 500, message: errCode.ERROR_INTERNAL_SERVER_ERROR, error : err})
        } else{
            res.status(200).json({success: true, data : 'data uploaded successfully'})
        }
    });
});

//update note by id
router.put('/:id', passport.authenticate('jwt', {session: false}), function(req, res, next) {
    service.updateByObjectId({id: req.params.id, ...req.body}, notesDetailsModel.NotesDetail, function (err, data) {
        if(err){
            next({status: 500, message: errCode.ERROR_INTERNAL_SERVER_ERROR, error : err})
        } else{
            res.status(200).json({success: true, data : 'data updated successfully'})
        }
    });
});

//delete note by id
router.delete('/:id', passport.authenticate('jwt', {session: false}), function(req, res, next) {
    service.deleteByObjectId(req.params.id, notesDetailsModel.NotesDetail, function (err, data) {
        if(err){
            next({status: 500, message: errCode.ERROR_INTERNAL_SERVER_ERROR, error : err})
        } else{
            res.status(200).json({success: true, data : 'data deleted successfully'})
        }
    });
});



module.exports = router;