'use client';

import React, { useState } from 'react';
import { X, UserCheck, Hash, User, AlertCircle, CheckCircle2 } from 'lucide-react';

interface RegisterModalProps {
  companyId: string;
  companyName: string;
  availableSlots: number;
  onClose: () => void;
  onSubmit: (studentId: string, studentName: string) => void;
}

export function RegisterModal({
  companyId,
  companyName,
  availableSlots,
  onClose,
  onSubmit,
}: RegisterModalProps) {
  const [studentId, setStudentId] = useState('');
  const [studentName, setStudentName] = useState('');
  const [errors, setErrors] = useState<{ id?: string; name?: string }>({});
  const [success, setSuccess] = useState(false);

  const validate = () => {
    const errs: { id?: string; name?: string } = {};
    if (!studentId.trim()) errs.id = 'Student ID is required';
    else if (!/^[A-Za-z0-9]{4,12}$/.test(studentId.trim()))
      errs.id = 'ID must be 4–12 alphanumeric characters';
    if (!studentName.trim()) errs.name = 'Full name is required';
    else if (studentName.trim().length < 3) errs.name = 'Name must be at least 3 characters';
    return errs;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setSuccess(true);
    setTimeout(() => {
      onSubmit(studentId.trim(), studentName.trim());
    }, 1200);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content max-w-md" onClick={(e) => e.stopPropagation()}>
        {success ? (
          <div className="p-10 text-center animate-scale-in">
            <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-10 h-10 text-emerald-500" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">Registration Successful!</h3>
            <p className="text-slate-500 text-sm">
              You&apos;ve been registered for{' '}
              <span className="font-semibold text-slate-700">{companyName}</span>. Good luck!
            </p>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-sm">
                  <UserCheck className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-800">Register Internship</h2>
                  <p className="text-xs text-slate-400">{companyName}</p>
                </div>
              </div>
              <button onClick={onClose} className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Slot info */}
            <div className="px-6 pt-5">
              <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-blue-600 font-bold text-sm">{availableSlots}</span>
                </div>
                <div>
                  <p className="text-blue-800 text-xs font-semibold">Slots Remaining</p>
                  <p className="text-blue-600 text-xs">Registering will reduce available slots by 1</p>
                </div>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Student ID <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Hash className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={studentId}
                    onChange={(e) => { setStudentId(e.target.value); setErrors((p) => ({ ...p, id: undefined })); }}
                    placeholder="e.g. SV202501"
                    className={`input-field pl-10 ${errors.id ? 'border-red-400 focus:ring-red-400' : ''}`}
                  />
                </div>
                {errors.id && (
                  <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {errors.id}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={studentName}
                    onChange={(e) => { setStudentName(e.target.value); setErrors((p) => ({ ...p, name: undefined })); }}
                    placeholder="Enter your full name"
                    className={`input-field pl-10 ${errors.name ? 'border-red-400 focus:ring-red-400' : ''}`}
                  />
                </div>
                {errors.name && (
                  <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {errors.name}
                  </p>
                )}
              </div>

              <div className="pt-2 flex gap-3">
                <button type="button" onClick={onClose} className="btn-secondary flex-1 justify-center">
                  Cancel
                </button>
                <button type="submit" className="btn-primary flex-1 justify-center">
                  <UserCheck className="w-4 h-4" />
                  Confirm Registration
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

/* ─── External Company Modal ─────────────────────────────────────── */

interface ExternalModalProps {
  onClose: () => void;
  onSubmit: (studentId: string, studentName: string, companyName: string) => void;
}

export function ExternalCompanyModal({ onClose, onSubmit }: ExternalModalProps) {
  const [studentId, setStudentId] = useState('');
  const [studentName, setStudentName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [errors, setErrors] = useState<{ id?: string; name?: string; company?: string }>({});
  const [success, setSuccess] = useState(false);

  const validate = () => {
    const errs: { id?: string; name?: string; company?: string } = {};
    if (!studentId.trim()) errs.id = 'Student ID is required';
    if (!studentName.trim()) errs.name = 'Full name is required';
    if (!companyName.trim()) errs.company = 'Company name is required';
    return errs;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setSuccess(true);
    setTimeout(() => {
      onSubmit(studentId.trim(), studentName.trim(), companyName.trim());
    }, 1200);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content max-w-md" onClick={(e) => e.stopPropagation()}>
        {success ? (
          <div className="p-10 text-center animate-scale-in">
            <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-10 h-10 text-emerald-500" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">Declaration Submitted!</h3>
            <p className="text-slate-500 text-sm">
              Your external internship at{' '}
              <span className="font-semibold text-slate-700">{companyName}</span> has been recorded.
            </p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-sm">
                  <span className="text-white text-lg">🏢</span>
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-800">Declare External Company</h2>
                  <p className="text-xs text-slate-400">Self-found internship declaration</p>
                </div>
              </div>
              <button onClick={onClose} className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Student ID <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Hash className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={studentId}
                    onChange={(e) => { setStudentId(e.target.value); setErrors((p) => ({ ...p, id: undefined })); }}
                    placeholder="e.g. SV202501"
                    className={`input-field pl-10 ${errors.id ? 'border-red-400' : ''}`}
                  />
                </div>
                {errors.id && <p className="mt-1 text-xs text-red-500">{errors.id}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={studentName}
                    onChange={(e) => { setStudentName(e.target.value); setErrors((p) => ({ ...p, name: undefined })); }}
                    placeholder="Your full name"
                    className={`input-field pl-10 ${errors.name ? 'border-red-400' : ''}`}
                  />
                </div>
                {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Company Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => { setCompanyName(e.target.value); setErrors((p) => ({ ...p, company: undefined })); }}
                  placeholder="Name of your self-found company"
                  className={`input-field ${errors.company ? 'border-red-400' : ''}`}
                />
                {errors.company && <p className="mt-1 text-xs text-red-500">{errors.company}</p>}
              </div>

              <div className="pt-2 flex gap-3">
                <button type="button" onClick={onClose} className="btn-secondary flex-1 justify-center">Cancel</button>
                <button type="submit" className="flex-1 py-2.5 rounded-xl font-semibold text-white text-sm bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 transition-all flex items-center justify-center gap-2">
                  Submit Declaration
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
