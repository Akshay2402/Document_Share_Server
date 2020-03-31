const express = require('express');
const cors = require("cors");
const helmet = require("helmet");
const bodyParser = require("body-parser");
const app = express();
const logger = require('morgan');
const createError = require('http-errors');
const apiRoutes = require('./routes/api');
const mongoose = require("./config/db_main");

app.use(logger('dev'));
app.use(helmet());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

apiRoutes.includeRoutes(app);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

process.on('SIGTERM', graceful);
process.on('SIGINT', graceful);

function graceful() {
    mongoose.connection.close(() => {
        console.log('Closed Mongoose Connections!');  
        process.exit(0);
    });
}

module.exports = app;
