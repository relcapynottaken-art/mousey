import { describe, expect, it } from "vitest";
import { buildBasePrompt } from "../lib/prompt";
import { sampleDesignSystem } from "../lib/sample";

describe("buildBasePrompt", () => {
  const prompt = buildBasePrompt(sampleDesignSystem);

  it("embeds the reference source and concrete design values", () => {
    expect(prompt).toContain(sampleDesignSystem.source.title);
    expect(prompt).toContain(sampleDesignSystem.typography.headingFont);
    expect(prompt).toContain(sampleDesignSystem.colors.accent[0]);
  });

  it("preserves the section order as a numbered list", () => {
    expect(prompt).toContain(`1. ${sampleDesignSystem.layout.sectionOrder[0]}`);
  });

  it("instructs the builder not to copy the original copy", () => {
    expect(prompt.toLowerCase()).toContain("do not");
  });
});
