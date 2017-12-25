/* eslint handle-callback-err: 0 */

// Library Imports
const chai = require('chai');
const chaiHttp = require('chai-http');
const http = require('http');

// Global Imports
// Project Imports
const app = require('../../app');
const User = require('../../models/User');
const { userData } = require('../config/constants');

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

    // token variable to be set during tests
    let token;

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
                    // store token for subsequent tests of authorized routes
                    token = res.body.token;
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
});
