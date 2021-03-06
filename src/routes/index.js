// Library Imports
const express = require('express');

// Global Imports
// Project Imports

// Create router object and assign routes
const router = express.Router();
router.use('/users', require('./users'));
router.use('/session', require('./session'));

module.exports = router;
