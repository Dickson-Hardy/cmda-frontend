import test from "node:test";
import assert from "node:assert/strict";
import { getSignupBirthDateLimit, validateSignupDateOfBirth } from "../src/utilities/signupDateOfBirth.js";

const today = new Date(2026, 9, 18);
test("DOB is optional; provided dates retain the 14-year minimum", () => {
  assert.equal(validateSignupDateOfBirth("", today), true);
  assert.equal(validateSignupDateOfBirth(undefined, today), true);
  assert.equal(getSignupBirthDateLimit(today), "2012-10-18");
  assert.equal(getSignupBirthDateLimit(new Date(2024, 1, 29)), "2010-02-28");
  assert.equal(validateSignupDateOfBirth("2012-10-18", today), true);
  assert.equal(validateSignupDateOfBirth("2012-10-19", today), "You must be at least 14 years old.");
  assert.equal(validateSignupDateOfBirth("2030-01-01", today), "You must be at least 14 years old.");
});
test("DOB rejects malformed and nonexistent dates without timezone shifts", () => {
  assert.equal(validateSignupDateOfBirth("2000-02-29", today), true);
  for (const value of ["2001-02-29", "2010-04-31", "2010-13-01", "01/01/2000", {}, "2000-1-1"]) {
    assert.equal(validateSignupDateOfBirth(value, today), "Choose a valid date of birth.");
  }
});
