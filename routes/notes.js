const passport = require('passport');
const express = require('express');
const router = express.Router();
const service = require('../service');
const notesDetailsModel = require('../models/NotesDetails');
const errCode = require('../error-code.json');
const tokenRetrive = require('../middlewares/get-token');


require('../middlewares/passport')(passport);

// get user notes
 router.get('/',  passport.authenticate('jwt', {session: false}), async function(req, res, next) {
    try{
        const data = await service.fetchAllObject(req.query, notesDetailsModel.NotesDetail);
        res.status(200).json({success: true, data : data})
    }
    catch(err){
        next({status: 500, message: errCode.ERROR_INTERNAL_SERVER_ERROR, error : err})
    }
});


// get notes by user id
router.get('/:user_id', passport.authenticate('jwt', {session: false}),tokenRetrive.check(), async function(req, res, next) {
    console.log(req.params, req.query)
    if(req.user.id == req.params.user_id){
        try{
            const data = await service.findUserNotes(req, notesDetailsModel.NotesDetail);
            res.status(200).json({success: true, data : data})
        }
        catch(err){
            next({status: 500, message: errCode.ERROR_INTERNAL_SERVER_ERROR, error : err})
        }
    }
    else {
        return next({status: 400, message: errCode.ERROR_BAD_REQUEST, error: "The error is caused due to incorrect user id"});
    }

});

// post notes for user
router.post('/', passport.authenticate('jwt', {session: false}), tokenRetrive.check(), async function(req, res, next) {
    const obj = {
        user_id: req.user.id,
        description: req.body.description
    }
    try{
        const data = await service.postSingleRow(obj, notesDetailsModel.NotesDetail);
        res.status(200).json({success: true, data : 'data uploaded successfully'})
    } catch(err){
        next({status: 500, message: errCode.ERROR_INTERNAL_SERVER_ERROR, error : err})
    }
});

//update note by id
router.put('/:id', passport.authenticate('jwt', {session: false}), async function(req, res, next) {
    try {
        const data = await service.updateByObjectId({id: req.params.id, ...req.body}, notesDetailsModel.NotesDetail);
        res.status(200).json({success: true, data : 'data updated successfully'})
    } catch(err){
        next({status: 500, message: errCode.ERROR_INTERNAL_SERVER_ERROR, error : err})
    }
});

//delete note by id
router.delete('/:id', passport.authenticate('jwt', {session: false}), async function(req, res, next) {
    try{
        const data = await service.deleteByObjectId(req.params.id, notesDetailsModel.NotesDetail);
        res.status(200).json({success: true, data : 'data deleted successfully'})
    } catch(err){
        next({status: 500, message: errCode.ERROR_INTERNAL_SERVER_ERROR, error : err})

    }
});

module.exports = router;