export interface DefaulterCalculationInput {
  presentDays: number;
  totalClasses: number;
  targetThresholdPercent?: number;
  criticalThresholdPercent?: number;
}

export type DefaulterRiskTier = "critical" | "warning" | "satisfactory";

/**
 * Calculates the minimum number of consecutive additional classes a student
 * must attend to reach or exceed the target attendance percentage threshold.
 */
export function calculateClassesNeededToTarget(
  presentDays: number,
  totalClasses: number,
  targetThresholdPercent: number = 75
): number {
  const safeTotal = Math.max(0, totalClasses || 0);
  const safePresent = Math.max(0, presentDays || 0);
  const target = Math.max(1, Math.min(99, Math.round(targetThresholdPercent)));

  if (safeTotal === 0) return 0;
  const num = target * safeTotal - 100 * safePresent;
  const den = 100 - target;

  if (num <= 0 || den <= 0) return 0;
  return Math.ceil(num / den);
}

/**
 * Evaluates the risk tier for a given attendance percentage based on target and critical thresholds.
 */
export function evaluateDefaulterRiskTier(
  attendancePercent: number,
  targetThresholdPercent: number = 75,
  criticalThresholdPercent: number = 60
): DefaulterRiskTier {
  const percent = Math.max(0, Math.min(100, attendancePercent || 0));
  if (percent < criticalThresholdPercent) {
    return "critical";
  }
  if (percent < targetThresholdPercent) {
    return "warning";
  }
  return "satisfactory";
}

/**
 * Formats human-readable defaulter summary statistics.
 */
export function formatDefaulterSummary(defaulterCount: number, totalStudents: number): string {
  if (!totalStudents || totalStudents <= 0) {
    return "No student records available for defaulter analysis.";
  }
  if (defaulterCount === 0) {
    return `All ${totalStudents} students meet or exceed the required attendance threshold.`;
  }
  const percent = Math.round((defaulterCount / totalStudents) * 100);
  return `${defaulterCount} of ${totalStudents} students (${percent}%) fall below the minimum attendance threshold.`;
}
