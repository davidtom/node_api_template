// Library Imports
// Global Imports
// Project Imports
const AppError = require('../utils/appError');
const auth = require('./auth');
const User = require('../models/User');
const constants = require('./constants');

const { decodeJWT } = auth;

module.exports = {
    // Normalize/clean specific data in req.body
    normalizeBody: function(req, res, next) {
        // Pull data from req
        const { email } = req.body;

        // Lowercase email
        if (email) {
            req.body.email = email.toLowerCase();
        }
        next();
    },

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
    passwordsMatch: function(req, res, next) {
        // If passwords do not match, respond with an error
        const { password, passwordConfirmation } = req.body;
        if (password !== passwordConfirmation) {
            const err = new AppError('Passwords do not match', 400);
            return next(err);
        }
        // Move to next function if they match
        next();
    },

    // Check that all login credentials are present in request
    checkLogInData: function(req, res, next) {
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
    },

    // Block any requests that do not have a valid token
    authorizeRequest: function(req, res, next) {
        // Check that the headers have a token field
        const { token } = req.headers;
        if (!token) {
            const err = new AppError('No token found in headers', 400);
            return next(err);
        }
        // If token cannot be decoded, raise an error;
        // If token is decoded, allow request to continue and add
        // currentUser data to request
        decodeJWT(token, function (err, data) {
            if (err) {
                const appErr = new AppError('Unauthorized: invalid token', 401);
                return next(appErr);
            }
            // If there is no id present in data to find a user with
            // allow request, but without a currentUser
            if (!data._id) {
                return next();
            }
            const { privateUser } = constants.projections;
            User.find({ _id: data.id, privateUser }, function(err, user) {
                if (err) {
                    return next(err);
                }
                req.currentUser = user;
                next();
            });
        });
    }
};
