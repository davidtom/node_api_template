// Library Imports
const chai = require('chai');
const chaiHttp = require('chai-http');
// Global Imports
// Project Imports
const index = require('../../index');

const should = chai.should();
chai.use(chaiHttp);
const request = chai.request(index);

describe('The server', function () {
    it('responds to requests to / with a 404 error', function (done) {
        request.get('/')
            .end((err, res) => {
                res.should.have.status(404);
                res.body.should.be.an('object');
                res.body.should.have.property('message');
                done();
            });
    });
    // TODO: save authorization data in .env and test authorized routes
    // TEST ALL ROUTES?

    // SEE INFO BELOW FOR TESTING SET UP:
    // https://blog.risingstack.com/node-hero-node-js-unit-testing-tutorial/

    // NOTE: REMEMBER: all tests should be next to their implementation;
    // keep tests here restricted to public routes/data of index.js and app.js
    // TODO: run another test, before test block to all authorized routes
    // that makes an unauthorized request and asserts an error
    // something like:

    // before all [unauthorized test];
    // code block for just routes/authorized routes
});