/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { CheckCircle2, XCircle, Clock, Download, X, CheckSquare } from "lucide-react";
import { Student } from "../types";

export interface QuickAttendanceBarProps {
  selectedCount: number;
  totalCount: number;
  onSelectAll?: () => void;
  onClearSelection?: () => void;
  onMarkBulkStatus?: (status: Student["status"]) => void;
  onExportCSV?: () => void;
  className?: string;
}

export const QuickAttendanceBar: React.FC<QuickAttendanceBarProps> = ({
  selectedCount,
  totalCount,
  onSelectAll,
  onClearSelection,
  onMarkBulkStatus,
  onExportCSV,
  className = "",
}) => {
  if (selectedCount === 0) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 50, opacity: 0 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
        className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-40 flex items-center gap-3 rounded-2xl bg-slate-900/90 text-white p-3 shadow-2xl backdrop-blur-xl border border-slate-700/60 max-w-xl w-[92vw] sm:w-auto ${className}`}
      >
        {/* Selected Counter & Checkbox badge */}
        <div className="flex items-center gap-2 pl-2 pr-3 border-r border-slate-700/80">
          <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-indigo-500 font-semibold text-xs text-white">
            {selectedCount}
          </span>
          <span className="text-xs font-medium text-slate-300 hidden sm:inline">
            selected of {totalCount}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1.5 flex-1 justify-center sm:justify-start">
          {onMarkBulkStatus && (
            <>
              <button
                type="button"
                onClick={() => onMarkBulkStatus("Present")}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 text-xs font-medium transition-colors"
              >
                <CheckCircle2 size={14} />
                <span className="hidden xs:inline">Present</span>
              </button>

              <button
                type="button"
                onClick={() => onMarkBulkStatus("Absent")}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 text-xs font-medium transition-colors"
              >
                <XCircle size={14} />
                <span className="hidden xs:inline">Absent</span>
              </button>

              <button
                type="button"
                onClick={() => onMarkBulkStatus("Late")}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 text-xs font-medium transition-colors"
              >
                <Clock size={14} />
                <span className="hidden xs:inline">Late</span>
              </button>
            </>
          )}

          {onExportCSV && (
            <button
              type="button"
              onClick={onExportCSV}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-indigo-500/20 text-indigo-300 hover:bg-indigo-500/30 text-xs font-medium transition-colors"
            >
              <Download size={14} />
              <span className="hidden sm:inline">Export</span>
            </button>
          )}
        </div>

        {/* Select All & Clear Buttons */}
        <div className="flex items-center gap-1 pl-2 border-l border-slate-700/80">
          {onSelectAll && selectedCount < totalCount && (
            <button
              type="button"
              onClick={onSelectAll}
              title="Select All"
              className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors"
            >
              <CheckSquare size={16} />
            </button>
          )}

          {onClearSelection && (
            <button
              type="button"
              onClick={onClearSelection}
              title="Clear Selection"
              className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
