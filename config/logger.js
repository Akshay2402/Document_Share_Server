
/*
 Courtsey - http://dhalsim.github.io/en/node.js/i-have-control/2015/11/13/nodejs-error-management-and-logging
 */

const winston = require('winston');
const moment = require('moment');
const os = require('os');

require('winston-mongodb').MongoDB;

const errorMeta = {
    hostname: os.hostname(),
    env: process.env.ENVIRONMENT || 'development',
    app: 'Document_Sharer'
};

const errorFileTransport = new (winston.transports.File)({
    filename: './logs/errors.log',
    level: 'debug',
    colorize: true,
    timestamp: function () {
        return moment.utc().format();
    },
    maxsize: 50000000, // 50 MB
    maxFiles: 20,
    tailable: true,
    zippedArchive: true
});

const errorMongoTransport = new (winston.transports.MongoDB)({
    // db: `mongodb://${process.env.BASE_DB_URI}/${process.env.LOGS_DB_NAME}`,
    db: process.env.MONGOLAB_SILVER_URI,
    level: 'debug',
    collection: 'commonerrors',
    name: 'common',
    tryReconnect: true,
    capped: true,
    cappedSize: 100000000,
    cappedMax: 50000
});

const logger = new (winston.Logger)({
    transports: [
        errorFileTransport,
        errorMongoTransport
    ]
});

/**
 * 
 * I overrided logger function
 * in case of error I'll inject errorMeta to meta
 *  
 * */

logger.log = function () {
    const args = arguments;
    const level = args[0];
    let originalMeta = args[2] || {};
    const msg = args[1] && ((typeof args[1] == 'string') || (args[1] instanceof String)) ? args[1] : undefined;

    if (level === 'error') {
        originalMeta = {...originalMeta, ...errorMeta};
    }
    winston.Logger.prototype.log.apply(logger, [level, msg, originalMeta]);
};


module.exports.log = logger;

module.exports.exceptionMiddleware = (err, req, res, next) => {
    let logObject = {
        status: err.status || 500,
        type: err.type,
        head: err.head || null,
        ip: req.myIpAddress
    };
    console.log('Inside exception Middleware');
    if (err) {
        logObject.message = err.message;
        logObject.stack = err.stack;
        logObject.type = 'Unknown'
        logObject.url = req.baseUrl+req.path || null;
        logObject.user = req.user ? req.user._id : null;
        logObject.method = req.method;
        logObject.payload = {};
        Object.assign(logObject.payload, req.query, req.body);

        if (logObject.status !== 401) {
            logger.error(logObject.message, logObject);
        }
        next(logObject);
    } else {
        next({});
    }
};