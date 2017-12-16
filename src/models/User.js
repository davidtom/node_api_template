// Library Imports
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Global Imports
// Project Imports

const Schema = mongoose.Schema;

// Define the structure and data types of user documents
const userSchema = new Schema({
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
        unique: true,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    roles: { // eg user, admin, etc.
        type: Array,
        default: ['user']
    }
});

// Pre save hooks
// Hash password before saving
userSchema.pre('save', function(next) {
    const user = this;
    const saltRounds = 10;
    bcrypt.hash(user.password, saltRounds, function(err, hash) {
        if (err) {
            next(err);
        }
        user.password = hash;
        next();
    });
});

// Validations
// Email correctly formatted
userSchema.path('email').validate(function(email) {
    const emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
    return emailRegex.test(email);
}, 'The e-mail field must be formatted correctly.');

// Create model for the users collection and export it
// NOTE: mongoose automatically pluralizes the collection name
const User = mongoose.model('User', userSchema);
module.exports = User;
