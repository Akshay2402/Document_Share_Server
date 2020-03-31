const api = {};
api.includeRoutes = function (app) {
    const indexRoute = require('./index');

    app.use('/', indexRoute);
};

module.exports = api;