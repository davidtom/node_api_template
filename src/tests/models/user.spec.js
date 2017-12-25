/* eslint handle-callback-err: 0 */

// Library Imports
const chai = require('chai');

// Global Imports
// Project Imports
const User = require('../../models/User');
const { userData } = require('../config/constants');
const constants = require('../../utils/constants');

chai.should();

before(function (done) {
    User.remove({}, function (err) {
        done();
    });
});

describe('The User model', function() {
    it('has a method public() that returns a user with same properties as publicUser projection', function(done) {
        User.create(userData, function(err, user) {
            if (err) {
                console.log(err);
            }
            const publicDbUser = user.public();
            const { publicUser } = constants.projections;
            publicDbUser.should.have.all.keys(publicUser);
            done();
        });
    });
});
