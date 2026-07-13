'use client';

import React, { useState } from 'react';
import { X, CheckCircle2, User, Phone, Mail, BookOpen, Hash, Building, MapPin, Send } from 'lucide-react';

interface ExternalCompanyRegistrationModalProps {
  onClose: () => void;
  onSubmit: (
    studentId: string,
    studentName: string,
    phone: string,
    email: string,
    internClass: string,
    companyName: string,
    companyEmail: string,
    companyAddress: string,
    companyPhone: string,
    expectedSkills: string
  ) => Promise<string | null>;
}

export function ExternalCompanyRegistrationModal({ onClose, onSubmit }: ExternalCompanyRegistrationModalProps) {
  const [studentId, setStudentId] = useState('');
  const [studentName, setStudentName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [internClass, setInternClass] = useState('');
  const [expectedSkills, setExpectedSkills] = useState('');

  const [companyName, setCompanyName] = useState('');
  const [companyEmail, setCompanyEmail] = useState('');
  const [companyAddress, setCompanyAddress] = useState('');
  const [companyPhone, setCompanyPhone] = useState('');

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!studentId.trim()) errs.id = 'MSSV không được để trống';
    if (!studentName.trim()) errs.name = 'Họ tên không được để trống';
    if (!phone.trim()) errs.phone = 'SĐT không được để trống';
    if (!email.trim()) errs.email = 'Email không được để trống';
    if (!internClass.trim()) errs.cls = 'Lớp không được để trống';
    if (!expectedSkills.trim()) errs.exp = 'Vui lòng điền kỳ vọng';
    if (!companyName.trim()) errs.companyName = 'Tên công ty không được để trống';
    if (!companyEmail.trim()) errs.companyEmail = 'Email công ty không được để trống';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(companyEmail)) errs.companyEmail = 'Email công ty không hợp lệ';
    return errs;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setIsLoading(true);
    setErrors({});
    
    const errorMsg = await onSubmit(
      studentId.trim(),
      studentName.trim(),
      phone.trim(),
      email.trim(),
      internClass.trim(),
      companyName.trim(),
      companyEmail.trim(),
      companyAddress.trim(),
      companyPhone.trim(),
      expectedSkills.trim()
    );

    setIsLoading(false);
    if (errorMsg) {
      setErrors({ form: errorMsg });
    } else {
      setSuccess(true);
      setTimeout(() => { onClose(); }, 2000);
    }
  };

  const Field = ({ label, icon: Icon, value, onChange, placeholder, type = "text", errorKey }: any) => (
    <div>
      <label className="block text-sm font-semibold text-slate-700 mb-1.5">
        {label} {errorKey !== 'companyAddress' && errorKey !== 'companyPhone' && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input type={type} value={value}
          onChange={(e) => { onChange(e.target.value); setErrors((p) => { const newP = { ...p }; delete newP[errorKey]; return newP; }); }}
          placeholder={placeholder}
          className={`w-full px-3 py-2 pl-10 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 ${errors[errorKey] ? 'border-red-400 focus:ring-red-400' : 'border-slate-200'}`} />
      </div>
      {errors[errorKey] && <p className="mt-1.5 text-xs text-red-500">{errors[errorKey]}</p>}
    </div>
  );

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl my-8 animate-scale-up flex flex-col max-h-[90vh]">
        {success ? (
          <div className="p-10 text-center flex-1 flex flex-col justify-center items-center">
            <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mb-4">
              <CheckCircle2 className="w-10 h-10 text-emerald-500" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">Khai báo thành công!</h3>
            <p className="text-slate-500 text-sm mb-4">
              Thư mời hợp tác đã được tự động gửi đến công ty <strong>{companyName}</strong>.
            </p>
          </div>
        ) : (
          <>
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-violet-50 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-sm">
                  <Building className="text-white w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-violet-800">Khai Báo Công Ty Ngoài</h2>
                  <p className="text-xs text-violet-600/70">Tự tìm nơi thực tập</p>
                </div>
              </div>
              <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-y-auto p-6">
              {errors.form && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
                  {errors.form}
                </div>
              )}
              
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
                <p className="text-sm text-amber-800 font-medium leading-relaxed">
                  Nhà trường sẽ tự động gửi một email <strong>Thư Mời Hợp Tác</strong> tới email người đại diện của doanh nghiệp. Vui lòng nhập thông tin chính xác. Dữ liệu khai báo của bạn sẽ được lưu trực tiếp vào hệ thống.
                </p>
              </div>

              <form id="externalRegForm" onSubmit={handleSubmit} className="space-y-6">
                
                {/* Phần 1: Sinh viên */}
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4 border-b pb-2">1. Thông tin sinh viên</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field label="MSSV" icon={Hash} value={studentId} onChange={setStudentId} placeholder="VD: 20225678" errorKey="id" />
                    <Field label="Họ và Tên" icon={User} value={studentName} onChange={setStudentName} placeholder="Nhập họ và tên đầy đủ" errorKey="name" />
                    <Field label="Số Điện Thoại" icon={Phone} value={phone} onChange={setPhone} placeholder="VD: 0912345678" type="tel" errorKey="phone" />
                    <Field label="Email" icon={Mail} value={email} onChange={setEmail} placeholder="VD: sv@hust.edu.vn" type="email" errorKey="email" />
                    <Field label="Lớp Thực Tập" icon={BookOpen} value={internClass} onChange={setInternClass} placeholder="VD: KSCD-01" errorKey="cls" />
                  </div>
                  <div className="mt-4">
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                      Kỳ vọng kỹ năng/kiến thức <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      value={expectedSkills}
                      onChange={(e) => { setExpectedSkills(e.target.value); setErrors(p => { const newP = { ...p }; delete newP.exp; return newP; }); }}
                      placeholder="Bạn mong muốn học hỏi được điều gì..."
                      className={`w-full px-4 py-2 text-sm border rounded-lg min-h-[80px] resize-none focus:outline-none focus:ring-2 focus:ring-violet-500 ${errors.exp ? 'border-red-400 focus:ring-red-400' : 'border-slate-200'}`}
                    />
                    {errors.exp && <p className="mt-1.5 text-xs text-red-500">{errors.exp}</p>}
                  </div>
                </div>

                {/* Phần 2: Công ty ngoài */}
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4 border-b pb-2">2. Thông tin công ty ngoài</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                      <Field label="Tên Doanh Nghiệp" icon={Building} value={companyName} onChange={setCompanyName} placeholder="VD: Công ty TNHH VNG" errorKey="companyName" />
                    </div>
                    <Field label="Email Người Đại Diện / Nhân Sự" icon={Mail} value={companyEmail} onChange={setCompanyEmail} placeholder="Dùng để gửi thư mời" type="email" errorKey="companyEmail" />
                    <Field label="Số điện thoại người liên hệ / hướng dẫn" icon={Phone} value={companyPhone} onChange={setCompanyPhone} placeholder="VD: 0912345678" type="tel" errorKey="companyPhone" />
                    <div className="sm:col-span-2">
                      <Field label="Địa chỉ công ty (Không bắt buộc)" icon={MapPin} value={companyAddress} onChange={setCompanyAddress} placeholder="Địa chỉ nơi bạn sẽ thực tập" errorKey="companyAddress" />
                    </div>
                  </div>
                </div>

              </form>
            </div>

            <div className="px-6 py-4 border-t border-slate-100 flex justify-end gap-3 shrink-0 bg-slate-50">
              <button 
                type="button"
                onClick={onClose} 
                disabled={isLoading}
                className="px-5 py-2.5 bg-white border border-slate-200 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 transition-colors text-sm disabled:opacity-70 shadow-sm"
              >
                Hủy
              </button>
              <button 
                type="submit"
                form="externalRegForm"
                disabled={isLoading}
                className="flex items-center justify-center gap-2 px-6 py-2.5 bg-violet-600 text-white font-semibold rounded-xl hover:bg-violet-700 transition-colors text-sm shadow-sm shadow-violet-500/20 disabled:opacity-70"
              >
                {isLoading ? (
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Đăng Ký & Gửi Thư Mời
                  </>
                )}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
