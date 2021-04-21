

module.exports = function (app) {
    app.use(function (req, res, next) {
        const err = new Error('Not Found');
        err.status = 404;
        next(err);
    });

        app.use(function (err, req, res, next) {
            res.status(err.status || 500);
            res.json({success: false, message: err.message, error: err.error});

        });
};