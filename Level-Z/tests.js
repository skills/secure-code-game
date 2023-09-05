///////////////////////////////////////////////////////////////
///                      	RUN TESTS                      		///
/// ________________________________________________________///
///                                                      		///
///   				           mocha tests.js       				      ///
///                                                      		///
///////////////////////////////////////////////////////////////

const app = require("./code");
// const app = require("./solution"); // To test the solution, uncomment this line and comment the one above
const request = require('supertest');
const { expect } = require('chai');

describe('POST /ufo', () => {
  it('should respond with a successful JSON response', (done) => {

    request(app)
      .post('/ufo')
      .set('Content-Type', 'application/json')
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.ufo).to.equal('Received JSON data from an unknown planet.');
        done();
      });
  });

  it('should handle valid XML data', function (done) {
    const xmlData = '<?xml version="1.0" encoding="utf-8"?><ufo><location>Canada</location></ufo>';
    request(app)
      .post('/ufo')
      .set('Content-Type', 'application/xml')
      .send(xmlData)
      .expect(200)
      .end(function (err, res) {
        if (err) return done(err);
        expect(res.text).to.equal("Canada");
        done();
      });
  });

  it('should respond with a 400 error for invalid XML', (done) => {
    const invalidXmlPayload = 'invalid>a<xml>';

    request(app)
      .post('/ufo')
      .set('Content-Type', 'application/xml')
      .send(invalidXmlPayload)
      .expect(400)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.text).to.include('Invalid XML:');
        done();
      });
  });

  it('should respond with a 400 error for unsupported content type', (done) => {
    request(app)
      .post('/ufo')
      .set('Content-Type', 'application/octet-stream')
      .send('Some data')
      .expect(405, done);
  });
});

after(() => {
  app.close();
});
