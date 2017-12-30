// Library Imports
const mongoose = require('mongoose');

// Global Imports
// Project Imports

const Schema = mongoose.Schema;

// Define the structure and data types of contact documents
// Will be embedded within User.contacts; referenced in Event.leads and Event.roster
const contactSchema = new Schema({
    firstName: {
        type: String,
        required: true,
        trim: true
    },
    lastName: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true
    },
    phone: {
        type: Number,
        required: false,
        trim: true
    },
    source: {
        type: String,
        required: false,
        trim: true
    }
},
{
    timestamps: true
}
);

// Validations
// Email correctly formatted
contactSchema.path('email').validate(function (email) {
    const emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
    return emailRegex.test(email);
}, 'The e-mail field must be formatted correctly.');

module.exports = contactSchema;
