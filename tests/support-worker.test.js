import test from "node:test";
import assert from "node:assert/strict";
import worker from "../worker.js";

const env = {
  ASSETS: {
    fetch: async () =>
      new Response("<html><head></head><body>Support</body></html>", {
        headers: { "Content-Type": "text/html", "X-Frame-Options": "DENY" },
      }),
  },
};
test("only the isolated widget route can be framed by the CMDA websites", async () => {
  const widget = await worker.fetch(
    new Request("https://cmdanigeria.net/support/embed", { headers: { Accept: "text/html" } }),
    env
  );
  assert.match(widget.headers.get("Content-Security-Policy"), /frame-ancestors https:\/\/cmdanigeria.org/);
  assert.equal(widget.headers.get("X-Frame-Options"), null);
  assert.equal(widget.headers.get("Referrer-Policy"), "no-referrer");
  assert.match(widget.headers.get("Cache-Control"), /no-store/);
  assert.ok(!(await widget.text()).includes("CMDA_SW_KILL"));
  const memberPage = await worker.fetch(
    new Request("https://cmdanigeria.net/dashboard", { headers: { Accept: "text/html" } }),
    env
  );
  assert.match(memberPage.headers.get("Content-Security-Policy"), /frame-ancestors 'none'/);
});
