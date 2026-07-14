/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { ActiveTab, Student, ClassInfo, AttendanceActivity, SettingsState, DashboardStats } from "./types";
import { Navbar } from "./components/Navbar";
import { BottomNav } from "./components/BottomNav";
import { Sidebar } from "./components/Sidebar";
import { SplashView } from "./screens/SplashView";
import { AuthView } from "./screens/AuthView";
import { DashboardView } from "./screens/DashboardView";
import { MarkAttendanceView } from "./screens/MarkAttendanceView";
import { StudentsView } from "./screens/StudentsView";
import { StudentProfileView } from "./screens/StudentProfileView";
import { CalendarHistoryView } from "./screens/CalendarHistoryView";
import { AnalyticsView } from "./screens/AnalyticsView";
import { SettingsView } from "./screens/SettingsView";
import { AddStudentModal } from "./components/AddStudentModal";
import { AiAssistantModal } from "./components/AiAssistantModal";
import { CloudStorageModal } from "./components/CloudStorageModal";
import confetti from "canvas-confetti";

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("splash");
  const [currentUser, setCurrentUser] = useState<{ email: string; role: string } | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [classes, setClasses] = useState<ClassInfo[]>([]);
  const [activities, setActivities] = useState<AttendanceActivity[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [settings, setSettings] = useState<SettingsState>({
    darkMode: false,
    notifications: true,
    autoBackup: true,
    backupFrequency: "Daily",
    connectedDriveAccount: null,
  });

  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);
  const [showAiModal, setShowAiModal] = useState(false);
  const [showDriveModal, setShowDriveModal] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Check URL params on startup (for OAuth Drive redirection)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("drive_connected") === "true") {
      setActiveTab("dashboard");
      setToastMessage("☁️ Cloud Storage successfully linked for cloud backups!");
      window.history.replaceState({}, document.title, "/");
      setShowDriveModal(true);
    } else if (params.get("drive_error")) {
      setToastMessage(`⚠️ Drive Sync Error: ${params.get("drive_error")}`);
      window.history.replaceState({}, document.title, "/");
    }
  }, []);

  // Fetch initial data from server
  useEffect(() => {
    fetchData();
  }, []);

  // Apply dark mode to root html tag
  useEffect(() => {
    if (settings.darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [settings.darkMode]);

  const fetchData = async () => {
    try {
      const [stdRes, clsRes, actRes, statRes, setRes] = await Promise.all([
        fetch("/api/students"),
        fetch("/api/classes"),
        fetch("/api/activities"),
        fetch("/api/dashboard"),
        fetch("/api/settings"),
      ]);

      if (stdRes.ok) setStudents(await stdRes.json());
      if (clsRes.ok) setClasses(await clsRes.json());
      if (actRes.ok) setActivities(await actRes.json());
      if (statRes.ok) setStats(await statRes.json());
      if (setRes.ok) setSettings(await setRes.json());
    } catch (e) {
      console.error("Error fetching data from API:", e);
    }
  };

  const handleSaveAttendance = async (
    records: { id: string; status: string }[],
    classId: string,
    dateStr: string
  ) => {
    try {
      const res = await fetch("/api/attendance/mark", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ records, classId, date: dateStr }),
      });
      if (res.ok) {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
        setToastMessage(`🎉 Attendance saved for ${records.length} students!`);
        fetchData();
      } else {
        setToastMessage("⚠️ Failed to save attendance. Please try again.");
      }
    } catch (e) {
      console.error("Error saving attendance:", e);
      setToastMessage("⚠️ Network error while saving attendance.");
    }
  };

  const handleAddStudent = async (studentData: any) => {
    try {
      const res = await fetch("/api/students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(studentData),
      });
      if (res.ok) {
        const newStudent = await res.json();
        setStudents((prev) => [newStudent, ...prev]);
        setToastMessage(`✅ Registered student: ${newStudent.name}`);
        confetti({ particleCount: 50, spread: 50, origin: { y: 0.5 } });
        fetchData();
      } else {
        setToastMessage("⚠️ Failed to add student. Please try again.");
      }
    } catch (e) {
      console.error("Error adding student:", e);
      setToastMessage("⚠️ Network error while adding student.");
    }
  };

  const handleAddSubject = async (classId: string, subjectName: string, semester: string) => {
    try {
      const res = await fetch(`/api/classes/${classId}/subjects`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subjectName, semester }),
      });
      if (res.ok) {
        setToastMessage(`📚 Added subject "${subjectName}" to semester!`);
        fetchData();
      }
    } catch (e) {
      console.error("Error adding subject:", e);
    }
  };

  const handleUpdateSettings = async (newSettings: Partial<SettingsState>) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    try {
      await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newSettings),
      });
    } catch (e) {
      console.error("Error updating settings:", e);
    }
  };

  const handleApproveStudent = async (id: string) => {
    try {
      const res = await fetch(`/api/students/${id}/approve`, {
        method: "POST"
      });
      if (res.ok) {
        setToastMessage("✅ Student approved successfully!");
        fetchData();
      }
    } catch (e) {
      console.error("Error approving student:", e);
    }
  };

  const handleSelectStudent = (id: string) => {
    setSelectedStudentId(id);
    setActiveTab("profile");
  };

  // Toast auto-hide
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  if (activeTab === "splash") {
    return <SplashView onEnter={() => setActiveTab("auth")} />;
  }

  if (activeTab === "auth") {
    return (
      <AuthView
        onLoginSuccess={(user) => {
          setCurrentUser(user);
          setToastMessage(`Welcome back, ${user.role}! Loaded institute workspace.`);
          setActiveTab("dashboard");
        }}
        onCloudAuth={async () => {
          try {
            const res = await fetch("/api/auth/cloud/url");
            const data = await res.json();
            if (data.url) window.location.href = data.url;
          } catch (e) {
            alert("Unable to launch OAuth flow. Connecting in simulation mode.");
            window.location.href = "/api/auth/cloud/simulate";
          }
        }}
      />
    );
  }

  const selectedStudent = selectedStudentId
    ? students.find((s) => s.id === selectedStudentId || s.rollNo === selectedStudentId) || null
    : null;

  const filteredClasses = currentUser?.role !== "Super Admin" && currentUser?.department
    ? classes.filter(c => c.dept === currentUser.department)
    : classes;

  const classIds = new Set(filteredClasses.map(c => c.id));
  const filteredStudents = currentUser?.role !== "Super Admin" && currentUser?.department
    ? students.filter(s => classIds.has(s.classId))
    : students;
    
  const filteredActivities = currentUser?.role !== "Super Admin" && currentUser?.department
    ? activities.filter(a => filteredClasses.some(c => a.subtitle.includes(c.name)))
    : activities;

  let filteredStats = stats;
  if (stats && currentUser?.role !== "Super Admin" && currentUser?.department) {
    const totalStudents = filteredStudents.length;
    const todayPresent = filteredStudents.filter(s => s.status === "Present").length;
    const todayAbsent = totalStudents - todayPresent;
    const attendancePercent = totalStudents ? Math.round((todayPresent / totalStudents) * 100) : 0;
    
    filteredStats = {
      ...stats,
      totalStudents,
      todayPresent,
      todayAbsent,
      attendancePercent,
      topClasses: stats.topClasses.filter(tc => filteredClasses.some(fc => fc.name === tc.name))
    };
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white transition-colors">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-4 z-50 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-2xl border border-slate-700 text-xs sm:text-sm font-bold flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-300">
          <span>{toastMessage}</span>
          <button
            onClick={() => setToastMessage(null)}
            className="text-slate-400 hover:text-white font-mono ml-2"
          >
            ✕
          </button>
        </div>
      )}

      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        settings={settings}
        onOpenAi={() => setShowAiModal(true)}
        onOpenDrive={() => setShowDriveModal(true)}
        onLogout={() => {
          setCurrentUser(null);
          setActiveTab("auth");
        }}
      />

      {/* Main Body Layout with Desktop Sidebar */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          settings={settings}
          onOpenDrive={() => setShowDriveModal(true)}
          onLogout={() => {
            setCurrentUser(null);
            setActiveTab("auth");
          }}
        />

        <main className="flex-1 min-w-0">
          {activeTab === "dashboard" && (
            <DashboardView
              stats={filteredStats}
              activities={filteredActivities}
              setActiveTab={setActiveTab}
              onOpenAddStudent={() => setShowAddStudentModal(true)}
              onOpenMarkAttendance={() => setActiveTab("mark")}
              onOpenDriveModal={() => setShowDriveModal(true)}
              onOpenAi={() => setShowAiModal(true)}
            />
          )}

          {activeTab === "students" && (
            <StudentsView
              students={filteredStudents}
              classes={filteredClasses}
              currentUser={currentUser}
              onSelectStudent={handleSelectStudent}
              onApproveStudent={handleApproveStudent}
              onOpenAddStudent={() => setShowAddStudentModal(true)}
            />
          )}

          {activeTab === "profile" && (
            <StudentProfileView
              student={selectedStudent}
              onBack={() => setActiveTab("students")}
              onViewHistory={(id) => {
                setSelectedStudentId(id);
                setActiveTab("history");
              }}
              onUpdateStudent={(updated) => {
                setStudents((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
                setToastMessage("✅ Student profile updated successfully!");
              }}
            />
          )}

          {activeTab === "mark" && (
            <MarkAttendanceView
              students={filteredStudents}
              classes={filteredClasses}
              onSaveAttendance={handleSaveAttendance}
              onBack={() => setActiveTab("dashboard")}
            />
          )}

          {activeTab === "history" && (
            <CalendarHistoryView
              selectedStudentId={selectedStudentId}
              students={filteredStudents}
              onBack={() => setActiveTab("dashboard")}
            />
          )}

          {activeTab === "analytics" && (
            <AnalyticsView
              stats={filteredStats}
              onBack={() => setActiveTab("dashboard")}
              onOpenDrive={() => setShowDriveModal(true)}
            />
          )}

          {activeTab === "settings" && (
            <SettingsView
              settings={settings}
              currentUser={currentUser}
              onUpdateSettings={handleUpdateSettings}
              onLogout={() => {
                setCurrentUser(null);
                setActiveTab("auth");
              }}
            />
          )}
        </main>
      </div>

      {/* Bottom Navigation Bar for Mobile/Tablet */}
      <div className="lg:hidden">
        <BottomNav
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onOpenMarkAttendance={() => setActiveTab("mark")}
        />
      </div>

      {/* Modals */}
      {showAddStudentModal && (
        <AddStudentModal
          classes={filteredClasses}
          onClose={() => setShowAddStudentModal(false)}
          onSave={handleAddStudent}
          onAddSubject={handleAddSubject}
        />
      )}

      {showAiModal && (
        <AiAssistantModal classes={classes} onClose={() => setShowAiModal(false)} />
      )}

      {showDriveModal && (
        <CloudStorageModal
          settings={settings}
          onUpdateSettings={handleUpdateSettings}
          onClose={() => setShowDriveModal(false)}
        />
      )}
    </div>
  );
}

