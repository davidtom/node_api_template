// Library Imports
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Global Imports
// Project Imports
const AppError = require('../utils/appError');
const contactSchema = require('./Contact');

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
    contacts: [contactSchema],
    roles: { // eg user, admin, etc.
        type: Array,
        default: ['user']
    }
},
{
    timestamps: true
});

// Pre save hooks
// Hash password before saving (for first time)
userSchema.pre('save', function(next) {
    const user = this;
    // Hash password, but only if user has not been saved before (ie it is new)
    if (user.__v === undefined){
        const saltRounds = 10;
        bcrypt.hash(user.password, saltRounds, function (err, hash) {
            if (err) {
                return next(err);
            }
            user.password = hash;
            return next();
        });
    } else {
        next();
    }
});

// Validations
// Email correctly formatted
userSchema.path('email').validate(function(email) {
    const emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
    return emailRegex.test(email);
}, 'The e-mail field must be formatted correctly.');

// User model methods and statics
// Get only data that is safe to be public for a user
userSchema.methods.public = function() {
    return {
        _id: this._id,
        firstName: this.firstName,
        lastName: this.lastName,
        email: this.email,
        roles: this.roles
    };
};

userSchema.methods.hasContact = function(newContact) {
    const existing = this.contacts.find(contact => contact.email === newContact.email);
    if (existing) {
        return true;
    }
    return false;
};

// Authenticate email and password
userSchema.statics.authenticate = function(userCredentials, cb) {
    const { email, password } = userCredentials;
    this.findOne({ email: email }, function(err, user) {
        // Handle query and no result errors
        if (err) {
            return cb(err);
        }
        if (!user) {
            const appErr = new AppError('User not found', 401);
            return cb(appErr);
        }

        // Compare password with hashed password
        bcrypt.compare(password, user.password, function(err, result) {
            // Handle compare fx and no match error
            if (err) {
                return cb(err);
            }
            if (!result) {
                const appErr = new AppError('Invalid password', 401);
                return cb(appErr);
            }
            // Passwords match, pass (sanitized) user to callback
            cb(null, user.public());
        });
    });
};

// Create model for the users collection and export it
// NOTE: mongoose automatically pluralizes the collection name
const User = mongoose.model('User', userSchema);
module.exports = User;
