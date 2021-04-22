var Bookshelf = require('./config/db').bookshelf;

const findByObject = async (queryObject, collection) => {
    try {
        const data = await collection
        .forge(queryObject)
        .fetch()
        return data ? data.toJSON() : null;
    } catch(err){
                throw err;

    }
};

const postSingleRow = async(obj, collection) => {
    console.log(obj);
    try{
        const data = await collection
        .forge(obj)
        .save()
        return obj;
    } catch(err){
        throw err;
    }
    
        
};
const fetchAllObject = async (queryObject, collection) => {
    try{
        const data = await collection
        .where(queryObject)
        .fetchAll();
        return data.toJSON();
    } catch(err){
        throw err;
    }
};


const updateByObjectId = async (updateObject, collection) => {
    try {
        const data = await collection
        .forge({ id: updateObject.id })
        .fetch({ require: true })
    await data.save(updateObject)
    return data.toJSON();
    } catch(err){
        throw err;
    }
};

const deleteByObjectId = async (deleteId, collection) => {
    try {
        const data = await collection
        .forge({ id: deleteId })
        .fetch({ require: true })
    await data.destroy();
    return data.toJSON();
    } catch(err){
        throw err;
    }
};

const findUserNotes = async(req) => {
    try {
        if(req.query.page && req.query.limit){
            const offset = (req.query.page -1) * req.query.limit;
            var data = await Bookshelf.knex
            .select('*')
            .from('notes')
            .where('user_id', req.params.user_id)
            .limit(req.query.limit)
            .offset(offset);
        } else {
            var data = await Bookshelf.knex
            .select('*')
            .from('notes')
            .where('user_id', req.params.user_id) 
        }
        
        return data;
    }catch(err){
        throw err;
    }
}
module.exports =  {
    postSingleRow : postSingleRow,
    fetchAllObject: fetchAllObject,
    updateByObjectId: updateByObjectId,
    deleteByObjectId: deleteByObjectId,
    findByObject: findByObject,
    findUserNotes: findUserNotes
};