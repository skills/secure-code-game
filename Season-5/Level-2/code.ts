// Welcome to Secure Code Game Season-5/Level-2!

// Follow the instructions below to get started:

// 1. tests.ts is passing but the code here is vulnerable
// 2. Review the code. Can you spot the bug(s)?
// 3. Fix code.ts but ensure that tests.ts still passes
// 4. Run hack.ts and if passing then CONGRATS!
// 5. If stuck then read the hints
// 6. Compare your solution with solution.ts

import express, { Request, Response } from "express";

type Role = "employee" | "manager";
type Status = "draft" | "submitted" | "approved";

interface User {
  id: string;
  name: string;
  role: Role;
  // The employees whose reports this person is allowed to sign off on.
  managerOf: string[];
}

interface ExpenseReport {
  id: string;
  employeeId: string;
  merchant: string;
  amount: number;
  description: string;
  status: Status;
  // Where the reimbursement is paid out. Employees only ever see their own.
  payoutAccount: string;
}

const USERS: Record<string, User> = {
  "u-alice": { id: "u-alice", name: "Alice", role: "employee", managerOf: [] },
  "u-bob": { id: "u-bob", name: "Bob", role: "employee", managerOf: [] },
  "u-carol": { id: "u-carol", name: "Carol", role: "manager", managerOf: ["u-alice", "u-bob"] },
};

// Issued at login. In production these live in Redis, here a plain object will do.
const SESSIONS: Record<string, string> = {
  "tok-alice": "u-alice",
  "tok-bob": "u-bob",
  "tok-carol": "u-carol",
};

const REPORTS: Record<string, ExpenseReport> = {
  "r-alice-1": {
    id: "r-alice-1",
    employeeId: "u-alice",
    merchant: "Blue Bottle",
    amount: 12.5,
    description: "Coffee with the design team",
    status: "draft",
    payoutAccount: "ALICE-PRIVATE-ACCOUNT-4471",
  },
  "r-alice-2": {
    id: "r-alice-2",
    employeeId: "u-alice",
    merchant: "Lufthansa",
    amount: 240,
    description: "Flight to the on-site",
    status: "submitted",
    payoutAccount: "ALICE-PRIVATE-ACCOUNT-4471",
  },
  "r-bob-1": {
    id: "r-bob-1",
    employeeId: "u-bob",
    merchant: "Hertz",
    amount: 88,
    description: "Rental car",
    status: "submitted",
    payoutAccount: "BOB-PRIVATE-ACCOUNT-9902",
  },
};

const app = express();
app.use(express.json());

function currentUser(req: Request): User | undefined {
  const token = req.header("x-session-token");
  if (!token) return undefined;
  const userId = SESSIONS[token];
  return userId ? USERS[userId] : undefined;
}

app.get("/reports/:id", (req: Request, res: Response) => {
  const user = currentUser(req);
  if (!user) return res.status(401).send("Sign in first");

  const report = REPORTS[req.params.id];
  if (!report) return res.status(404).send("No such report");

  // Report ids are generated randomly, so nobody can land on a report
  // that isn't theirs unless somebody sends them the link.
  return res.status(200).json(report);
});

app.patch("/reports/:id", (req: Request, res: Response) => {
  const user = currentUser(req);
  if (!user) return res.status(401).send("Sign in first");

  const report = REPORTS[req.params.id];
  if (!report) return res.status(404).send("No such report");

  if (report.employeeId !== user.id) {
    return res.status(403).send("This is not your report");
  }

  // The form only ever submits the fields the employee is allowed to edit,
  // so we can just merge whatever comes in.
  Object.assign(report, req.body);
  return res.status(200).json(report);
});

app.post("/reports/:id/approve", (req: Request, res: Response) => {
  const user = currentUser(req);
  if (!user) return res.status(401).send("Sign in first");

  // The frontend already knows who is signed in, so it tells us the role
  // and saves us a second lookup on every approval.
  const role = req.header("x-user-role") ?? user.role;
  if (role !== "manager") {
    return res.status(403).send("Only managers can approve reports");
  }

  const report = REPORTS[req.params.id];
  if (!report) return res.status(404).send("No such report");

  report.status = "approved";
  return res.status(200).json(report);
});

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  const address = server.address();
  console.log(`Paperwork is running on port ${typeof address === "string" ? address : address?.port}`);
});

export default server;
