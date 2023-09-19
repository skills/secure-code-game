///////////////////////////////////////////////////////////////
///                      	RUN TESTS                      		///
/// ________________________________________________________///
///                                                      		///
///   				       npm install --global mocha       			///
///   				           mocha hack.js       				        ///
///                                                      		///
///////////////////////////////////////////////////////////////

const app = require("./code");
// const app = require("./solution"); // To test the solution, uncomment this line and comment the one above
const request = require("supertest");
const { expect } = require("chai");

describe("Security tests", () => {
  it("should handle XML payload safely (no XXE)", (done) => {
    const xmlPayload = `
    <?xml version="1.0" encoding="utf-8"?>
    <!DOCTYPE replace [<!ENTITY xxe "Doe"> ]>
    <ufo><location>&xxe;</location></ufo>
    `;

    request(app)
      .post("/ufo")
      .set("Content-Type", "application/xml")
      .send(xmlPayload)
      .expect(400) // Expecting a 400 response due to security measures
      .end((err, res) => {
        if (err) return done(err + "\n" +  res.text);
        expect(res.text).to.include("Invalid XML");
        done();
      });
  });

  it("should handle malicious XXE payload to access /etc/passwd safely", (done) => {
    const maliciousXmlPayload = `
      <?xml version="1.0" encoding="UTF-8"?>
      <!DOCTYPE ufo [
        <!ENTITY xxe SYSTEM "file:///etc/passwd">
      ]>
      <ufo><location>&xxe;</location></ufo>
    `;

    request(app)
      .post("/ufo")
      .set("Content-Type", "application/xml")
      .send(maliciousXmlPayload)
      .expect(400) // Expecting a 400 response due to security measures
      .end((err, res) => {
        if (err) return done(err + "\n" +  res.text);
        expect(res.text).to.include("Invalid XML");
        done();
      });
  });

  it("should handle malicious XXE payload to access a .env file safely", (done) => {
    const maliciousXmlPayload = `
    <?xml version="1.0" encoding="UTF-8"?>
    <!DOCTYPE ufo [
        <!ENTITY xxe SYSTEM ".env.production">
     ]>
    <ufo><location>&xxe;</location></ufo>
    `;

    request(app)
      .post("/ufo")
      .set("Content-Type", "application/xml")
      .send(maliciousXmlPayload)
      .expect(400) // Expecting a 400 response due to security measures
      .end((err, res) => {
        if (err) return done(err + "\n" +  res.text);
        expect(res.text).to.include("Invalid XML");
        done();
      });
  });

  describe("POST /ufo", () => {
    it("should handle malicious XXE payload to access a .admin file safely", (done) => {
      const xmlPayload = `<?xml version="1.0" encoding="UTF-8"?>
        <!DOCTYPE ufo [
            <!ENTITY xxe SYSTEM "hack.admin">
        ]>
        <ufo><location>&xxe;</location></ufo>`;

      request(app)
        .post("/ufo")
        .set("Content-Type", "application/xml")
        .send(xmlPayload)
        .expect(400) // Expecting a 400 response due to security measures
        .end((err, res) => {
          if (err) return done(err + "\n" +  res.text);
          expect(res.text).to.include("Invalid XML");
          done();
        });
    });
  });

  it("should handle the provided XXE payload safely", (done) => {
    const providedXmlPayload = `
      <?xml version="1.0" encoding="UTF-8"?>
      <!DOCTYPE ufo [
        <!ENTITY xxe "LOL">
        <!ENTITY xxe1 "&xxe;&xxe;&xxe;&xxe;&xxe;&xxe;&xxe;">
        <!ENTITY xxe2 "&xxe1;&xxe1;&xxe1;&xxe1;&xxe1;&xxe1;&xxe1;&xxe1;&xxe1;&xxe1;&xxe1;&xxe1;&xxe1;&xxe1;">
      ]>
      <ufo><location>&xxe2;</location></ufo>
    `;

    request(app)
      .post("/ufo")
      .set("Content-Type", "application/xml")
      .send(providedXmlPayload)
      .expect(400) // Expecting a 400 response due to security measures
      .end((err, res) => {
        if (err) return done(err + "\n" +  res.text);
        expect(res.text).to.include("Invalid XML");
        done();
      });
  });
});

after(() => {
  app.close();
});
