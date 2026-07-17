/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { showToast } from "../utils/toast";
import {
  Moon,
  Sun,
  Bell,
  Cloud,
  CloudCheck,
  Key,
  Database,
  Info,
  LogOut,
  ChevronRight,
  ShieldCheck,
  RefreshCw,
  Download,
  Upload,
  CheckCircle,
  Users,
  Plus
} from "lucide-react";
import { SettingsState, CloudStorageFile } from "../types";
import { AddStaffModal } from "../components/AddStaffModal";

interface SettingsViewProps {
  settings: SettingsState;
  currentUser: { email: string; role: string } | null;
  onUpdateSettings: (newSettings: Partial<SettingsState>) => void;
  onLogout: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  settings,
  currentUser,
  onUpdateSettings,
  onLogout,
}) => {
  const [driveFiles, setDriveFiles] = useState<CloudStorageFile[]>([]);
  const [isBackingUp, setIsBackingUp] = useState(false);
  const [isRestoringId, setIsRestoringId] = useState<string | null>(null);
  const [backupSuccessMsg, setBackupSuccessMsg] = useState<string | null>(null);
  const [loadingFiles, setLoadingFiles] = useState(false);
  const [staffList, setStaffList] = useState<any[]>([]);
  const [showStaffModal, setShowStaffModal] = useState(false);

  useEffect(() => {
    if (settings.connectedDriveAccount) {
      fetchDriveFiles();
    }
  }, [settings.connectedDriveAccount]);

  useEffect(() => {
    if (currentUser?.role === "Super Admin") {
      fetchStaff();
    }
  }, [currentUser]);

  const fetchStaff = async () => {
    try {
      const res = await fetch("/api/staff");
      const data = await res.json();
      setStaffList(data);
    } catch (e) {
      console.error("Failed to fetch staff:", e);
    }
  };

  const fetchDriveFiles = async () => {
    setLoadingFiles(true);
    try {
      const res = await fetch("/api/drive/files");
      const data = await res.json();
      setDriveFiles(data.files || []);
    } catch (e) {
      console.error("Failed to fetch drive files:", e);
    } finally {
      setLoadingFiles(false);
    }
  };

  const handleConnectDrive = async () => {
    try {
      const res = await fetch("/api/auth/cloud/url");
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (e) {
      showToast("Error connecting to Cloud Storage. Please ensure OAuth client is configured.");
    }
  };

  const handleDisconnectDrive = async () => {
    if (confirm("Disconnect Cloud Storage account from auto-backup?")) {
      await fetch("/api/auth/cloud/logout", { method: "POST" });
      onUpdateSettings({ connectedDriveAccount: null });
      setDriveFiles([]);
    }
  };

  const handleBackupNow = async () => {
    if (!settings.connectedDriveAccount) {
      handleConnectDrive();
      return;
    }
    setIsBackingUp(true);
    setBackupSuccessMsg(null);
    try {
      const res = await fetch("/api/drive/backup", { method: "POST" });
      const data = await res.json();
      if (data.success) {
        setBackupSuccessMsg(data.message || "Backup uploaded to Cloud Storage!");
        fetchDriveFiles();
      } else {
        showToast(data.error || "Backup failed");
      }
    } catch (e) {
      showToast("Network error during backup.");
    } finally {
      setIsBackingUp(false);
    }
  };

  const handleRestore = async (file: CloudStorageFile) => {
    if (confirm(`Restore attendance database from Cloud Storage file: ${file.name}?\nThis will replace current attendance logs with the snapshot.`)) {
      setIsRestoringId(file.id);
      try {
        const res = await fetch(`/api/drive/restore/${file.id}`, { method: "POST" });
        const data = await res.json();
        showToast(data.message || "Database restored successfully!");
      } catch (e) {
        showToast("Failed to restore database from Drive.");
      } finally {
        setIsRestoringId(null);
      }
    }
  };

  const handleAddStaff = async (staff: any) => {
    try {
      const res = await fetch("/api/staff", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(staff),
      });
      if (res.ok) {
        fetchStaff();
      }
    } catch (e) {
      console.error("Error adding staff:", e);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 space-y-6 animate-in fade-in duration-300 pb-28">
      {showStaffModal && (
        <AddStaffModal onClose={() => setShowStaffModal(false)} onSave={handleAddStaff} />
      )}
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Settings & Preferences</h2>
        <p className="text-xs text-slate-500">Configure application preferences and Cloud Storage cloud backup</p>
      </div>

      {/* Cloud Storage CLOUD INTEGRATION CARD (Highlighted feature!) */}
      <div className="rounded-3xl p-6 bg-gradient-to-br from-indigo-900 via-indigo-800 to-purple-900 text-white shadow-xl relative overflow-hidden space-y-6">
        <div className="absolute -right-10 -top-10 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white shrink-0 shadow-lg">
              <CloudCheck className="w-8 h-8 text-emerald-300" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/10 border border-white/20 text-[10px] font-bold text-emerald-300 uppercase tracking-wider mb-1">
                <ShieldCheck className="w-3 h-3" /> Official Cloud Workspace Integration
              </div>
              <h3 className="text-lg sm:text-xl font-bold">Cloud Storage Cloud Backup</h3>
              <p className="text-xs text-indigo-200">
                {settings.connectedDriveAccount
                  ? `Connected as ${settings.connectedDriveAccount.email}`
                  : "Connect Cloud Storage to auto-sync attendance records & reports."}
              </p>
            </div>
          </div>

          <div className="shrink-0">
            {settings.connectedDriveAccount ? (
              <button
                onClick={handleDisconnectDrive}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-xs font-bold transition-colors"
              >
                Disconnect
              </button>
            ) : (
              <button
                onClick={handleConnectDrive}
                className="px-5 py-3 bg-white text-indigo-900 hover:bg-indigo-50 font-bold rounded-2xl shadow-lg active:scale-95 transition-all text-xs flex items-center gap-2"
              >
                <img
                  src="https://ui-avatars.com/api/?name=User&background=random"
                  alt="Cloud"
                  className="w-4 h-4 object-contain"
                />
                <span>Connect Cloud Storage</span>
              </button>
            )}
          </div>
        </div>

        {/* Backup Action & Status */}
        <div className="pt-4 border-t border-white/10 relative z-10 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <label className="text-xs font-bold flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.autoBackup}
                  onChange={(e) => onUpdateSettings({ autoBackup: e.target.checked })}
                  className="w-4 h-4 rounded text-indigo-600 focus:ring-0 cursor-pointer"
                />
                <span>Automatic Daily Snapshot Sync</span>
              </label>
              <select
                value={settings.backupFrequency}
                onChange={(e) => onUpdateSettings({ backupFrequency: e.target.value })}
                className="bg-white/10 border border-white/20 rounded-xl px-2.5 py-1 text-xs font-bold text-white focus:outline-none"
              >
                <option value="Daily" className="text-slate-900">Daily</option>
                <option value="Weekly" className="text-slate-900">Weekly</option>
                <option value="Monthly" className="text-slate-900">Monthly</option>
              </select>
            </div>

            <button
              onClick={handleBackupNow}
              disabled={isBackingUp}
              className="px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 font-bold rounded-xl shadow-md active:scale-95 transition-all text-xs flex items-center justify-center gap-2"
            >
              {isBackingUp ? (
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  <span>Backup Database Now</span>
                </>
              )}
            </button>
          </div>

          {backupSuccessMsg && (
            <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-400/30 text-emerald-200 text-xs font-bold flex items-center gap-2 animate-in fade-in">
              <CheckCircle className="w-4 h-4 shrink-0 text-emerald-400" />
              <span>{backupSuccessMsg}</span>
            </div>
          )}
        </div>

        {/* List of Drive Backup Files */}
        {settings.connectedDriveAccount && (
          <div className="pt-4 border-t border-white/10 relative z-10 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-200">
                Saved Backup Snapshots in Drive
              </span>
              <button
                onClick={fetchDriveFiles}
                disabled={loadingFiles}
                className="text-xs text-indigo-300 hover:text-white flex items-center gap-1"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loadingFiles ? "animate-spin" : ""}`} /> Refresh
              </button>
            </div>

            {driveFiles.length === 0 ? (
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-center text-xs text-indigo-200">
                No backup files found yet. Click &quot;Backup Database Now&quot; to create your first cloud snapshot.
              </div>
            ) : (
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {driveFiles.map((file) => (
                  <div
                    key={file.id}
                    className="p-3 rounded-2xl bg-white/10 border border-white/10 flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Database className="w-4 h-4 text-indigo-300 shrink-0" />
                      <div className="min-w-0">
                        <p className="font-bold truncate text-white">{file.name}</p>
                        <p className="text-[10px] text-indigo-200">
                          {new Date(file.createdTime).toLocaleDateString()} • {file.size || "14 KB"}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleRestore(file)}
                      disabled={isRestoringId === file.id}
                      className="px-3 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 border border-white/20 font-bold text-white transition-all shrink-0 flex items-center gap-1"
                    >
                      {isRestoringId === file.id ? (
                        <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <>
                          <Download className="w-3.5 h-3.5" />
                          <span>Restore</span>
                        </>
                      )}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Staff Management - Super Admin Only */}
      {currentUser?.role === "Super Admin" && (
        <div className="glass-card rounded-3xl p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <Users className="w-4 h-4" />
              Manage Staff
            </h3>
            <button
              onClick={() => setShowStaffModal(true)}
              className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-lg flex items-center gap-1 hover:bg-indigo-100 transition-colors"
            >
              <Plus className="w-4 h-4" /> Add Staff
            </button>
          </div>
          <div className="space-y-2">
            {staffList.filter(s => s.role !== "Super Admin").length === 0 ? (
              <p className="text-xs text-slate-500">No HOD or Teachers added yet.</p>
            ) : (
              staffList.filter(s => s.role !== "Super Admin").map((staff) => (
                <div key={staff.id} className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 flex justify-between items-center">
                  <div>
                    <p className="font-bold text-sm text-slate-800 dark:text-white">{staff.name}</p>
                    <p className="text-xs text-slate-500">{staff.email} • {staff.department}</p>
                  </div>
                  <span className="text-[10px] font-bold bg-indigo-100 text-indigo-600 px-2 py-1 rounded-full uppercase tracking-wider">
                    {staff.role}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* General Settings List */}
      <div className="glass-card rounded-3xl p-6 shadow-sm space-y-6">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">
          App Configuration
        </h3>

        <div className="space-y-4 divide-y divide-slate-100 dark:divide-slate-800">
          {/* Dark Mode */}
          <div className="flex items-center justify-between pt-4 first:pt-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-slate-800 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                {settings.darkMode ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
              </div>
              <div>
                <h4 className="font-bold text-sm text-slate-800 dark:text-white">Dark / Light Mode</h4>
                <p className="text-xs text-slate-500">Toggle application visual theme</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.darkMode}
                onChange={(e) => onUpdateSettings({ darkMode: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600" />
            </label>
          </div>

          {/* Notifications */}
          <div className="flex items-center justify-between pt-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-purple-50 dark:bg-slate-800 flex items-center justify-center text-purple-600 dark:text-purple-400">
                <Bell className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-slate-800 dark:text-white">Push Notifications</h4>
                <p className="text-xs text-slate-500">Alerts for attendance drop-offs & reports</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.notifications}
                onChange={(e) => onUpdateSettings({ notifications: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600" />
            </label>
          </div>

          {/* Change Password */}
          <div
            onClick={() => showToast("Password reset verification link sent to admin@institute.edu")}
            className="flex items-center justify-between pt-4 cursor-pointer group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-slate-800 flex items-center justify-center text-blue-600 dark:text-blue-400">
                <Key className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-slate-800 dark:text-white group-hover:text-indigo-600 transition-colors">
                  Change Password
                </h4>
                <p className="text-xs text-slate-500">Update admin login security credentials</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
          </div>

          {/* About App */}
          <div
            onClick={() => showToast("Smart Attendance Management System v2.5.0\nBuilt with React, Vite, Tailwind CSS, Express & Smart AI Assistant.")}
            className="flex items-center justify-between pt-4 cursor-pointer group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-50 dark:bg-slate-800 flex items-center justify-center text-amber-600 dark:text-amber-400">
                <Info className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-slate-800 dark:text-white group-hover:text-indigo-600 transition-colors">
                  About App
                </h4>
                <p className="text-xs text-slate-500">Version 2.5.0 • Python / Node Full-stack</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
          </div>
        </div>
      </div>

      {/* Logout Action */}
      <div>
        <button
          onClick={onLogout}
          className="w-full py-4 bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 font-extrabold rounded-3xl border border-red-200 dark:border-red-900/60 hover:bg-red-100 transition-all flex items-center justify-center gap-2 shadow-sm"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout from Portal</span>
        </button>
      </div>
    </div>
  );
};

