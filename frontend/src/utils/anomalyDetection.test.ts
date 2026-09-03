/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { evaluateStudentAnomaly, formatAnomalySeverityBadge } from "./anomalyDetection";
import { Student } from "../types";

describe("Frontend Anomaly Detection Utility Suite", () => {
  const sampleStudent: Student = {
    id: "std-test-1",
    name: "Alex Vance",
    rollNo: "1101",
    classId: "cs-3b",
    className: "Computer Science - 3B",
    email: "alex@example.com",
    phone: "1234567890",
    attendancePercent: 60,
    totalClasses: 30,
    presentDays: 18,
    absentDays: 12,
    status: "Absent",
    photo: "photo.jpg",
    biometricRegistered: true,
  };

  it("should categorize critical attendance anomalies accurately", () => {
    const result = evaluateStudentAnomaly(sampleStudent, 75);
    assert.ok(result);
    assert.equal(result?.severity, "critical");
    assert.equal(result?.anomalyType, "CRITICAL_ATTENDANCE");
    assert.ok(result?.summaryMessage.includes("critical attendance"));
  });

  it("should categorize low attendance high risk anomalies", () => {
    const warningStudent = { ...sampleStudent, attendancePercent: 72 };
    const result = evaluateStudentAnomaly(warningStudent, 75);
    assert.ok(result);
    assert.equal(result?.severity, "high");
    assert.equal(result?.anomalyType, "LOW_ATTENDANCE");
  });

  it("should flag unregistered biometric students with medium severity", () => {
    const unregStudent = { ...sampleStudent, attendancePercent: 78, biometricRegistered: false };
    const result = evaluateStudentAnomaly(unregStudent, 75);
    assert.ok(result);
    assert.equal(result?.severity, "medium");
    assert.equal(result?.anomalyType, "UNREGISTERED_BIOMETRIC");
  });

  it("should return null for exemplary students with high attendance", () => {
    const goodStudent = { ...sampleStudent, attendancePercent: 92, biometricRegistered: true };
    const result = evaluateStudentAnomaly(goodStudent, 75);
    assert.equal(result, null);
  });

  it("should format severity badges with appropriate CSS classes", () => {
    const critBadge = formatAnomalySeverityBadge("critical");
    assert.equal(critBadge.label, "CRITICAL");
    assert.ok(critBadge.colorClass.includes("red"));

    const highBadge = formatAnomalySeverityBadge("high");
    assert.equal(highBadge.label, "HIGH RISK");
    assert.ok(highBadge.colorClass.includes("amber"));

    const normBadge = formatAnomalySeverityBadge("unknown");
    assert.equal(normBadge.label, "NORMAL");
  });
});
