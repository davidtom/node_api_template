// Library Imports
const chai = require('chai');
const chaiHttp = require('chai-http');
// Global Imports
// Project Imports
const index = require('../../index');

const should = chai.should();
chai.use(chaiHttp);

describe('api/v1/users', function(){
    // url for all tests
    const url = '/api/v1/users';

    describe('GET', function(){
        it('Authorized: responds with a list of users with no password', function (done) {
            chai.request(index)
            .get(url)
            .set('token', process.env.TEST_TOKEN)
            .end(function (err, res) {
                res.should.have.status(200);
                res.body.should.be.an('array');
                res.body.should.not.have.deep.property('[0].password');
                done();
            });
        });
        it('Unauthorized: responds with a 401 error', function (done) {
            chai.request(index)
                .get(url)
                .set('token', 'fake')
                .end(function (err, res) {
                    res.should.have.status(401);
                    res.body.should.be.an('object');
                    res.body.should.have.property('message');
                    done();
                });
        });
    });
});

// TODO:
// Test setup:
// create a test db
// see how its done here: https://scotch.io/tutorials/test-a-node-restful-api-with-mocha-and-chai

// Tests to write:
// public routes should NEVER include a password field!

// Structure:
// Do I need to hide the names and URIs for my databases in .env? or are those safe in
// a config file of some sort?
//  See: https://www.terlici.com/2014/08/25/best-practices-express-structure.html for possible test folder structure