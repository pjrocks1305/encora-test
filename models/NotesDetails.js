var Bookshelf = require('../config/db').bookshelf;

/**
 * @swagger
 * definitions:
 *   notes:
 *     properties:
 *       id:
 *         type: integer
 *       description:
 *         type: string
 *       user_id:
 *         type: integer
 *       created_at:
 *         type: string
 *       updated_at:
 *         type: string
 */

var NotesDetail = Bookshelf.Model.extend({
    tableName: 'notes'
});

var NotesDetails = Bookshelf.Collection.extend({
    model: NotesDetail
});

module.exports = {
    NotesDetail: NotesDetail,
    NotesDetails: NotesDetails
};