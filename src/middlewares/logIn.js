// Library Imports
// Global Imports
// Project Imports
const AppError = require('../utils/appError');

// Check that all login credentials are present in request
module.exports = function(req, res, next) {
    // Pull data from request body
    const { email, password } = req.body;
    // Check that all data is present and set it to req.userCredentials if it is
    if (email && password) {
        const userCredentials = {
            email,
            password
        };
        req.userCredentials = userCredentials;
        return next();
    }
    // Respond with an error if all required data is not present
    const err = new AppError('Invalid body: ' + JSON.stringify(req.body), 400);
    next(err);
};
