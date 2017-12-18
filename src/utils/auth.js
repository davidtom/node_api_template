// Library Imports
const jwt = require('jsonwebtoken');
// Global Imports
// Project Imports

// Specify secret and options for encoding and decoding JWT
const secret = 'secret';
const options = {};

module.exports = {
    // Issue JWT for an authenticated user
    issueJWT: function(user, cb) {
        // Create jwt and supply it or errors to callback function
        const payload = {
            _id: user._id
        };
        jwt.sign(payload, secret, options, function(err, token) {
            if (err) {
                return cb(err);
            }
            cb(null, token);
        });
    },

    // Decode a JWT and provide decoded user data
    decodeJWT: function(token, cb) {
        // Decode JWT and supply its data or errors to callback function
        jwt.verify(token, secret, options, function(err, decoded) {
            if (err) {
                return cb(err)
            }
            cb(null, decoded);
        });
    } 
};
