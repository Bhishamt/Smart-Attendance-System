/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  evaluateEligibilityStatus,
  calculateMinRequiredClasses,
  evaluateStudentForecasting,
  formatEligibilityBadge,
} from "./attendanceForecasting";
import { Student } from "../types";

describe("Frontend Attendance Forecasting Utility Suite", () => {
  const sampleStudent: Student = {
    id: "std-fc-100",
    name: "Rachel Green",
    rollNo: "2001",
    classId: "cs-3b",
    className: "Computer Science - 3B",
    email: "rachel@example.com",
    phone: "+91 9888888888",
    attendancePercent: 70,
    totalClasses: 30,
    presentDays: 21,
    absentDays: 9,
    status: "Present",
    photo: "photo.jpg",
    biometricRegistered: true,
  };

  it("should evaluate eligibility status accurately", () => {
    assert.equal(evaluateEligibilityStatus(90, 93, 75), "ELIGIBLE");
    assert.equal(evaluateEligibilityStatus(70, 78, 75), "AT_RISK");
    assert.equal(evaluateEligibilityStatus(40, 55, 75), "INELIGIBLE");
  });

  it("should calculate minimum required future classes", () => {
    const needed = calculateMinRequiredClasses(21, 30, 10, 75);
    assert.equal(needed, 9);

    const zeroNeeded = calculateMinRequiredClasses(35, 30, 10, 75);
    assert.equal(zeroNeeded, 0);
  });

  it("should evaluate student forecasting summary accurately", () => {
    const summary = evaluateStudentForecasting(sampleStudent, 10, 75);
    assert.ok(summary);
    assert.equal(summary?.status, "AT_RISK");
    assert.equal(summary?.minClassesToAttend, 9);
    assert.equal(summary?.currentPercent, 70);
    assert.equal(summary?.maxPossiblePercent, 78);
    assert.ok(summary?.statusMessage.includes("Needs 9 of next 10 classes"));
  });

  it("should format eligibility badges with correct styling classes", () => {
    const eligible = formatEligibilityBadge("ELIGIBLE");
    assert.equal(eligible.label, "ELIGIBLE");
    assert.ok(eligible.badgeClass.includes("emerald"));

    const atRisk = formatEligibilityBadge("AT_RISK");
    assert.equal(atRisk.label, "AT RISK");
    assert.ok(atRisk.badgeClass.includes("amber"));

    const ineligible = formatEligibilityBadge("INELIGIBLE");
    assert.equal(ineligible.label, "INELIGIBLE");
    assert.ok(ineligible.badgeClass.includes("rose"));

    const unknown = formatEligibilityBadge("OTHER" as any);
    assert.equal(unknown.label, "UNKNOWN");
  });
});
