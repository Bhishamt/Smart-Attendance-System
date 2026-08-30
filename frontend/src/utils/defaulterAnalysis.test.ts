import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  calculateClassesNeededToTarget,
  evaluateDefaulterRiskTier,
  formatDefaulterSummary,
} from "./defaulterAnalysis.ts";

describe("Frontend Defaulter Analysis Suite", () => {
  it("should calculate additional consecutive classes needed to reach 75% attendance target", () => {
    assert.equal(calculateClassesNeededToTarget(10, 20, 75), 20);
    assert.equal(calculateClassesNeededToTarget(14, 20, 75), 4);
    assert.equal(calculateClassesNeededToTarget(18, 20, 75), 0);
  });

  it("should handle custom target thresholds and zeroed total classes safely", () => {
    assert.equal(calculateClassesNeededToTarget(7, 10, 80), 5);
    assert.equal(calculateClassesNeededToTarget(0, 0, 75), 0);
  });

  it("should categorize student risk tiers based on attendance percentage", () => {
    assert.equal(evaluateDefaulterRiskTier(45, 75, 60), "critical");
    assert.equal(evaluateDefaulterRiskTier(65, 75, 60), "warning");
    assert.equal(evaluateDefaulterRiskTier(85, 75, 60), "satisfactory");
  });

  it("should format defaulter summary statistics text cleanly", () => {
    assert.equal(
      formatDefaulterSummary(5, 20),
      "5 of 20 students (25%) fall below the minimum attendance threshold."
    );
    assert.equal(
      formatDefaulterSummary(0, 25),
      "All 25 students meet or exceed the required attendance threshold."
    );
    assert.equal(
      formatDefaulterSummary(0, 0),
      "No student records available for defaulter analysis."
    );
  });
});
