/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from "react";
import { GraduationCap, ArrowRight, ShieldCheck, Sparkles } from "lucide-react";

interface SplashViewProps {
  onEnter: () => void;
}

export const SplashView: React.FC<SplashViewProps> = ({ onEnter }) => {
  const [loadingProgress, setLoadingProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setLoadingProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          return 100;
        }
        return prev + 5;
      });
    }, 40);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-indigo-900 via-indigo-800 to-purple-900 text-white p-6">
      {/* Decorative blurs */}
      <div className="absolute -top-20 -left-20 w-96 h-96 bg-purple-500/30 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-indigo-500/30 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center text-center max-w-lg mx-auto">
        {/* Logo Animation */}
        <div className="relative mb-8 flex items-center justify-center">
          <div className="pulse-ring w-48 h-48 border border-white/20" />
          <div className="pulse-ring w-64 h-64 border border-white/10" style={{ animationDelay: "1s" }} />

          <div className="animate-float relative z-20 w-32 h-32 rounded-3xl bg-gradient-to-tr from-white/20 to-white/5 backdrop-blur-xl border border-white/30 shadow-2xl flex items-center justify-center">
            <GraduationCap className="w-16 h-16 text-white drop-shadow-md" />
          </div>
        </div>

        {/* Title & Subtitle */}
        <div className="space-y-3 mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs font-semibold uppercase tracking-widest text-indigo-200">
            <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-spin" />
            Modern • Fast • Secure
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight">
            Smart Attendance <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-200 via-purple-200 to-pink-200">
              Management System
            </span>
          </h1>
          <p className="text-white/80 text-sm sm:text-base font-medium tracking-[0.15em] uppercase">
            Track • Manage • Analyze
          </p>
        </div>

        {/* Loading / Action Section */}
        <div className="w-full max-w-xs flex flex-col items-center gap-4">
          <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden border border-white/20">
            <div
              className="bg-gradient-to-r from-indigo-400 to-pink-400 h-full rounded-full transition-all duration-100"
              style={{ width: `${loadingProgress}%` }}
            />
          </div>

          {loadingProgress < 100 ? (
            <span className="text-white/60 text-xs font-semibold uppercase tracking-widest animate-pulse">
              Initializing System ({loadingProgress}%)
            </span>
          ) : (
            <button
              onClick={onEnter}
              className="w-full py-4 px-8 bg-white text-indigo-900 hover:bg-indigo-50 font-bold rounded-2xl shadow-2xl shadow-black/40 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 group"
            >
              <span>Enter Portal</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          )}
        </div>

        {/* Footer Info */}
        <div className="mt-12 flex items-center gap-6 text-xs text-white/50 font-medium">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-4 h-4 text-emerald-400" /> Cloud Sync Ready
          </span>
        </div>
      </div>
    </div>
  );
};

