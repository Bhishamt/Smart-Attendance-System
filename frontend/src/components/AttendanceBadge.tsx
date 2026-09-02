/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { CheckCircle2, XCircle, Clock, AlertTriangle, ShieldAlert, HeartPulse } from "lucide-react";
import { Student } from "../types";

export type RiskTier = "Good" | "Watch" | "At Risk";

export interface AttendanceBadgeProps {
  status?: Student["status"];
  attendancePercent?: number;
  riskTier?: RiskTier;
  size?: "sm" | "md" | "lg";
  showIcon?: boolean;
  className?: string;
}

export const AttendanceBadge: React.FC<AttendanceBadgeProps> = ({
  status,
  attendancePercent,
  riskTier,
  size = "md",
  showIcon = true,
  className = "",
}) => {
  // Determine risk tier if percentage provided
  let computedRiskTier: RiskTier | undefined = riskTier;
  if (computedRiskTier === undefined && attendancePercent !== undefined) {
    if (attendancePercent >= 75) computedRiskTier = "Good";
    else if (attendancePercent >= 65) computedRiskTier = "Watch";
    else computedRiskTier = "At Risk";
  }

  // Size styling classes
  const sizeClasses = {
    sm: "px-2 py-0.5 text-xs gap-1",
    md: "px-2.5 py-1 text-xs font-medium gap-1.5",
    lg: "px-3 py-1.5 text-sm font-semibold gap-2",
  };

  const iconSizes = {
    sm: 12,
    md: 14,
    lg: 16,
  };

  // Status Badge rendering
  if (status) {
    const statusConfigs = {
      Present: {
        bg: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
        icon: CheckCircle2,
        label: "Present",
      },
      Absent: {
        bg: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
        icon: XCircle,
        label: "Absent",
      },
      Late: {
        bg: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
        icon: Clock,
        label: "Late",
      },
      Medical: {
        bg: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20",
        icon: HeartPulse,
        label: "Medical",
      },
    };

    const config = statusConfigs[status] || statusConfigs.Present;
    const IconComponent = config.icon;

    return (
      <span
        className={`inline-flex items-center rounded-full border backdrop-blur-sm transition-all duration-200 ${sizeClasses[size]} ${config.bg} ${className}`}
      >
        {showIcon && <IconComponent size={iconSizes[size]} className="shrink-0" />}
        <span>{config.label}</span>
      </span>
    );
  }

  // Risk Tier Badge rendering
  if (computedRiskTier) {
    const riskConfigs = {
      Good: {
        bg: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
        icon: CheckCircle2,
        label: "Good Standing",
      },
      Watch: {
        bg: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
        icon: AlertTriangle,
        label: "Watch List",
      },
      "At Risk": {
        bg: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
        icon: ShieldAlert,
        label: "At Risk (Defaulter)",
      },
    };

    const config = riskConfigs[computedRiskTier];
    const IconComponent = config.icon;

    return (
      <span
        className={`inline-flex items-center rounded-full border backdrop-blur-sm transition-all duration-200 ${sizeClasses[size]} ${config.bg} ${className}`}
      >
        {showIcon && <IconComponent size={iconSizes[size]} className="shrink-0" />}
        <span>
          {config.label}
          {attendancePercent !== undefined && ` (${attendancePercent}%)`}
        </span>
      </span>
    );
  }

  return null;
};
