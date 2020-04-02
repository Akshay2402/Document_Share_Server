const api = {};
api.includeRoutes = function (app) {
    const indexRoute = require('./index');
    const documents = require('./document');
    const authentication = require('./authentication');


    function isAuthenticated(req, res, next) {
        if (!req.tokenVerified) {
            return next({
                status: 401,
                message: "Unauthenticated"
            });
        } else {
            return next();
        }
    }

    /**
     * Open Routes
     */
    app.use('/', indexRoute);
    app.use('/user/auth', authentication);

    /**
     * Protected Routes
     */
    app.use('/api/v1/*', isAuthenticated);
    app.use('/api/v1/document', documents);
};

module.exports = api;