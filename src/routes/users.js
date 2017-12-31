// Library Imports
const express = require('express');

// Global Imports
// Project Imports
const User = require('../models/User');
const { signUpDataPresent, passwordsMatch } = require('../middlewares/signUp');
const authorizeRequest = require('../middlewares/authorizeRequest');
const { contactDataPresent } = require('../middlewares/contacts');
const { issueJWT } = require('../utils/auth');
const constants = require('../utils/constants');
const permitProperties = require('../utils/permitProperties');
const AppError = require('../utils/appError');

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
        // Pull userData from request - set by signUpDataPresent
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

router.route('/:id')
    .put(authorizeRequest, function(req, res, next) {
        const userId = req.params.id;
        // Set whitelisted attributes that can be updated
        const updatedUser = permitProperties(req.body, ['firstName', 'lastName', 'email']);
        User.update({ _id: userId }, { $set: updatedUser }, function(err, result) {
            if (err) {
                return next(err);
            }
            res.json(result);
        });
    })
    .delete(authorizeRequest, function(req, res, next) {
        const userId = req.params.id;
        User.remove({ _id: userId }, function(err, result) {
            if (err) {
                return next(err);
            }
            res.json(result);
        });
    });

router.route('/:id/contacts')
    .get(authorizeRequest, function(req, res, next) {
        const { currentUser } = req;
        res.json(currentUser.contacts);
    })
    .post(authorizeRequest, contactDataPresent, function(req, res, next) {
        const { currentUser, newContact } = req;

        // Check if contact (by email) already exists in user's contacts
        if (currentUser.hasContact(newContact)) {
            const appErr = new AppError(
                `Contact with email address: ${newContact.email} already exists`,
                400
            );
            return next(appErr);
        }

        // Add user to contacts, save, and return new contact
        currentUser.contacts.push(newContact);
        currentUser.save(function(err) {
            if (err) {
                return next(err);
            }
            const lastIndex = currentUser.contacts.length - 1;
            res.json(currentUser.contacts[lastIndex]);
        });
    });

module.exports = router;
