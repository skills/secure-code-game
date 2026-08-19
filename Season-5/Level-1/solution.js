// This is one possible solution. There are several others.

// The lesson: a blocklist of suspicious looking strings can never decide where a
// request will actually end up. `127.1`, `0x7f000001` and `2130706433` all resolve
// to 127.0.0.1, and a redirect moves the destination after the check has run.
// The only reliable fix is to stop letting the caller choose the destination:
// accept an identifier, resolve it against a server-side allow list, and make sure
// the response really came from the host that was allowed.

const express = require("express");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());

const PARTNER_FEEDS = {
  hubble: process.env.HUBBLE_FEED_URL || "https://feeds.hubble.example/telemetry",
  keck: process.env.KECK_FEED_URL || "https://feeds.keck.example/telemetry",
};

app.get("/feeds", (req, res) => {
  res.status(200).json({ feeds: Object.keys(PARTNER_FEEDS) });
});

app.post("/telemetry/preview", async (req, res) => {
  const { feed, url } = req.body || {};

  // 1. The server, not the caller, decides which hosts may be contacted.
  //    An arbitrary URL is never a valid input, so say so explicitly instead of
  //    trying to sanitize it.
  if (url) {
    return res
      .status(403)
      .send("Custom feed URLs are not accepted. Use a registered feed id.");
  }

  if (!feed) {
    return res.status(400).send("Provide a registered feed id");
  }

  // 2. Indirect reference: the id is only ever used to look up a known URL.
  const target = PARTNER_FEEDS[feed];
  if (!target) {
    return res.status(404).send(`Unknown feed: ${feed}`);
  }

  try {
    // 3. Redirects are followed automatically by fetch and would move the request
    //    to a host that was never allowed, so handle them ourselves.
    const upstream = await fetch(target, { redirect: "manual" });

    if (upstream.status >= 300 && upstream.status < 400) {
      return res.status(502).send("Refused to follow a redirect away from the feed");
    }

    const body = await upstream.text();
    res.status(200).set("Content-Type", "text/plain").send(body);
  } catch (error) {
    res.status(502).send(`Could not reach the feed: ${error.message}`);
  }
});

// Worth knowing: when a service genuinely has to fetch user supplied URLs (a
// webhook tester, a link preview), an allow list is not enough on its own. You
// also resolve the hostname yourself, reject every address that falls in a
// loopback, private, link-local or unspecified range, and pin the connection to
// the address you validated so DNS cannot change under you between the check and
// the request.

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log(`Mission Control is running on port ${server.address().port}`);
});

module.exports = server;
