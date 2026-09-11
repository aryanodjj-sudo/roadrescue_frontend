import { MIN_PASSWORD_LENGTH } from "./constants";

// Simple, deliberately permissive email check — good enough to catch
// typos client-side without rejecting valid-but-unusual addresses.
// The browser's type="email" input already does its own check too;
// this is for the extra JS-level validation (e.g. before an API call).
export function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || "").trim());
}

// Accepts optional +country code, spaces, or dashes, requires 7-15 digits
// overall. Deliberately loose — Profile.jsx's phone field is optional
// and international, so this just filters out obvious garbage.
export function isValidPhone(phone) {
  const digitsOnly = String(phone || "").replace(/[\s\-+()]/g, "");
  return /^\d{7,15}$/.test(digitsOnly);
}

export function isValidPassword(password) {
  return String(password || "").length >= MIN_PASSWORD_LENGTH;
}

export function doPasswordsMatch(password, confirmPassword) {
  return password === confirmPassword;
}

// Register.jsx / VehicleFormModal.jsx both need "did the user actually
// type something" checks beyond the browser's `required` attribute
// (e.g. a string of only spaces still passes `required`).
export function isNonEmpty(value) {
  return String(value || "").trim().length > 0;
}

// VehicleFormModal.jsx's year field currently only has min="1980" and a
// dynamic max on the <input>, this mirrors that same range in JS so the
// check can also run before an API call, not just via the HTML attribute.
export function isValidYear(year) {
  const y = Number(year);
  const currentYear = new Date().getFullYear();
  return Number.isInteger(y) && y >= 1980 && y <= currentYear + 1;
}

// Runs a { field: value } object through a { field: validatorFn } map and
// returns a { field: errorMessage } object containing only the failures.
// Lets a form call one function instead of chaining several if-checks.
//
// Example:
//   const errors = validateFields(formData, {
//     email: (v) => (isValidEmail(v) ? null : "Enter a valid email"),
//     password: (v) => (isValidPassword(v) ? null : "Password must be at least 6 characters"),
//   });
//   if (Object.keys(errors).length > 0) { ...show errors... }
export function validateFields(values, rules) {
  const errors = {};
  for (const field of Object.keys(rules)) {
    const message = rules[field](values[field]);
    if (message) errors[field] = message;
  }
  return errors;
}