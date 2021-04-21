const configVar = require("../config/config.json");

const DBConfig = {
    client: 'mysql',
    connection: {
        host: configVar.host,
        port: configVar.port,
        user: configVar.user,
        password: configVar.password,
        database: configVar.database,
        charset: 'utf8mb4'
    }
};

const  knex = require('knex')(DBConfig);
knex.on( 'query', function( queryData ) {
    //console.log(queryData);
});
const bookshelf = require('bookshelf')(knex);

module.exports.bookshelf = bookshelf;