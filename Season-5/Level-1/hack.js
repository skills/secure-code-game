// Run hack.js by following the instructions below:

// Run file by opening a terminal and running the following:
// $ mocha Season-5/Level-1/hack.js

// If you're inside a Codespace, the above should be running smoothly.

// In case you're running this locally, please run the following command first,
// and then run the hack file:
// $ npm install Season-5/Level-1/ && npm install --global mocha

const http = require("http");
const request = require("supertest");
const { expect } = require("chai");

const TARGET = "./code";
// const TARGET = "./solution"; // To test the solution, uncomment this line and comment the one above

// Neither of these two should ever be reachable from the public dashboard.
const ADMIN_SECRET = "ground-station-master-key-9f2c";
const CREDENTIALS_SECRET = "AKIA-MISSION-CONTROL-TEMP-CREDS";

let observatory;
let adminApi;
let metadata;
let redirector;
let app;

function listen(handler) {
  return new Promise((resolve) => {
    const server = http.createServer(handler);
    server.listen(0, "127.0.0.1", () => resolve(server));
  });
}

const port = (server) => server.address().port;

describe("Security tests", () => {
  before(async () => {
    observatory = await listen((req, res) => {
      res.writeHead(200, { "Content-Type": "text/plain" });
      res.end("ORBIT 42 | ALT 540km | SIGNAL nominal");
    });

    // The internal admin API, bound to loopback because "only we can reach it".
    adminApi = await listen((req, res) => {
      res.writeHead(200, { "Content-Type": "text/plain" });
      res.end(ADMIN_SECRET);
    });

    // A stand in for the cloud instance metadata service.
    metadata = await listen((req, res) => {
      res.writeHead(200, { "Content-Type": "text/plain" });
      res.end(CREDENTIALS_SECRET);
    });

    // An innocent looking endpoint that answers with a redirect.
    redirector = await listen((req, res) => {
      res.writeHead(302, {
        Location: `http://localhost:${port(adminApi)}/admin/keys`,
      });
      res.end();
    });

    process.env.PORT = 0;
    process.env.HUBBLE_FEED_URL = `http://127.0.0.1:${port(observatory)}/telemetry`;
    process.env.KECK_FEED_URL = `http://127.0.0.1:${port(observatory)}/telemetry`;
    app = require(TARGET);
  });

  it("should not reach the internal admin API through an IPv4 shorthand", (done) => {
    // 127.1 is a perfectly valid way of writing 127.0.0.1, and it is not in the blocklist.
    request(app)
      .post("/telemetry/preview")
      .send({ url: `http://127.1:${port(adminApi)}/admin/keys` })
      .end((err, res) => {
        if (err) return done(err);
        expect(res.text).to.not.include(ADMIN_SECRET);
        expect(res.status).to.not.equal(200);
        done();
      });
  });

  it("should not reach the metadata service through a hex encoded address", (done) => {
    // 0x7f000001 is the same address again, written in hexadecimal.
    request(app)
      .post("/telemetry/preview")
      .send({ url: `http://0x7f000001:${port(metadata)}/latest/meta-data/iam/credentials` })
      .end((err, res) => {
        if (err) return done(err);
        expect(res.text).to.not.include(CREDENTIALS_SECRET);
        expect(res.status).to.not.equal(200);
        done();
      });
  });

  it("should not reach the internal admin API through a redirect", (done) => {
    // The submitted URL passes every check. The redirect it answers with does not,
    // but by then the check has already run.
    request(app)
      .post("/telemetry/preview")
      .send({ url: `http://2130706433:${port(redirector)}/feed` })
      .end((err, res) => {
        if (err) return done(err);
        expect(res.text).to.not.include(ADMIN_SECRET);
        expect(res.status).to.not.equal(200);
        done();
      });
  });

  after(() => {
    app.close();
    observatory.close();
    adminApi.close();
    metadata.close();
    redirector.close();
  });
});
