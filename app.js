const express = require('express');
const cors = require("cors");
const helmet = require("helmet");
const bodyParser = require("body-parser");
const app = express();
const createError = require('http-errors');
const apiRoutes = require('./routes/api');
const mongoose = require("./config/db_main");
const winston = require('./config/logger');
const morgan = require('morgan');

require("./models/index");

app.use(helmet());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(morgan("dev"));

apiRoutes.includeRoutes(app);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(winston.exceptionMiddleware);

app.use(function (err, req, res, next) {
    let errorObj = {
      app: "Document_Sharer",
      head: err.head,
      message: err.message
    };
    res.status(err.status || 500).json(errorObj);
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
