// Library Imports
const chai = require('chai');
const chaiHttp = require('chai-http');
const http = require('http');

// Global Imports
// Project Imports
const app = require('../../app');

const should = chai.should();
chai.use(chaiHttp);

const server = http.createServer(app);
const request = chai.request(server);

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
});

// TODO: Tests to write:
// write a test that makes sure that safeUser fields
// match constants.projections.publicUser!!

// public routes should NEVER include a password field!

// POST to users should not create a user if info is missing

// POST to users should not create a user if passwords dont match
