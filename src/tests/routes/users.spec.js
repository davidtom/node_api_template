/* eslint handle-callback-err: 0 */
/* eslint no-unused-expressions: 0 */

// Library Imports
const chai = require('chai');
const chaiHttp = require('chai-http');
const http = require('http');

// Global Imports
// Project Imports
const app = require('../../app');
const User = require('../../models/User');
const { userData } = require('../config/constants');
const { updatedUserData } = require('../config/constants');

const expect = chai.expect;
chai.should();
chai.use(chaiHttp);

const server = http.createServer(app);
const request = chai.request(server);

describe('api/v1/users', function() {
    // url for all tests
    const url = '/api/v1/users';

    before(function(done) {
        User.remove({}, function(err) {
            done();
        });
    });

    // Variable(s) to be set/used during tests
    let token, userId, originalUser;

    describe('POST', function() {
        it('responds with a token and a user with no password', function(done) {
            request.post(url)
                .set('Content-Type', 'application/json')
                .send(userData)
                .end(function(err, res) {
                    res.should.have.status(200);
                    res.body.should.be.an('object');
                    res.body.should.have.property('token');
                    res.body.should.have.property('user');
                    res.body.user.should.not.have.property('password');
                    token = res.body.token;
                    userId = res.body.user._id;
                    done();
                });
        });
    });

    describe('GET', function() {
        it('is an authorized route', function(done) {
            request.get(url)
                .set('token', 'fake')
                .end(function(err, res) {
                    res.should.have.status(401);
                    res.body.should.be.an('object');
                    res.body.should.have.property('message');
                    done();
                });
        });

        it('responds with a list of users with no password', function (done) {
            request.get(url)
                .set('token', token)
                .end(function (err, res) {
                    res.should.have.status(200);
                    res.body.should.be.an('array');
                    res.body.should.have.length(1);
                    res.body[0].should.not.have.property('password');
                    done();
                });
        });
    });

    describe('PUT', function() {
        it('is an authorized route', function(done) {
            request.put(url + '/' + userId)
                .set('token', 'fake')
                .end(function(err, res) {
                    res.should.have.status(401);
                    res.body.should.be.an('object');
                    res.body.should.have.property('message');
                    done();
                });
        });

        // Save user data before update
        before(function(done) {
            User.findOne({ _id: userId }, function(err, user) {
                originalUser = user;
                done();
            });
        });

        it('updates a user\'s data', function(done) {
            request.put(url + '/' + userId)
                .set('token', token)
                .send(updatedUserData)
                .end(function (err, res) {
                    res.should.have.status(200);
                    res.body.should.be.an('object');
                    res.body.should.have.property('n');
                    res.body.should.have.property('nModified');
                    res.body.should.have.property('ok');
                    res.body.nModified.should.equal(1);
                    done();
                });
        });

        it('does not update a user\'s _id', function(done) {
            User.findOne({ _id: originalUser._id }, function(err, user) {
                expect(user).to.exist;
                expect(user._id).to.eql(originalUser._id);
                done();
            });
        });

        it('does not update a user\'s role', function(done) {
            User.findOne({ _id: originalUser._id }, function(err, user) {
                expect(user.roles).to.eql(originalUser.roles);
                done();
            });
        });

        it('does not update a user\'s password', function(done) {
            User.findOne({ _id: originalUser._id }, function(err, user) {
                expect(user.password).to.equal(originalUser.password);
                done();
            });
        });
    });

    describe('DELETE', function() {
        it('is an authorized route', function (done) {
            request.delete(url + '/' + userId)
                .set('token', 'fake')
                .end(function (err, res) {
                    res.should.have.status(401);
                    res.body.should.be.an('object');
                    res.body.should.have.property('message');
                    done();
                });
        });

        it('deletes a user\'s data', function(done) {
            request.delete(url + '/' + userId)
                .set('token', token)
                .end(function(err, res) {
                    res.should.have.status(200);
                    res.body.should.be.an('object');
                    res.body.should.have.property('n');
                    res.body.n.should.equal(1);
                    res.body.should.have.property('ok');
                    res.body.ok.should.equal(1);
                    done();
                });
        });
    });
});
