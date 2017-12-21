// Library Imports
// Global Imports
// Project Imports

// Normalize/clean specific data in req.body
module.exports = function (req, res, next) {
    // Pull data from req
    const { email } = req.body;

    // Lowercase email
    if (email) {
        req.body.email = email.toLowerCase();
    }
    next();
};
