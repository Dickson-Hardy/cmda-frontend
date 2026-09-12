export const EMAIL_PATTERN = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

export const PASSWORD_PATTERN = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

export const PASSWORD_REQUIREMENT_MESSAGE =
  "Use at least 8 characters with uppercase, lowercase, a number, and a special character";

export const PHONE_NUMBER_NG = /^\d{11}$/; // e.g. 08012345678
