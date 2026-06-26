'use client';

import React, { useState } from 'react';
import { X, UserCheck, Hash, User, AlertCircle, CheckCircle2, Phone, Mail, BookOpen } from 'lucide-react';

interface RegisterModalProps {
  companyId: string;
  companyName: string;
  availableSlots: number;
  onClose: () => void;
  onSubmit: (studentId: string, studentName: string, phone: string, email: string, internClass: string) => void;
}

export function RegisterModal({ companyId: _companyId, companyName, availableSlots, onClose, onSubmit }: RegisterModalProps) {
  const [studentId, setStudentId] = useState('');
  const [studentName, setStudentName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [internClass, setInternClass] = useState('');
  const [errors, setErrors] = useState<{ id?: string; name?: string; phone?: string; email?: string; cls?: string }>({});
  const [success, setSuccess] = useState(false);

  const validate = () => {
    const errs: typeof errors = {};
    if (!studentId.trim()) errs.id = 'Mã sinh viên không được để trống';
    else if (!/^[A-Za-z0-9]{4,12}$/.test(studentId.trim())) errs.id = 'MSSV phải có 4–12 ký tự chữ và số';
    if (!studentName.trim()) errs.name = 'Họ và tên không được để trống';
    else if (studentName.trim().length < 3) errs.name = 'Họ tên phải có ít nhất 3 ký tự';
    if (!phone.trim()) errs.phone = 'Số điện thoại không được để trống';
    else if (!/^(0|\+84)[0-9]{8,10}$/.test(phone.trim())) errs.phone = 'Số điện thoại không hợp lệ';
    if (!email.trim()) errs.email = 'Email không được để trống';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) errs.email = 'Email không đúng định dạng';
    if (!internClass.trim()) errs.cls = 'Lớp thực tập không được để trống';
    return errs;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setSuccess(true);
    setTimeout(() => { onSubmit(studentId.trim(), studentName.trim(), phone.trim(), email.trim(), internClass.trim()); }, 1200);
  };

  const Field = ({ label, icon: Icon, value, onChange, placeholder, type = 'text', error, errorKey }: {
    label: string; icon: React.ElementType; value: string;
    onChange: (v: string) => void; placeholder: string;
    type?: string; error?: string; errorKey: string;
  }) => (
    <div>
      <label className="block text-sm font-semibold text-slate-700 mb-1.5">
        {label} <span className="text-red-500">*</span>
      </label>
      <div className="relative">
        <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input type={type} value={value}
          onChange={(e) => { onChange(e.target.value); setErrors((p) => ({ ...p, [errorKey]: undefined })); }}
          placeholder={placeholder}
          className={`input-field pl-10 ${error ? 'border-red-400 focus:ring-red-400' : ''}`} />
      </div>
      {error && <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {error}</p>}
    </div>
  );

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
              <Field label="MSSV" icon={Hash} value={studentId}
                onChange={setStudentId} placeholder="VD: 20225678" error={errors.id} errorKey="id" />

              <Field label="Họ và Tên" icon={User} value={studentName}
                onChange={setStudentName} placeholder="Nhập họ và tên đầy đủ" error={errors.name} errorKey="name" />

              <Field label="Số Điện Thoại" icon={Phone} value={phone}
                onChange={setPhone} placeholder="VD: 0912345678" type="tel" error={errors.phone} errorKey="phone" />

              <Field label="Email" icon={Mail} value={email}
                onChange={setEmail} placeholder="VD: sv@hust.edu.vn" type="email" error={errors.email} errorKey="email" />

              <Field label="Lớp Thực Tập" icon={BookOpen} value={internClass}
                onChange={setInternClass} placeholder="VD: KSCD-01, Kỹ thuật-K65..." error={errors.cls} errorKey="cls" />

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
  onSubmit: (studentId: string, studentName: string, phone: string, email: string, internClass: string, companyName: string) => void;
}

export function ExternalCompanyModal({ onClose, onSubmit }: ExternalModalProps) {
  const [studentId, setStudentId] = useState('');
  const [studentName, setStudentName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [internClass, setInternClass] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [errors, setErrors] = useState<{ id?: string; name?: string; phone?: string; email?: string; cls?: string; company?: string }>({});
  const [success, setSuccess] = useState(false);

  const validate = () => {
    const errs: typeof errors = {};
    if (!studentId.trim()) errs.id = 'Mã sinh viên không được để trống';
    if (!studentName.trim()) errs.name = 'Họ và tên không được để trống';
    if (!phone.trim()) errs.phone = 'Số điện thoại không được để trống';
    if (!email.trim()) errs.email = 'Email không được để trống';
    if (!internClass.trim()) errs.cls = 'Lớp thực tập không được để trống';
    if (!companyName.trim()) errs.company = 'Tên công ty không được để trống';
    return errs;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setSuccess(true);
    setTimeout(() => { onSubmit(studentId.trim(), studentName.trim(), phone.trim(), email.trim(), internClass.trim(), companyName.trim()); }, 1200);
  };

  const cls = (err?: string) => `input-field ${err ? 'border-red-400' : ''}`;

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
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">MSSV <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input type="text" value={studentId}
                      onChange={(e) => { setStudentId(e.target.value); setErrors((p) => ({ ...p, id: undefined })); }}
                      placeholder="20225678" className={`${cls(errors.id)} pl-9`} />
                  </div>
                  {errors.id && <p className="mt-1 text-xs text-red-500">{errors.id}</p>}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Lớp Thực Tập <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input type="text" value={internClass}
                      onChange={(e) => { setInternClass(e.target.value); setErrors((p) => ({ ...p, cls: undefined })); }}
                      placeholder="KSCD-01" className={`${cls(errors.cls)} pl-9`} />
                  </div>
                  {errors.cls && <p className="mt-1 text-xs text-red-500">{errors.cls}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Họ và Tên <span className="text-red-500">*</span></label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input type="text" value={studentName}
                    onChange={(e) => { setStudentName(e.target.value); setErrors((p) => ({ ...p, name: undefined })); }}
                    placeholder="Họ và tên đầy đủ" className={`${cls(errors.name)} pl-10`} />
                </div>
                {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Số Điện Thoại <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input type="tel" value={phone}
                      onChange={(e) => { setPhone(e.target.value); setErrors((p) => ({ ...p, phone: undefined })); }}
                      placeholder="0912345678" className={`${cls(errors.phone)} pl-9`} />
                  </div>
                  {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone}</p>}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input type="email" value={email}
                      onChange={(e) => { setEmail(e.target.value); setErrors((p) => ({ ...p, email: undefined })); }}
                      placeholder="sv@hust.edu.vn" className={`${cls(errors.email)} pl-9`} />
                  </div>
                  {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Tên Công Ty <span className="text-red-500">*</span></label>
                <input type="text" value={companyName}
                  onChange={(e) => { setCompanyName(e.target.value); setErrors((p) => ({ ...p, company: undefined })); }}
                  placeholder="Tên công ty tự tìm được" className={cls(errors.company)} />
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
