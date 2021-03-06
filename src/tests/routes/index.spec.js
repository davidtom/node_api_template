/* eslint handle-callback-err: 0 */

// Library Imports
const chai = require('chai');
const chaiHttp = require('chai-http');
const http = require('http');

// Global Imports
// Project Imports
const app = require('../../app');

chai.should();
chai.use(chaiHttp);

const server = http.createServer(app);
const request = chai.request(server);

describe('The server', function() {
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
