const api = {};
api.includeRoutes = function (app) {
    const indexRoute = require('./index');
    const documents = require('./document');
    const authentication = require('./authentication');

    /**
     * Open Routes
     */
    app.use('/', indexRoute);
    app.use('/user/auth', authentication);

    /**
     * Protected Routes
     */
    app.use('/document', documents);
};

module.exports = api;