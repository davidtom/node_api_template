// Library Imports
// Global Imports
// Project Imports
const AppError = require('../utils/appError');

module.exports = {
    // Check that all user sign up data is present in request
    signUpDataPresent: function (req, res, next) {
        // Pull data from request body
        const { firstName, lastName, email, password, passwordConfirmation } = req.body;

        // Check that all required data is present and set it to req.userData if it is
        if (firstName && lastName && email &&
            password && passwordConfirmation) {
            const userData = {
                firstName,
                lastName,
                email,
                password
            };
            req.userData = userData;
            return next();
        }
        // Respond with an error if all required data is not present
        const err = new AppError('Invalid body: ' + JSON.stringify(req.body), 400);
        next(err);
    },

    // Check that password and passwordConfirmation match
    passwordsMatch: function (req, res, next) {
        // If passwords do not match, respond with an error
        const { password, passwordConfirmation } = req.body;
        if (password !== passwordConfirmation) {
            const err = new AppError('Passwords do not match', 400);
            return next(err);
        }
        // Move to next function if they match
        next();
    }
};
