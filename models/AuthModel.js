var bcrypt = require("bcrypt");
var Promise = require("bluebird");
var Bookshelf = require("../config/db").bookshelf;

/**
 * @swagger
 * definitions:
 *   users:
 *     properties:
 *       id:
 *         type: integer
 *       name:
 *         type: string
 *       email:
 *         type: string
 *       password:
 *         type: string
 *       created_at:
 *         type: string
 *       updated_at:
 *         type: string
 */

const User = Bookshelf.Model.extend({
    tableName: 'users',
    initialize() {
        this.on('saving', this.hashPassword, this);
    },
    hashPassword(model) {
        return new Promise(((resolve, reject) => {
            bcrypt.hash(model.attributes.password, 10, (err, hash) => {
                if (err) reject(err);
                if (model.attributes.password.length === 60) {
                    model.set('password', model.attributes.password);
                } else {
                    model.set('password', hash);
                }
                resolve(hash);
            });
        }));
    },
});

const Users = Bookshelf.Collection.extend({
    model: User,
});

module.exports = {
    User: User,
    Users: Users
};