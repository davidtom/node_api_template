// Library Imports
const express = require('express');

// Global Imports
// Project Imports
const User = require('../models/User');
const { signUpDataPresent, passwordsMatch } = require('../middlewares/signUp');
const authorizeRequest = require('../middlewares/authorizeRequest');
const { issueJWT } = require('../utils/auth');
const constants = require('../utils/constants');

const router = express.Router();

// handle all routes to /api/v1/users
router.route('/')
    .get(authorizeRequest, function(req, res, next) {
        const { publicUser } = constants.projections;
        User.find({}, publicUser, function(err, users) {
            if (err) {
                return next(err);
            }
            // Respond with list of users
            res.json(users);
        });
    })
    .post(signUpDataPresent, passwordsMatch, function(req, res, next) {
        // Pull userData from request
        const { userData } = req;

        // Create a new User and send back as response
        User.create(userData, function (err, user) {
            if (err) {
                err.status = 400;
                return next(err);
            }
            // Respond with token and public user data
            // (same as login - GET /session)
            issueJWT(user, function(err, token) {
                if (err) {
                    return next(err);
                }
                res.json({
                    token: token,
                    user: user.public()
                });
            });
        });
    });

module.exports = router;
