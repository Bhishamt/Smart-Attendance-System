/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import {
  X,
  Cloud,
  CloudCheck,
  CloudUpload,
  RefreshCw,
  Database,
  Download,
  ShieldCheck,
  CheckCircle,
  ExternalLink,
  AlertCircle,
} from "lucide-react";
import { SettingsState, CloudStorageFile } from "../types";

interface CloudStorageModalProps {
  settings: SettingsState;
  onUpdateSettings: (newSettings: Partial<SettingsState>) => void;
  onClose: () => void;
}

export const CloudStorageModal: React.FC<CloudStorageModalProps> = ({
  settings,
  onUpdateSettings,
  onClose,
}) => {
  const [driveFiles, setDriveFiles] = useState<CloudStorageFile[]>([]);
  const [loadingFiles, setLoadingFiles] = useState(false);
  const [isBackingUp, setIsBackingUp] = useState(false);
  const [isRestoringId, setIsRestoringId] = useState<string | null>(null);
  const [backupSuccessMsg, setBackupSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    if (settings.connectedDriveAccount) {
      fetchDriveFiles();
    }
  }, [settings.connectedDriveAccount]);

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
      alert("Error connecting to Cloud Storage. Please check OAuth credentials.");
    }
  };

  const handleDisconnect = async () => {
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
        alert(data.error || "Backup failed");
      }
    } catch (e) {
      alert("Network error during backup.");
    } finally {
      setIsBackingUp(false);
    }
  };

  const handleRestore = async (file: CloudStorageFile) => {
    if (confirm(`Restore attendance database from Cloud Storage file: ${file.name}?`)) {
      setIsRestoringId(file.id);
      try {
        const res = await fetch(`/api/drive/restore/${file.id}`, { method: "POST" });
        const data = await res.json();
        alert(data.message || "Database restored successfully!");
      } catch (e) {
        alert("Failed to restore database from Drive.");
      } finally {
        setIsRestoringId(null);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full shadow-2xl border border-slate-100 dark:border-slate-800 p-6 sm:p-8 space-y-6 animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-lg shadow-emerald-500/30">
              <CloudCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-slate-800 dark:text-white">Cloud Storage Cloud Sync</h3>
                <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                  Official OAuth
                </span>
              </div>
              <p className="text-xs text-slate-500">Auto-backup database & attendance sheets</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Account Connection Status Card */}
        <div className="p-5 rounded-3xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 flex items-center justify-center overflow-hidden shrink-0">
                {settings.connectedDriveAccount?.photo ? (
                  <img src={settings.connectedDriveAccount.photo} alt="User" className="w-full h-full object-cover" />
                ) : (
                  <img
                    src="https://ui-avatars.com/api/?name=User&background=random"
                    alt="Google"
                    className="w-5 h-5 object-contain"
                  />
                )}
              </div>
              <div>
                <p className="font-bold text-sm text-slate-800 dark:text-white">
                  {settings.connectedDriveAccount ? settings.connectedDriveAccount.name : "Cloud Storage Not Linked"}
                </p>
                <p className="text-xs text-slate-500">
                  {settings.connectedDriveAccount ? settings.connectedDriveAccount.email : "Connect to enable real-time cloud snapshot storage"}
                </p>
              </div>
            </div>
            {settings.connectedDriveAccount && (
              <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" title="Connected" />
            )}
          </div>

          {settings.connectedDriveAccount ? (
            <div className="flex gap-2">
              <button
                onClick={handleBackupNow}
                disabled={isBackingUp}
                className="flex-1 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold rounded-xl shadow-md text-xs flex items-center justify-center gap-1.5 transition-all"
              >
                {isBackingUp ? (
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <CloudUpload className="w-4 h-4" />
                    <span>Backup Database Now</span>
                  </>
                )}
              </button>
              <button
                onClick={handleDisconnect}
                className="px-3 py-2 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold rounded-xl text-xs hover:bg-slate-300"
              >
                Disconnect
              </button>
            </div>
          ) : (
            <button
              onClick={handleConnectDrive}
              className="w-full py-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 hover:bg-slate-50 font-bold rounded-2xl shadow-sm text-slate-800 dark:text-white text-xs flex items-center justify-center gap-2 transition-all"
            >
              <img
                src="https://ui-avatars.com/api/?name=User&background=random"
                alt="Google"
                className="w-4 h-4 object-contain"
              />
              <span>Link Cloud Storage Account</span>
            </button>
          )}

          {backupSuccessMsg && (
            <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 text-xs font-bold flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span>{backupSuccessMsg}</span>
            </div>
          )}
        </div>

        {/* List of Files in Drive */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Cloud Snapshots
            </span>
            {settings.connectedDriveAccount && (
              <button
                onClick={fetchDriveFiles}
                disabled={loadingFiles}
                className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loadingFiles ? "animate-spin" : ""}`} />
                Refresh
              </button>
            )}
          </div>

          {!settings.connectedDriveAccount ? (
            <div className="p-6 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 text-center text-xs text-slate-400">
              Please link your Cloud Storage account above to access and restore cloud backup files.
            </div>
          ) : driveFiles.length === 0 ? (
            <div className="p-6 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 text-center text-xs text-slate-400">
              No cloud snapshots created yet. Click &quot;Backup Database Now&quot; to generate your first backup file.
            </div>
          ) : (
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {driveFiles.map((file) => (
                <div
                  key={file.id}
                  className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 flex items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Database className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
                    <div className="min-w-0">
                      <p className="font-bold text-slate-800 dark:text-white truncate">{file.name}</p>
                      <p className="text-[10px] text-slate-400">
                        {new Date(file.createdTime).toLocaleDateString()} • {file.size || "14 KB"}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleRestore(file)}
                    disabled={isRestoringId === file.id}
                    className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 font-bold text-indigo-600 dark:text-indigo-400 hover:bg-slate-50 transition-all shrink-0 flex items-center gap-1 shadow-sm"
                  >
                    {isRestoringId === file.id ? (
                      <span className="w-3.5 h-3.5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
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

        {/* Footer info */}
        <div className="flex items-center gap-2 text-[11px] text-slate-400 border-t border-slate-100 dark:border-slate-800 pt-4">
          <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
          <span>Files are stored securely in your Cloud Storage under application-specific scope.</span>
        </div>
      </div>
    </div>
  );
};

