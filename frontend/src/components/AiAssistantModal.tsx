/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { Sparkles, X, AlertTriangle, CheckCircle2, Send } from "lucide-react";
import { ClassInfo } from "../types";

interface AiAssistantModalProps {
  classes: ClassInfo[];
  onClose: () => void;
}

export const AiAssistantModal: React.FC<AiAssistantModalProps> = ({ classes, onClose }) => {
  const [selectedClass, setSelectedClass] = useState("all");
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [aiResult, setAiResult] = useState<{
    summary: string;
    atRiskCount: number;
    topAttendanceCount: number;
  } | null>(null);

  const analyzeData = async (customPrompt?: string) => {
    setLoading(true);
    try {
      const res = await fetch("/api/ai/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          classId: selectedClass,
          prompt: customPrompt || prompt,
        }),
      });
      const data = await res.json();
      setAiResult(data);
    } catch (e) {
      console.error("AI Error:", e);
      setAiResult({
        summary: "### 🤖 AI Attendance Advisor\n\n* Unable to reach AI backend service. Please check your API key configuration.\n* **Local Advice:** Monitor Karan Singh (68%) closely.",
        atRiskCount: 2,
        topAttendanceCount: 3,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    analyzeData("Provide an executive health summary of current attendance patterns and identify at-risk students.");
  }, [selectedClass]);

  const quickPrompts = [
    "List students below 75% attendance who need immediate parent notification.",
    "Summarize attendance trends for this week and suggest engagement strategies.",
    "Draft a professional advisory message for faculty regarding chronic absenteeism.",
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-100 dark:border-slate-800 p-6 sm:p-8 space-y-6 animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-purple-500/30">
              <Sparkles className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-extrabold text-slate-800 dark:text-white">Smart AI Assistant</h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className="bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 text-xs px-2 py-0.5 rounded-md font-medium">
                    AI Engine 2.5
                  </span>
                </div>
              </div>
              <p className="text-xs text-slate-500">Automated educational intelligence & drop-off advisory</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Target Class & Quick Stats */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-purple-50/50 dark:bg-slate-800/50 p-4 rounded-2xl border border-purple-100 dark:border-slate-700/60">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-600 dark:text-slate-300">Target Scope:</span>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 focus:outline-none cursor-pointer shadow-sm"
            >
              <option value="all">All Institute Classes</option>
              {classes.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          {aiResult && (
            <div className="flex gap-3 text-xs font-bold">
              <span className="flex items-center gap-1 text-red-600 bg-red-50 dark:bg-red-950/40 px-2.5 py-1 rounded-full border border-red-200 dark:border-red-800">
                <AlertTriangle className="w-3.5 h-3.5" />
                {aiResult.atRiskCount} At-Risk Students
              </span>
              <span className="flex items-center gap-1 text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
                <CheckCircle2 className="w-3.5 h-3.5" />
                {aiResult.topAttendanceCount} High Performers
              </span>
            </div>
          )}
        </div>

        {/* AI Output Window */}
        <div className="min-h-[220px] max-h-[350px] overflow-y-auto p-5 rounded-3xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-3 font-sans">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-48 gap-3 text-slate-500">
              <div className="w-10 h-10 border-4 border-purple-600 border-t-transparent rounded-full animate-spin" />
              <span className="text-xs font-bold animate-pulse">Analyzing attendance vectors & generating advisory...</span>
            </div>
          ) : aiResult ? (
            <div className="space-y-3 text-sm text-slate-700 dark:text-slate-200 leading-relaxed">
              {aiResult.summary.split("\n\n").map((para, idx) => {
                if (para.startsWith("###")) {
                  return (
                    <h4 key={idx} className="font-extrabold text-base text-purple-900 dark:text-purple-300 border-b border-slate-200 dark:border-slate-700 pb-1.5 mt-2">
                      {para.replace("### ", "")}
                    </h4>
                  );
                }
                if (para.startsWith("*") || para.startsWith("-")) {
                  return (
                    <ul key={idx} className="list-disc pl-5 space-y-1 text-xs sm:text-sm">
                      {para.split("\n").map((item, iIdx) => {
                        const text = item.replace(/[*|-]\s+/, "");
                        const parts = text.split(/(\*\*.*?\*\*)/g);
                        return (
                          <li key={iIdx}>
                            {parts.map((part, pIdx) =>
                              part.startsWith("**") && part.endsWith("**") ? (
                                <strong key={pIdx}>{part.slice(2, -2)}</strong>
                              ) : (
                                part
                              )
                            )}
                          </li>
                        );
                      })}
                    </ul>
                  );
                }
                const parts = para.split(/(\*\*.*?\*\*)/g);
                return (
                  <p key={idx}>
                    {parts.map((part, pIdx) =>
                      part.startsWith("**") && part.endsWith("**") ? (
                        <strong key={pIdx}>{part.slice(2, -2)}</strong>
                      ) : (
                        part
                      )
                    )}
                  </p>
                );
              })}
            </div>
          ) : null}
        </div>

        {/* Quick Prompts */}
        <div className="space-y-2">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Suggested AI Queries
          </span>
          <div className="flex flex-wrap gap-2">
            {quickPrompts.map((qp, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setPrompt(qp);
                  analyzeData(qp);
                }}
                className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-purple-50 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 hover:text-purple-700 text-xs font-semibold transition-all text-left flex items-center gap-1.5 border border-slate-200 dark:border-slate-700"
              >
                <Sparkles className="w-3 h-3 text-purple-500 shrink-0" />
                <span className="truncate max-w-xs">{qp}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Custom Input */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (prompt.trim()) analyzeData();
          }}
          className="flex gap-2"
        >
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Ask AI anything about attendance trends, alerts, or reports..."
            className="flex-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-purple-500 outline-none"
          />
          <button
            type="submit"
            disabled={loading || !prompt.trim()}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold rounded-2xl shadow-lg shadow-purple-500/30 active:scale-95 transition-all flex items-center gap-2 text-sm shrink-0"
          >
            <Send className="w-4 h-4" />
            <span>Analyze</span>
          </button>
        </form>
      </div>
    </div>
  );
};
