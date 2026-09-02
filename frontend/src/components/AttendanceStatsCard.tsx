/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { motion } from "motion/react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

export interface AttendanceStatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trendPercent?: number;
  trendDirection?: "up" | "down" | "neutral";
  icon: React.ElementType;
  variant?: "indigo" | "emerald" | "amber" | "rose";
  className?: string;
}

export const AttendanceStatsCard: React.FC<AttendanceStatsCardProps> = ({
  title,
  value,
  subtitle,
  trendPercent,
  trendDirection,
  icon: Icon,
  variant = "indigo",
  className = "",
}) => {
  const variantStyles = {
    indigo: {
      bgIcon: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400",
      border: "border-indigo-500/20",
    },
    emerald: {
      bgIcon: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
      border: "border-emerald-500/20",
    },
    amber: {
      bgIcon: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
      border: "border-amber-500/20",
    },
    rose: {
      bgIcon: "bg-rose-500/10 text-rose-600 dark:text-rose-400",
      border: "border-rose-500/20",
    },
  };

  const style = variantStyles[variant];

  return (
    <motion.div
      whileHover={{ y: -2, transition: { duration: 0.2 } }}
      className={`glass-card relative overflow-hidden rounded-2xl p-5 border ${style.border} ${className}`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
            {title}
          </p>
          <h2 className="mt-1 text-2xl font-extrabold text-slate-900 dark:text-white">
            {value}
          </h2>
        </div>

        <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${style.bgIcon} shadow-sm`}>
          <Icon size={22} />
        </div>
      </div>

      {(subtitle || trendPercent !== undefined) && (
        <div className="mt-4 flex items-center gap-2 text-xs">
          {trendPercent !== undefined && (
            <span
              className={`inline-flex items-center gap-0.5 font-semibold ${
                trendDirection === "up"
                  ? "text-emerald-600 dark:text-emerald-400"
                  : trendDirection === "down"
                  ? "text-rose-600 dark:text-rose-400"
                  : "text-slate-500 dark:text-slate-400"
              }`}
            >
              {trendDirection === "up" && <TrendingUp size={14} />}
              {trendDirection === "down" && <TrendingDown size={14} />}
              {trendDirection === "neutral" && <Minus size={14} />}
              {trendPercent > 0 ? `+${trendPercent}%` : `${trendPercent}%`}
            </span>
          )}
          {subtitle && <span className="text-slate-500 dark:text-slate-400">{subtitle}</span>}
        </div>
      )}
    </motion.div>
  );
};
