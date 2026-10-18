import test from "node:test";
import assert from "node:assert/strict";
import { mergePage, pageItems } from "../src/utilities/pagedResults.js";
import { shouldNotifyFailure } from "../src/utilities/queryFeedbackPolicy.js";

const rejected = (type = "query", extra = {}) => ({
  type: "api/executeQuery/rejected",
  payload: { status: 503 },
  meta: { arg: { type, endpointName: "getMembers", ...extra } },
});

test("pages retain earlier results, replace refetched pages and deduplicate IDs", () => {
  let state = { key: "a", pages: {}, totalPages: 0 };
  state = mergePage(state, "a", 1, { items: [{ _id: "1", name: "old" }], meta: { totalPages: 2 } });
  state = mergePage(state, "a", 2, { items: [{ _id: "1", name: "new" }, { _id: "2" }], meta: { totalPages: 2 } });
  assert.deepEqual(pageItems(state, "a"), [{ _id: "1", name: "new" }, { _id: "2" }]);
  state = mergePage(state, "a", 2, { items: [{ _id: "3" }], meta: { totalPages: 2 } });
  assert.deepEqual(
    pageItems(state, "a").map((x) => x._id),
    ["1", "3"]
  );
});

test("filter changes never display or merge a previous filter's results", () => {
  const old = { key: "a", pages: { 1: [{ _id: "old" }] }, totalPages: 3 };
  assert.deepEqual(pageItems(old, "b"), []);
  const next = mergePage(old, "b", 1, { items: [{ _id: "new" }], meta: { totalPages: 1 } });
  assert.deepEqual(pageItems(next, "b"), [{ _id: "new" }]);
  assert.equal(mergePage(next, "b", 2, undefined), next);
});

test("first-load query failures notify, but locally handled and repeat failures do not", () => {
  assert.equal(shouldNotifyFailure(rejected()), true);
  assert.equal(shouldNotifyFailure(rejected(), { data: [] }), false);
  assert.equal(shouldNotifyFailure(rejected(), { error: {} }), false);
  assert.equal(shouldNotifyFailure(rejected("query", { originalArgs: { feedbackHandled: true } })), false);
  assert.equal(shouldNotifyFailure(rejected("mutation")), true);
  assert.equal(shouldNotifyFailure({ ...rejected(), meta: { aborted: true } }), false);
  assert.equal(shouldNotifyFailure({ ...rejected(), meta: { baseQueryMeta: { handlesError: true } } }), false);
});
