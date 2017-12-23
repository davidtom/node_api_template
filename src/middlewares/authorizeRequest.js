// Library Imports
// Global Imports
// Project Imports
const AppError = require('../utils/appError');
const { decodeJWT } = require('../utils/auth');
const User = require('../models/User');
const constants = require('../utils/constants');

// Block any requests that do not have a valid token. Authorized requests
// will yield a currentUser object on req
module.exports = function(req, res, next) {
    // Check that the headers have a token field
    const { token } = req.headers;
    if (!token) {
        const err = new AppError('Unauthorized: no token found in headers', 401);
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
        // If there is no _id present in data to find a user with
        // block request as unauthorized
        if (!data._id) {
            const appErr = new AppError('Unauthorized: invalid data decoded from token', 401);
            return next(appErr);
        }
        const { privateUser } = constants.projections;
        User.findOne({ _id: data._id }, privateUser, function (err, user) {
            if (err) {
                return next(err);
            }
            req.currentUser = user;
            next();
        });
    });
};
