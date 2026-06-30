import { describe, expect, it } from "vitest";
import { cvcValid, expiryValid, luhnValid } from "../lib/validation";

describe("luhnValid", () => {
  it("accepts well-known test PANs (with and without spaces)", () => {
    expect(luhnValid("4242 4242 4242 4242")).toBe(true);
    expect(luhnValid("4242424242424242")).toBe(true);
    expect(luhnValid("5555555555554444")).toBe(true);
  });

  it("rejects numbers that fail the checksum", () => {
    expect(luhnValid("4242424242424241")).toBe(false);
    expect(luhnValid("1234567890123456")).toBe(false);
  });

  it("rejects wrong length or non-digits", () => {
    expect(luhnValid("424242")).toBe(false);
    expect(luhnValid("4242abcd4242abcd")).toBe(false);
    expect(luhnValid("")).toBe(false);
  });
});

describe("expiryValid", () => {
  const now = new Date("2026-06-30T12:00:00Z");

  it("accepts a future expiry", () => {
    expect(expiryValid("12/30", now)).toBe(true);
    expect(expiryValid("06/26", now)).toBe(true); // current month still valid
  });

  it("rejects a past expiry", () => {
    expect(expiryValid("05/26", now)).toBe(false);
    expect(expiryValid("01/20", now)).toBe(false);
  });

  it("rejects bad month or format", () => {
    expect(expiryValid("13/30", now)).toBe(false);
    expect(expiryValid("00/30", now)).toBe(false);
    expect(expiryValid("1230", now)).toBe(false);
    expect(expiryValid("12-30", now)).toBe(false);
  });
});

describe("cvcValid", () => {
  it("accepts 3 or 4 digits", () => {
    expect(cvcValid("123")).toBe(true);
    expect(cvcValid("1234")).toBe(true);
  });
  it("rejects anything else", () => {
    expect(cvcValid("12")).toBe(false);
    expect(cvcValid("12345")).toBe(false);
    expect(cvcValid("12a")).toBe(false);
  });
});
