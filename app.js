var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var notesRouter = require('./routes/notes');
var authRouter = require('./routes/auth');
var swaggerJSDoc = require("swagger-jsdoc");
var swaggerUI = require("swagger-ui-express");


var app = express();

var allowCrossDomain = function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH');
    res.header("Access-Control-Allow-Headers", "Authorization, Origin, X-Requested-With, Content-Type, Accept");
    next();
};
app.use(allowCrossDomain);
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
var swaggerOptions = {
    swaggerDefinition:{
        info: {
            title: "Encora test API",
            version: "1.0.0",
            description: "API for encora test",
            contact: {
                name: "Priyanshu",
                email: "priyanshujain1305@gmail.com"
            },
            servers: ["http://localhost:3000"]
        }
    },
    apis: ["./models/*.js", "./routes/*.js"]
}

var swaggerDocs = swaggerJSDoc(swaggerOptions);
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerDocs));

app.use('/', indexRouter);
app.use('/notes', notesRouter);
app.use('/auth', authRouter);
require('./errors')(app);



module.exports = app;
