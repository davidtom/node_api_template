// Library Imports
const express = require('express');

// Global Imports
// Project Imports
const User = require('../models/User');
const middlewares = require('../utils/middlewares');
const auth = require('../utils/auth');
const constants = require('../utils/constants');

const router = express.Router();
const { checkLogInData, authorizeRequest } = middlewares;
const { issueJWT, decodeJWT } = auth;

// handle all routes to /api/v1/session
router.route('/')
    // GET = check authorization status
    .get(authorizeRequest, function(req, res, next) {
        // If authorization is successful, respond with user data
        const { currentUser } = req;
        const { publicUser } = constants.projections;
        User.find({_id: currentUser._id}, publicUser, function(err, user) {
            if (err) {
                return next(err);
            }
            res.json(user);
        })
    })
    // POST = login
    .post(checkLogInData, function(req, res, next) {
        // Authenticate user
        User.authenticate(req.userCredentials, function(err, user) {
            if (err) {
                return next(err);
            }
            // If authentication is successful, create a jwt and send it
            // along with sanitized user data in response
            issueJWT(user, function(err, token){
                if(err) {
                    return next(err);
                }
                res.json({
                    token: token,
                    user: user
                });
            });
        });
    })
    // DELETE = logout
    .delete(function(req, res, next) {
        // TODO: logout functions
    });

module.exports = router;
