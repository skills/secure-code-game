// Run hack.ts by following the instructions below:

// This level is written in TypeScript, so it comes with its own npm scripts.
// Open a terminal and run the following from inside the level's folder:
// $ cd Season-5/Level-2 && npm install
// $ npm run hack

// If you're inside a Codespace, the above should be running smoothly.

import request from "supertest";
import { expect } from "chai";

import app from "./code";
// import app from "./solution"; // To test the solution, uncomment this line and comment the one above

const ALICE = "tok-alice";
const BOB = "tok-bob";

// Alice's payout details. Bob has no business ever seeing this string.
const ALICE_ACCOUNT = "ALICE-PRIVATE-ACCOUNT-4471";

describe("Security tests", () => {
  it("should not let one employee read another employee's report", (done) => {
    // Bob is signed in as himself. He is simply asking for an id that is not his.
    request(app)
      .get("/reports/r-alice-1")
      .set("x-session-token", BOB)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.text).to.not.include(ALICE_ACCOUNT);
        expect(res.status).to.not.equal(200);
        done();
      });
  });

  it("should not let an employee approve their own report by editing it", (done) => {
    // The report really is Alice's, so the ownership check passes. The question
    // is whether owning it means she gets to set every field on it.
    request(app)
      .patch("/reports/r-alice-1")
      .set("x-session-token", ALICE)
      .send({ status: "approved", amount: 9999 })
      .end((err) => {
        if (err) return done(err);

        request(app)
          .get("/reports/r-alice-1")
          .set("x-session-token", ALICE)
          .end((err2, res2) => {
            if (err2) return done(err2);
            expect(res2.body.status).to.equal("draft");
            expect(res2.body.amount).to.not.equal(9999);
            done();
          });
      });
  });

  it("should not let an employee approve their own report by claiming a role", (done) => {
    request(app)
      .post("/reports/r-alice-2/approve")
      .set("x-session-token", ALICE)
      .set("x-user-role", "manager")
      .end((err) => {
        if (err) return done(err);

        request(app)
          .get("/reports/r-alice-2")
          .set("x-session-token", ALICE)
          .end((err2, res2) => {
            if (err2) return done(err2);
            expect(res2.body.status).to.equal("submitted");
            done();
          });
      });
  });

  after(() => {
    app.close();
  });
});
