// This is one possible solution. There are several others.

// The lesson: authentication answers "who is this?". Every one of the three bugs
// below comes from never asking the second question, "is this person allowed to do
// this, to this particular object?". Knowing an id is not permission, owning a
// record is not permission to change every field of it, and a role the client
// hands you is not a role at all.

import express, { Request, Response } from "express";

type Role = "employee" | "manager";
type Status = "draft" | "submitted" | "approved";

interface User {
  id: string;
  name: string;
  role: Role;
  managerOf: string[];
}

interface ExpenseReport {
  id: string;
  employeeId: string;
  merchant: string;
  amount: number;
  description: string;
  status: Status;
  payoutAccount: string;
}

const USERS: Record<string, User> = {
  "u-alice": { id: "u-alice", name: "Alice", role: "employee", managerOf: [] },
  "u-bob": { id: "u-bob", name: "Bob", role: "employee", managerOf: [] },
  "u-carol": { id: "u-carol", name: "Carol", role: "manager", managerOf: ["u-alice", "u-bob"] },
};

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

// The one place that decides who may look at a report. Every route asks it,
// so the rule cannot drift apart between endpoints.
function mayRead(user: User, report: ExpenseReport): boolean {
  if (report.employeeId === user.id) return true;
  return user.role === "manager" && user.managerOf.includes(report.employeeId);
}

// The fields an employee is allowed to change on their own draft. Anything not
// on this list, `status` above all, is decided by the server.
const EDITABLE_FIELDS = ["merchant", "amount", "description"] as const;

app.get("/reports/:id", (req: Request, res: Response) => {
  const user = currentUser(req);
  if (!user) return res.status(401).send("Sign in first");

  const report = REPORTS[req.params.id];
  if (!report) return res.status(404).send("No such report");

  // 1. An unguessable id is not an access control decision. Check the object.
  if (!mayRead(user, report)) {
    return res.status(403).send("This is not your report");
  }

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

  // 2. Owning a record does not mean owning every field of it. Take only the
  //    fields from the allow list instead of merging the request body, and
  //    refuse anything else rather than silently dropping it.
  const submitted = Object.keys(req.body ?? {});
  const forbidden = submitted.filter(
    (field) => !EDITABLE_FIELDS.includes(field as (typeof EDITABLE_FIELDS)[number])
  );
  if (forbidden.length > 0) {
    return res.status(403).send(`These fields are not yours to set: ${forbidden.join(", ")}`);
  }

  // Once a report has left the employee's hands it is no longer theirs to edit.
  if (report.status !== "draft") {
    return res.status(409).send("Only a draft can be edited");
  }

  for (const field of EDITABLE_FIELDS) {
    if (field in req.body) {
      (report as any)[field] = req.body[field];
    }
  }

  return res.status(200).json(report);
});

app.post("/reports/:id/approve", (req: Request, res: Response) => {
  const user = currentUser(req);
  if (!user) return res.status(401).send("Sign in first");

  // 3. The role comes from the session record on the server. A header is just
  //    something the caller typed.
  if (user.role !== "manager") {
    return res.status(403).send("Only managers can approve reports");
  }

  const report = REPORTS[req.params.id];
  if (!report) return res.status(404).send("No such report");

  // A manager approves the people they manage, and never their own spending.
  if (report.employeeId === user.id) {
    return res.status(403).send("You cannot approve your own report");
  }
  if (!user.managerOf.includes(report.employeeId)) {
    return res.status(403).send("You do not manage this employee");
  }

  report.status = "approved";
  return res.status(200).json(report);
});

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  const address = server.address();
  console.log(`Paperwork is running on port ${typeof address === "string" ? address : address?.port}`);
});

export default server;
