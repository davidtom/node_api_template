// Library Imports
const express = require('express');

// Global Imports
// Project Imports
const User = require('../models/User');
const AppError = require('../utils/appError');

const router = express.Router();

// handle all routes to /api/v1/users
router.route('/')
    .get(function(req, res, next) {
        User.find({}, function(err, result) {
            if (err) {
                next(err);
            } else {
                res.json(result);
            }
        });
    })
    .post(function(req, res, next) {
        // Store data from request body
        const { firstName, lastName, email, password, passwordConfirmation } = req.body;

        // Check that all required data is present
        if (firstName && lastName && email &&
            password && passwordConfirmation) {
            const userData = {
                firstName,
                lastName,
                email,
                password
            };

            // If passwords do not match, respond with an error
            if (password !== passwordConfirmation) {
                const error = new AppError('Passwords do not match', 400);
                next(error);
            }

            // Create a new User and send back as response
            User.create(userData, function(err, user) {
                if (err) {
                    err.status = 400;
                    next(err);
                } else {
                    res.json(user);
                }
            });

        // Respond with an error if all required data is not present
        } else {
            const error = new AppError('Invalid body: ' + JSON.stringify(req.body), 400);
            next(error);
        }
    });

module.exports = router;
