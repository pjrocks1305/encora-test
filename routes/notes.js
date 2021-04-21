const passport = require('passport');
const express = require('express');
const jwt = require('jwt-simple');
const router = express.Router();
const service = require('../service');
const notesDetailsModel = require('../models/NotesDetails');
const errCode = require('../error-code.json');
const tokenRetrive = require('../helper/get-token');
const configVar = require('../config/config.json');


require('../middlewares/passport')(passport);

// get user notes
router.get('/',  async function(req, res, next) {
  const data = await service.fetchAllObject(req.query, notesDetailsModel.NotesDetail);
  if(data.success === false){
    next({status: 500, message: errCode.ERROR_INTERNAL_SERVER_ERROR, error : data.err})
  }else {
    res.status(200).json({success: true, data : data.data})
  }
  
//   function (err, data) {
//     if(err){
//      
//     } else{
//       res.status(200).json({success: true, data : data})
//     }
//   });
});


// get notes by user id
router.get('/:user_id', passport.authenticate('jwt', {session: false}), function(req, res, next) {
    const token = tokenRetrive.getToken(req.headers);
    const decoded = jwt.decode(token, configVar.secretOrKey);
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
    const token = tokenRetrive.getToken(req.headers);
    const decoded = jwt.decode(token, configVar.secretOrKey);
    const obj = {
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