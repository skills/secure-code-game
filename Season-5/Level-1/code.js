// Welcome to Secure Code Game Season-5/Level-1!

// Follow the instructions below to get started:

// 1. tests.js is passing but the code here is vulnerable
// 2. Review the code. Can you spot the bug(s)?
// 3. Fix code.js but ensure that tests.js still passes
// 4. Run hack.js and if passing then CONGRATS!
// 5. If stuck then read the hints
// 6. Compare your solution with solution.js

const express = require("express");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());

// Mission Control keeps a registry of the observatories we have a contract with.
// The URLs are read from the environment so the same code runs in every region.
const PARTNER_FEEDS = {
  hubble: process.env.HUBBLE_FEED_URL || "https://feeds.hubble.example/telemetry",
  keck: process.env.KECK_FEED_URL || "https://feeds.keck.example/telemetry",
};

// Fetching a URL that an operator typed is risky, so we screen it first.
const BLOCKED_TERMS = ["localhost", "127.0.0.1", "169.254.169.254", "metadata"];

function isSafeUrl(candidate) {
  const normalized = String(candidate).toLowerCase();
  return !BLOCKED_TERMS.some((term) => normalized.includes(term));
}

app.get("/feeds", (req, res) => {
  res.status(200).json({ feeds: Object.keys(PARTNER_FEEDS) });
});

app.post("/telemetry/preview", async (req, res) => {
  const { feed, url } = req.body || {};
  let target;

  if (feed) {
    target = PARTNER_FEEDS[feed];
    if (!target) {
      return res.status(404).send(`Unknown feed: ${feed}`);
    }
  } else if (url) {
    // Operators regularly need to preview a feed from an observatory that has
    // not been registered yet, so we let them paste a custom URL.
    // Don't worry, it is screened before we touch it.
    if (!isSafeUrl(url)) {
      return res.status(403).send("Refused to fetch an internal address");
    }
    target = url;
  } else {
    return res
      .status(400)
      .send("Provide either a registered feed or a custom url");
  }

  try {
    const upstream = await fetch(target);
    const body = await upstream.text();
    res.status(200).set("Content-Type", "text/plain").send(body);
  } catch (error) {
    res.status(502).send(`Could not reach the feed: ${error.message}`);
  }
});

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log(`Mission Control is running on port ${server.address().port}`);
});

module.exports = server;
