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
const TokenService = require('./helpers/tokenService');

require("./models/index");

app.use(helmet());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(morgan("dev"));

app.use((req, res, next) => {
  const token = new TokenService(req.headers);
  req.tokenVerified = token.isAuthenticated();
  req.tokenPayload = token.getPayload();
  req.user = {
    _id: req.tokenPayload._id,
    email: req.tokenPayload.email,
    name: req.tokenPayload.name,
    is_verified: req.tokenPayload.is_verified
  };
  next();
});

apiRoutes.includeRoutes(app);


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
