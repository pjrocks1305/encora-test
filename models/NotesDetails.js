const Bookshelf = require('../config/db').bookshelf;

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

const NotesDetail = Bookshelf.Model.extend({
    tableName: 'notes'
});

const NotesDetails = Bookshelf.Collection.extend({
    model: NotesDetail
});

module.exports = {
    NotesDetail: NotesDetail,
    NotesDetails: NotesDetails
};