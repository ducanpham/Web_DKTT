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

export function RegisterModal({ companyId: _companyId, companyName, availableSlots, onClose, onSubmit }: RegisterModalProps) {
  const [studentId, setStudentId] = useState('');
  const [studentName, setStudentName] = useState('');
  const [errors, setErrors] = useState<{ id?: string; name?: string }>({});
  const [success, setSuccess] = useState(false);

  const validate = () => {
    const errs: { id?: string; name?: string } = {};
    if (!studentId.trim()) errs.id = 'Mã sinh viên không được để trống';
    else if (!/^[A-Za-z0-9]{4,12}$/.test(studentId.trim())) errs.id = 'Mã SV phải có 4–12 ký tự chữ và số';
    if (!studentName.trim()) errs.name = 'Họ và tên không được để trống';
    else if (studentName.trim().length < 3) errs.name = 'Họ tên phải có ít nhất 3 ký tự';
    return errs;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setSuccess(true);
    setTimeout(() => { onSubmit(studentId.trim(), studentName.trim()); }, 1200);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content max-w-md" onClick={(e) => e.stopPropagation()}>
        {success ? (
          <div className="p-10 text-center animate-scale-in">
            <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-10 h-10 text-emerald-500" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">Đăng ký thành công!</h3>
            <p className="text-slate-500 text-sm">
              Bạn đã đăng ký thực tập tại <span className="font-semibold text-slate-700">{companyName}</span>. Chúc may mắn!
            </p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-sm">
                  <UserCheck className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-800">Đăng Ký Thực Tập</h2>
                  <p className="text-xs text-slate-400">{companyName}</p>
                </div>
              </div>
              <button onClick={onClose} className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="px-6 pt-5">
              <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-blue-600 font-bold text-sm">{availableSlots}</span>
                </div>
                <div>
                  <p className="text-blue-800 text-xs font-semibold">Chỉ tiêu còn lại</p>
                  <p className="text-blue-600 text-xs">Đăng ký sẽ trừ đi 1 chỉ tiêu</p>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Mã Sinh Viên <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Hash className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input type="text" value={studentId}
                    onChange={(e) => { setStudentId(e.target.value); setErrors((p) => ({ ...p, id: undefined })); }}
                    placeholder="VD: SV202501"
                    className={`input-field pl-10 ${errors.id ? 'border-red-400 focus:ring-red-400' : ''}`} />
                </div>
                {errors.id && <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.id}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Họ và Tên <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input type="text" value={studentName}
                    onChange={(e) => { setStudentName(e.target.value); setErrors((p) => ({ ...p, name: undefined })); }}
                    placeholder="Nhập họ và tên đầy đủ"
                    className={`input-field pl-10 ${errors.name ? 'border-red-400 focus:ring-red-400' : ''}`} />
                </div>
                {errors.name && <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.name}</p>}
              </div>

              <div className="pt-2 flex gap-3">
                <button type="button" onClick={onClose} className="btn-secondary flex-1 justify-center">Hủy</button>
                <button type="submit" className="btn-primary flex-1 justify-center">
                  <UserCheck className="w-4 h-4" /> Xác nhận đăng ký
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

/* ─── Modal Khai báo Công ty ngoài ─── */

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
    if (!studentId.trim()) errs.id = 'Mã sinh viên không được để trống';
    if (!studentName.trim()) errs.name = 'Họ và tên không được để trống';
    if (!companyName.trim()) errs.company = 'Tên công ty không được để trống';
    return errs;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setSuccess(true);
    setTimeout(() => { onSubmit(studentId.trim(), studentName.trim(), companyName.trim()); }, 1200);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content max-w-md" onClick={(e) => e.stopPropagation()}>
        {success ? (
          <div className="p-10 text-center animate-scale-in">
            <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-10 h-10 text-emerald-500" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">Khai báo thành công!</h3>
            <p className="text-slate-500 text-sm">
              Thực tập tại <span className="font-semibold text-slate-700">{companyName}</span> đã được ghi nhận.
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
                  <h2 className="text-base font-bold text-slate-800">Khai Báo Công Ty Ngoài</h2>
                  <p className="text-xs text-slate-400">Tự tìm nơi thực tập</p>
                </div>
              </div>
              <button onClick={onClose} className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Mã Sinh Viên <span className="text-red-500">*</span></label>
                <div className="relative">
                  <Hash className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input type="text" value={studentId}
                    onChange={(e) => { setStudentId(e.target.value); setErrors((p) => ({ ...p, id: undefined })); }}
                    placeholder="VD: SV202501" className={`input-field pl-10 ${errors.id ? 'border-red-400' : ''}`} />
                </div>
                {errors.id && <p className="mt-1 text-xs text-red-500">{errors.id}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Họ và Tên <span className="text-red-500">*</span></label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input type="text" value={studentName}
                    onChange={(e) => { setStudentName(e.target.value); setErrors((p) => ({ ...p, name: undefined })); }}
                    placeholder="Họ và tên đầy đủ" className={`input-field pl-10 ${errors.name ? 'border-red-400' : ''}`} />
                </div>
                {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Tên Công Ty <span className="text-red-500">*</span></label>
                <input type="text" value={companyName}
                  onChange={(e) => { setCompanyName(e.target.value); setErrors((p) => ({ ...p, company: undefined })); }}
                  placeholder="Tên công ty tự tìm được" className={`input-field ${errors.company ? 'border-red-400' : ''}`} />
                {errors.company && <p className="mt-1 text-xs text-red-500">{errors.company}</p>}
              </div>

              <div className="pt-2 flex gap-3">
                <button type="button" onClick={onClose} className="btn-secondary flex-1 justify-center">Hủy</button>
                <button type="submit" className="flex-1 py-2.5 rounded-xl font-semibold text-white text-sm bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 transition-all flex items-center justify-center gap-2">
                  Gửi khai báo
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
