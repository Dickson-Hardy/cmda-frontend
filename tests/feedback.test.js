import test from "node:test";
import assert from "node:assert/strict";
import { getApiErrorMessage } from "../src/utilities/getApiErrorMessage.js";

test("network and rate-limit failures have actionable messages", () => {
  assert.match(getApiErrorMessage({ status: "FETCH_ERROR" }), /connection/);
  assert.match(getApiErrorMessage({ name: "AbortError" }), /connection/);
  assert.match(getApiErrorMessage({ status: 429 }), /wait a minute/);
});
test("provider and internal errors never leak technical details", () => {
  assert.equal(
    getApiErrorMessage({ status: 500, data: { message: "Mongo secret" } }),
    "CMDA is temporarily unavailable. Please try again shortly."
  );
  for (const message of ["<html>Bad gateway</html>", "TypeError: undefined", "MongoServerError: duplicate"])
    assert.equal(getApiErrorMessage({ data: { message } }, "Try again."), "Try again.");
});
test("validation arrays are readable and non-string payloads cannot crash feedback", () => {
  assert.equal(
    getApiErrorMessage({ data: { message: ["Enter an email", null, {}, "Add a subject"] } }),
    "Enter an email. Add a subject"
  );
  assert.equal(getApiErrorMessage({ data: { message: { error: "bad" } } }, "Try again."), "Try again.");
  assert.equal(getApiErrorMessage(undefined, "Try again."), "Try again.");
});
test("safe application errors retain their useful context", () => {
  assert.equal(
    getApiErrorMessage({
      status: 409,
      data: { message: "This conversation has changed. Refresh it before replying." },
    }),
    "This conversation has changed. Refresh it before replying."
  );
});
