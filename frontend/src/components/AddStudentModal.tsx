/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { X, Upload, User, Mail, Phone, School, Award, Save, Sparkles, Camera, CheckCircle2, ScanFace, Plus } from "lucide-react";
import { ClassInfo } from "../types";

interface AddStudentModalProps {
  classes: ClassInfo[];
  onClose: () => void;
  onSave: (studentData: any) => void;
  onAddSubject?: (classId: string, subjectName: string, semester: string) => void;
}

export const AddStudentModal: React.FC<AddStudentModalProps> = ({ classes, onClose, onSave, onAddSubject }) => {
  const [name, setName] = useState("");
  const [rollNo, setRollNo] = useState("");
  const [classId, setClassId] = useState(classes[0]?.id || "cs-3b");
  const [semester, setSemester] = useState(classes[0]?.semester || "Semester 5 • Sec B");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("+91 7807885427");
  const [photo, setPhoto] = useState(
    "https://ui-avatars.com/api/?name=Student&background=random"
  );
  
  // Subjects state for selected semester/class
  const selectedClassObj = classes.find(c => c.id === classId) || classes[0];
  const [subject, setSubject] = useState(selectedClassObj?.subjects?.[0] || "Data Structures & Algorithms");
  const [showNewSubjectInput, setShowNewSubjectInput] = useState(false);
  const [newSubjectName, setNewSubjectName] = useState("");

  // Face Recognition Biometrics State
  const [biometricRegistered, setBiometricRegistered] = useState(false);
  const [isScanningFace, setIsScanningFace] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);

  const [saving, setSaving] = useState(false);

  const handleClassChange = (newClassId: string) => {
    setClassId(newClassId);
    const cls = classes.find(c => c.id === newClassId);
    if (cls) {
      if (cls.semester) setSemester(cls.semester);
      if (cls.subjects && cls.subjects.length > 0) {
        setSubject(cls.subjects[0]);
      }
    }
  };

  const handleAddNewSubject = () => {
    if (newSubjectName.trim()) {
      setSubject(newSubjectName.trim());
      if (onAddSubject) {
        onAddSubject(classId, newSubjectName.trim(), semester);
      }
      setShowNewSubjectInput(false);
      setNewSubjectName("");
    }
  };

  const handleStartFaceScan = () => {
    setIsScanningFace(true);
    setScanProgress(10);
    const interval = setInterval(() => {
      setScanProgress((prev) => {
        if (prev >= 90) {
          clearInterval(interval);
          setTimeout(() => {
            setIsScanningFace(false);
            setBiometricRegistered(true);
          }, 300);
          return 100;
        }
        return prev + 25;
      });
    }, 400);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      onSave({ name, rollNo, classId, email, phone, photo, biometricRegistered, semester, subject });
      setSaving(false);
      onClose();
    }, 600);
  };

  const avatarOptions = [
    "https://ui-avatars.com/api/?name=S1&background=random",
    "https://ui-avatars.com/api/?name=S2&background=random",
    "https://ui-avatars.com/api/?name=S3&background=random",
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-xl w-full shadow-2xl border border-slate-100 dark:border-slate-800 p-6 sm:p-8 space-y-6 animate-in zoom-in-95 duration-200 max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center text-white shadow-md">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-800 dark:text-white">Add New Student</h3>
              <p className="text-xs text-slate-500">Register student into semester & biometric roster</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Photo & Face Recognition Biometrics Section */}
          <div className="flex flex-col sm:flex-row items-center gap-6 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700">
            <div className="flex flex-col items-center space-y-2">
              <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-indigo-100 dark:border-slate-800 shadow-md relative group">
                <img src={photo} alt="Preview" className="w-full h-full object-cover" />
                {biometricRegistered && (
                  <div className="absolute inset-0 bg-emerald-500/20 flex items-center justify-center">
                    <CheckCircle2 className="w-8 h-8 text-emerald-600 dark:text-emerald-400 drop-shadow" />
                  </div>
                )}
              </div>
              <div className="flex gap-2">
                {avatarOptions.map((p, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setPhoto(p)}
                    className={`w-7 h-7 rounded-full overflow-hidden border-2 transition-all ${
                      photo === p ? "border-indigo-600 scale-110" : "border-transparent opacity-60 hover:opacity-100"
                    }`}
                  >
                    <img src={p} alt="Avatar" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
              <span className="text-[10px] text-slate-400 font-semibold">Select Avatar Photo</span>
            </div>

            {/* Biometric Face Scanner Control */}
            <div className="flex-1 w-full flex flex-col justify-center space-y-2 text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <ScanFace className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                <span className="text-sm font-bold text-slate-800 dark:text-white">AI Face Recognition Biometrics</span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Scan facial features to generate an encrypted 128-D biometric vector for automated classroom attendance.
              </p>

              {isScanningFace ? (
                <div className="p-3 bg-indigo-50 dark:bg-indigo-950/40 rounded-xl border border-indigo-200 dark:border-indigo-800 text-center space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-indigo-600 dark:text-indigo-400">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-indigo-600 animate-ping" />
                      Scanning Facial Landmark Points...
                    </span>
                    <span>{scanProgress}%</span>
                  </div>
                  <div className="w-full bg-indigo-200 dark:bg-indigo-900 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-indigo-600 h-full transition-all duration-300"
                      style={{ width: `${scanProgress}%` }}
                    />
                  </div>
                </div>
              ) : biometricRegistered ? (
                <div className="flex items-center justify-center sm:justify-start gap-2 p-2.5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl text-emerald-700 dark:text-emerald-300 text-xs font-bold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>✅ Face Registered (+91 India Biometric Template)</span>
                  <button
                    type="button"
                    onClick={handleStartFaceScan}
                    className="ml-auto text-[10px] underline hover:text-emerald-800"
                  >
                    Rescan
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleStartFaceScan}
                  className="w-full sm:w-auto py-2.5 px-4 bg-indigo-50 dark:bg-indigo-950/50 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 text-indigo-600 dark:text-indigo-300 font-bold rounded-xl border border-indigo-200 dark:border-indigo-800 text-xs flex items-center justify-center gap-2 transition-all shadow-sm"
                >
                  <Camera className="w-4 h-4" />
                  <span>Register Biometric Face ID</span>
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1 ml-1">
                Full Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Rahul Thakur"
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-3 text-sm font-semibold focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1 ml-1">
                Roll Number *
              </label>
              <input
                type="text"
                required
                value={rollNo}
                onChange={(e) => setRollNo(e.target.value)}
                placeholder="e.g. 107"
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-3 text-sm font-semibold focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1 ml-1">
                Department & Class *
              </label>
              <select
                value={classId}
                onChange={(e) => handleClassChange(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-3 text-sm font-semibold focus:ring-2 focus:ring-indigo-500 outline-none cursor-pointer"
              >
                {classes.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1 ml-1">
                Semester / Section
              </label>
              <input
                type="text"
                value={semester}
                onChange={(e) => setSemester(e.target.value)}
                placeholder="e.g. Semester 5 • Sec B"
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-3 text-sm font-semibold focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
          </div>

          {/* Subject for Semester Admin Section */}
          <div className="p-4 bg-indigo-50/50 dark:bg-slate-800/40 border border-indigo-100 dark:border-slate-700 rounded-2xl space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-indigo-900 dark:text-indigo-300 ml-1 flex items-center gap-1.5">
                <School className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                <span>Subject for Semester *</span>
              </label>
              {!showNewSubjectInput && (
                <button
                  type="button"
                  onClick={() => setShowNewSubjectInput(true)}
                  className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 flex items-center gap-1 bg-white dark:bg-slate-800 px-2 py-1 rounded-lg border border-indigo-200 dark:border-indigo-800 shadow-2xs"
                >
                  <Plus className="w-3 h-3" />
                  <span>Add Subject</span>
                </button>
              )}
            </div>

            {showNewSubjectInput ? (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newSubjectName}
                  onChange={(e) => setNewSubjectName(e.target.value)}
                  placeholder="Enter new subject name (e.g. Machine Learning)"
                  className="flex-1 bg-white dark:bg-slate-800 border border-indigo-300 dark:border-indigo-700 rounded-xl p-2.5 text-xs font-semibold focus:ring-2 focus:ring-indigo-500 outline-none"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={handleAddNewSubject}
                  className="px-3.5 py-2 gradient-bg text-white font-bold rounded-xl text-xs shadow-md hover:opacity-90 transition-all"
                >
                  Add
                </button>
                <button
                  type="button"
                  onClick={() => setShowNewSubjectInput(false)}
                  className="px-2.5 py-2 bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-bold rounded-xl text-xs"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-3 text-sm font-semibold focus:ring-2 focus:ring-indigo-500 outline-none cursor-pointer"
              >
                {(selectedClassObj?.subjects && selectedClassObj.subjects.length > 0
                  ? selectedClassObj.subjects
                  : ["Data Structures & Algorithms", "Operating Systems", "Discrete Mathematics", "Artificial Intelligence"]
                ).map((sub, idx) => (
                  <option key={idx} value={sub}>
                    {sub} ({semester})
                  </option>
                ))}
              </select>
            )}
            <p className="text-[11px] text-slate-500 dark:text-slate-400 italic">
              💡 Admin can add and assign specific subjects for each academic semester.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1 ml-1">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder=""
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-3 text-sm font-semibold focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1 ml-1">
                Phone Number (+91 India) *
              </label>
              <input
                type="text"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 7807885427"
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-3 text-sm font-semibold focus:ring-2 focus:ring-indigo-500 outline-none font-mono"
              />
            </div>
          </div>

          <div className="pt-4 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold rounded-2xl hover:bg-slate-200 transition-colors text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 py-3.5 gradient-bg text-white font-bold rounded-2xl shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 active:scale-95 transition-all text-sm flex items-center justify-center gap-2"
            >
              {saving ? (
                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save Student</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
