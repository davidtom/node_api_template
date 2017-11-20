const express = require('express');
const router = express.Router();

// handle all routes to /api/v1/users
router.route('/')
    .get(function(req, resp) {
        resp.json('hello!');
    })
    .post(function(req, resp) {

    });

module.exports = router;
