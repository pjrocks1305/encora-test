const findByObject = (queryObject, collection, callback) => {
    collection
        .forge(queryObject)
        .fetch()
        .then(data => callback(null, data))
        .catch(err => callback(err, null));
};

const postMultipleRow = (objArray, collection, callback) => {
    collection
        .forge(objArray)
        .invokeThen('save')
        .then(function (data) {
            callback(null, data)
        })
        .catch(function (err){
            callback(err, null);
        })
};

const postSingleRow = (obj, collection, callback) => {
    collection
        .forge(obj)
        .save()
        .then(data => callback(null, data))
        .catch(err => callback(err, null));
};
const fetchAllObject = (queryObject, collection, callback) => {
    collection
        .where(queryObject)
        .fetchAll()
        .then(function (data) {
            callback(null, data)
        })
        .catch(function (err){
            callback(err, null);
        })
};


const updateByObjectId = (updateObject, collection, callback) => {
    collection
        .forge({ id: updateObject.id })
        .fetch({ require: true })
        .then((data) => {
            data.save(updateObject)
                .then(() => callback(null, data))
                .catch(err => callback(err, null));
        })
        .catch(err => callback(err, null));
};

const deleteByObjectId = (deleteId, collection, callback) => {
    collection
        .forge({ id: deleteId })
        .fetch({ require: true })
        .then((data) => {
            data.destroy()
                .then(() => callback(null, data))
                .catch(err => callback(err, null));
        })
        .catch(err => callback(err, null));
};
module.exports =  {
    postMultipleRow : postMultipleRow,
    postSingleRow : postSingleRow,
    fetchAllObject: fetchAllObject,
    updateByObjectId: updateByObjectId,
    deleteByObjectId: deleteByObjectId,
    findByObject: findByObject
};