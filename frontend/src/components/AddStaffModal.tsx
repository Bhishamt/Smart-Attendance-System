import React, { useState } from "react";
import { X, User, Mail, Shield, Save } from "lucide-react";

interface AddStaffModalProps {
  onClose: () => void;
  onSave: (staff: any) => void;
}

export const AddStaffModal: React.FC<AddStaffModalProps> = ({ onClose, onSave }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("HOD");
  const [department, setDepartment] = useState("Computer Science");
  const [saving, setSaving] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      onSave({ name, email, role, department });
      setSaving(false);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full shadow-2xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold text-slate-800 dark:text-white">Add Staff Member</h3>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full">
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1 ml-1">Name</label>
            <div className="relative">
              <User className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input type="text" required value={name} onChange={e => setName(e.target.value)} className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border rounded-2xl outline-none" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1 ml-1">Email</label>
            <div className="relative">
              <Mail className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input type="email" required value={email} onChange={e => setEmail(e.target.value)} className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border rounded-2xl outline-none" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1 ml-1">Role</label>
            <div className="relative">
              <Shield className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <select value={role} onChange={e => setRole(e.target.value)} className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border rounded-2xl outline-none">
                <option value="HOD">Head of Department (HOD)</option>
                <option value="Teacher">Class Incharge / Teacher</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1 ml-1">Department</label>
            <select value={department} onChange={e => setDepartment(e.target.value)} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border rounded-2xl outline-none">
              <option value="CS">Computer Science</option>
              <option value="CE">Civil Engineering</option>
              <option value="ME">Mechanical Engineering</option>
              <option value="EE">Electrical Engineering</option>
            </select>
          </div>
          <button type="submit" disabled={saving} className="w-full py-3 mt-4 gradient-bg text-white font-bold rounded-xl shadow-lg flex items-center justify-center gap-2">
            <Save className="w-5 h-5" />
            <span>{saving ? "Saving..." : "Save Staff"}</span>
          </button>
        </form>
      </div>
    </div>
  );
};
