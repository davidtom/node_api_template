/* eslint handle-callback-err: 0 */

// Library Imports
const chai = require('chai');
const chaiHttp = require('chai-http');
const http = require('http');

// Global Imports
// Project Imports
const app = require('../../app');
const { userData } = require('../config/constants');

chai.should();
chai.use(chaiHttp);

const server = http.createServer(app);
const request = chai.request(server);

describe('api/v1/session', function() {
    // url for all tests
    const url = '/api/v1/session';

    // token variable to be set during tests
    let token;

    describe('POST', function() {
        it('responds to logins with a token and user with no password', function(done) {
            request.post(url)
                .send({
                    email: userData.email,
                    password: userData.password
                })
                .end(function(err, res) {
                    res.should.have.status(200);
                    res.should.be.an('object');
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

        it('responds with a user with no password', function(done) {
            request.get(url)
                .set('token', token)
                .end(function(err, res) {
                    res.should.have.status(200);
                    res.body.should.be.an('object');
                    res.body.should.not.have.property('password');
                    done();
                });
        });
    });
});
