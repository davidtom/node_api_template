// Library Imports
const chai = require('chai');
const chaiHttp = require('chai-http');
// Global Imports
// Project Imports
const index = require('./index');

const should = chai.should();
chai.use(chaiHttp);

describe('The server', function () {
    it('responds to requests to /', function (done) {
        chai.request(index)
            .get('/')
            .end((err, res) => {
                res.should.have.status(404);
                res.body.should.be.an('object');
                res.body.should.have.property('message');
                done();
            });
    });
    // TODO: save authorization data in .env and test authorized routes
    // TEST ALL ROUTES?
});