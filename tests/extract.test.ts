import { describe, expect, it } from "vitest";
import { classifyDensity, rgbToHex, topN } from "../lib/extract";

describe("rgbToHex", () => {
  it("converts opaque rgb()", () => {
    expect(rgbToHex("rgb(255, 0, 0)")).toBe("#ff0000");
    expect(rgbToHex("rgb(0, 128, 255)")).toBe("#0080ff");
  });

  it("preserves a non-opaque alpha as 8-digit hex (legacy comma form)", () => {
    expect(rgbToHex("rgba(0, 0, 0, 0.5)")).toBe("#00000080");
  });

  it("handles the modern space form with percentage alpha", () => {
    expect(rgbToHex("rgb(0 0 0 / 50%)")).toBe("#00000080");
  });

  it("drops a fully-opaque alpha so it doesn't differ from rgb()", () => {
    expect(rgbToHex("rgba(255, 255, 255, 1)")).toBe("#ffffff");
  });

  it("passes through values it cannot parse", () => {
    expect(rgbToHex("transparent")).toBe("transparent");
    expect(rgbToHex("var(--x)")).toBe("var(--x)");
  });
});

describe("topN", () => {
  it("returns the most frequent items, most-common first", () => {
    expect(topN(["a", "b", "a", "c", "a", "b"], 2)).toEqual(["a", "b"]);
  });
  it("dedupes and respects the limit", () => {
    expect(topN(["x", "x", "x"], 3)).toEqual(["x"]);
  });
});

describe("classifyDensity", () => {
  it("buckets average padding into density", () => {
    expect(classifyDensity(8)).toBe("compact");
    expect(classifyDensity(24)).toBe("comfortable");
    expect(classifyDensity(60)).toBe("spacious");
  });
});
