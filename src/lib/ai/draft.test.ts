import { describe, expect, it } from "vitest";
import { checkNumbers } from "./draft";

// Regression coverage for the number-safety check: the AI must never be
// allowed to introduce a $ or % figure that isn't in the family's real data.
describe("checkNumbers", () => {
  it("flags a $ or % figure that is not in the source data", () => {
    const allowed = new Set(["$4.2M", "12%"]);
    const warnings = checkNumbers(
      "The portfolio grew to $4.2M this quarter, a stellar 45% jump.",
      allowed,
    );
    expect(warnings.length).toBeGreaterThan(0);
  });

  it("produces no warnings when every figure is in the source data", () => {
    const allowed = new Set(["$4.2M", "12%"]);
    const warnings = checkNumbers(
      "The portfolio grew to $4.2M this quarter, in line with the 12% target.",
      allowed,
    );
    expect(warnings).toEqual([]);
  });
});
