// Run tests.ts by following the instructions below:

// This level is written in TypeScript, so it comes with its own npm scripts.
// Open a terminal and run the following from inside the level's folder:
// $ cd Season-5/Level-2 && npm install
// $ npm test

// If you're inside a Codespace, the above should be running smoothly.

import request from "supertest";
import { expect } from "chai";

import app from "./code";
// import app from "./solution"; // To test the solution, uncomment this line and comment the one above

const ALICE = "tok-alice";
const CAROL = "tok-carol";

describe("Paperwork - expense reports", () => {
  it("should let an employee read their own report", (done) => {
    request(app)
      .get("/reports/r-alice-1")
      .set("x-session-token", ALICE)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err + "\n" + res.text);
        expect(res.body.merchant).to.equal("Blue Bottle");
        done();
      });
  });

  it("should refuse a request without a session", (done) => {
    request(app)
      .get("/reports/r-alice-1")
      .expect(401)
      .end((err, res) => {
        if (err) return done(err + "\n" + res.text);
        done();
      });
  });

  it("should return 404 for a report that does not exist", (done) => {
    request(app)
      .get("/reports/r-nope")
      .set("x-session-token", ALICE)
      .expect(404)
      .end((err, res) => {
        if (err) return done(err + "\n" + res.text);
        done();
      });
  });

  it("should let an employee edit their own draft", (done) => {
    request(app)
      .patch("/reports/r-alice-1")
      .set("x-session-token", ALICE)
      .send({ merchant: "Cafe Nero", amount: 14 })
      .expect(200)
      .end((err, res) => {
        if (err) return done(err + "\n" + res.text);
        expect(res.body.merchant).to.equal("Cafe Nero");
        expect(res.body.amount).to.equal(14);
        done();
      });
  });

  it("should let a manager approve a report from their team", (done) => {
    request(app)
      .post("/reports/r-alice-2/approve")
      .set("x-session-token", CAROL)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err + "\n" + res.text);
        expect(res.body.status).to.equal("approved");
        done();
      });
  });

  after(() => {
    app.close();
  });
});
