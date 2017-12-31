// Library Imports
// Global Imports
// Project Imports
const AppError = require('../utils/appError');

module.exports = {
    contactDataPresent: function(req, res, next) {
        // Pull data from request body
        const { firstName, lastName, email, phone, source } = req.body;

        // Check that all required data is present and set it to req.newContact if it is
        if (email) {
            const newContact = {
                firstName,
                lastName,
                email,
                phone,
                source
            };
            req.newContact = newContact;
            return next();
        }
        // Respond with an error if all required data is not present
        const err = new AppError('Invalid body; new contact must have an email: ' + JSON.stringify(req.body), 400);
        next(err);
    }
};
