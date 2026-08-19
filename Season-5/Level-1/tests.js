// Run tests.js by following the instructions below:

// Run file by opening a terminal and running the following:
// $ mocha Season-5/Level-1/tests.js

// If you're inside a Codespace, the above should be running smoothly.

// In case you're running this locally, please run the following command
// first, and then run the tests' file:
// $ npm install Season-5/Level-1/ && npm install --global mocha

const http = require("http");
const request = require("supertest");
const { expect } = require("chai");

const TARGET = "./code";
// const TARGET = "./solution"; // To test the solution, uncomment this line and comment the one above

const TELEMETRY = "ORBIT 42 | ALT 540km | SIGNAL nominal";

let observatory;
let app;

// A stand in for a partner observatory, so the level runs offline.
function startObservatory() {
  return new Promise((resolve) => {
    const server = http.createServer((req, res) => {
      res.writeHead(200, { "Content-Type": "text/plain" });
      res.end(TELEMETRY);
    });
    server.listen(0, "127.0.0.1", () => resolve(server));
  });
}

describe("Mission Control - telemetry preview", () => {
  before(async () => {
    observatory = await startObservatory();
    process.env.PORT = 0;
    process.env.HUBBLE_FEED_URL = `http://127.0.0.1:${observatory.address().port}/telemetry`;
    process.env.KECK_FEED_URL = `http://127.0.0.1:${observatory.address().port}/telemetry`;
    app = require(TARGET);
  });

  it("should list the registered partner feeds", (done) => {
    request(app)
      .get("/feeds")
      .expect(200)
      .end((err, res) => {
        if (err) return done(err + "\n" + res.text);
        expect(res.body.feeds).to.include("hubble");
        expect(res.body.feeds).to.include("keck");
        done();
      });
  });

  it("should preview the telemetry of a registered feed", (done) => {
    request(app)
      .post("/telemetry/preview")
      .send({ feed: "hubble" })
      .expect(200)
      .end((err, res) => {
        if (err) return done(err + "\n" + res.text);
        expect(res.text).to.equal(TELEMETRY);
        done();
      });
  });

  it("should preview a second registered feed", (done) => {
    request(app)
      .post("/telemetry/preview")
      .send({ feed: "keck" })
      .expect(200)
      .end((err, res) => {
        if (err) return done(err + "\n" + res.text);
        expect(res.text).to.equal(TELEMETRY);
        done();
      });
  });

  it("should reject a feed that is not registered", (done) => {
    request(app)
      .post("/telemetry/preview")
      .send({ feed: "voyager" })
      .expect(404)
      .end((err, res) => {
        if (err) return done(err + "\n" + res.text);
        done();
      });
  });

  it("should reject a request without a feed", (done) => {
    request(app)
      .post("/telemetry/preview")
      .send({})
      .expect(400)
      .end((err, res) => {
        if (err) return done(err + "\n" + res.text);
        done();
      });
  });

  after(() => {
    app.close();
    observatory.close();
  });
});
