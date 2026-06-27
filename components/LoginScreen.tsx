'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Shield, Eye, EyeOff, LogIn, AlertCircle } from 'lucide-react';

interface LoginScreenProps {
  onLogin: (role: 'student' | 'admin') => void;
}

export default function LoginScreen({ onLogin }: LoginScreenProps) {
  const [selectedRole, setSelectedRole] = useState<'student' | 'admin' | null>(null);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleStudentLogin = () => {
    setIsLoading(true);
    setTimeout(() => { onLogin('student'); setIsLoading(false); }, 600);
  };

  const handleAdminLogin = () => {
    setError('');
    if (password !== 'MEOHULA') {
      setError('Mật khẩu không đúng.');
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    setTimeout(() => { onLogin('admin'); setIsLoading(false); }, 600);
  };

  const handleRoleSelect = (role: 'student' | 'admin') => {
    setSelectedRole(role);
    setError('');
    setPassword('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Nền động */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-900/10 rounded-full blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(99,102,241,1) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,1) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      <div className="relative w-full max-w-lg animate-slide-up">
        {/* Logo & Tiêu đề */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl shadow-2xl shadow-blue-500/40 mb-5 overflow-hidden">
            <Image src="/logo.png" alt="Khoa Cơ Điện Tử" width={80} height={80} className="w-full h-full object-cover" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-1 tracking-tight">KHOA CƠ ĐIỆN Tử</h1>
          <p className="text-blue-300 text-base font-semibold tracking-wide">ĐĂNG KÝ THỰC TẬP & HƯỚNG NGHIỆP</p>
          <p className="text-slate-400 text-sm mt-1">Đại học Bách Khoa Hà Nội</p>
          <div className="mt-3 inline-flex items-center gap-1.5 bg-blue-500/10 border border-blue-500/20 rounded-full px-3 py-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-emerald-400 text-xs font-medium">Hệ thống hoạt động — Năm học 2025–2026</span>
          </div>
        </div>

        {/* Thẻ đăng nhập */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
          <h2 className="text-white text-xl font-semibold mb-2">Chọn Vai trò</h2>
          <p className="text-slate-400 text-sm mb-7">Vui lòng chọn vai trò để truy cập hệ thống.</p>

          {/* Thẻ vai trò */}
          <div className="grid grid-cols-2 gap-4 mb-7">
            {/* Sinh viên */}
            <button
              onClick={() => handleRoleSelect('student')}
              className={`relative group flex flex-col items-center gap-3 p-5 rounded-2xl border-2 transition-all duration-300 ${
                selectedRole === 'student'
                  ? 'border-blue-400 bg-blue-500/20 shadow-lg shadow-blue-500/20'
                  : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10'
              }`}
            >
              <div className={`w-14 h-14 rounded-xl flex items-center justify-center overflow-hidden transition-all duration-300 ${
                selectedRole === 'student' ? 'shadow-lg shadow-blue-500/40' : 'bg-white/10 group-hover:bg-white/15'
              }`}>
                <Image src="/logo.png" alt="Sinh viên" width={56} height={56} className="w-full h-full object-cover" />
              </div>
              <div className="text-center">
                <p className="text-white font-semibold text-sm">Sinh Viên</p>
                <p className="text-slate-400 text-xs mt-0.5">Xem &amp; đăng ký</p>
              </div>
              {selectedRole === 'student' && (
                <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-blue-400 flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}
            </button>

            {/* Quản trị viên */}
            <button
              onClick={() => handleRoleSelect('admin')}
              className={`relative group flex flex-col items-center gap-3 p-5 rounded-2xl border-2 transition-all duration-300 ${
                selectedRole === 'admin'
                  ? 'border-indigo-400 bg-indigo-500/20 shadow-lg shadow-indigo-500/20'
                  : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10'
              }`}
            >
              <div className={`w-14 h-14 rounded-xl flex items-center justify-center transition-all duration-300 ${
                selectedRole === 'admin' ? 'bg-indigo-500 shadow-lg shadow-indigo-500/40' : 'bg-white/10 group-hover:bg-white/15'
              }`}>
                <Shield className="w-7 h-7 text-white" />
              </div>
              <div className="text-center">
                <p className="text-white font-semibold text-sm">Quản Trị Viên</p>
                <p className="text-slate-400 text-xs mt-0.5">Toàn quyền quản lý</p>
              </div>
              {selectedRole === 'admin' && (
                <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-indigo-400 flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}
            </button>
          </div>

          {/* Ô nhập mật khẩu Admin */}
          {selectedRole === 'admin' && (
            <div className="mb-5 animate-slide-up">
              <label className="text-slate-300 text-sm font-medium block mb-2">Mật khẩu Quản trị viên</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(''); }}
                  onKeyDown={(e) => e.key === 'Enter' && handleAdminLogin()}
                  placeholder="Nhập mật khẩu quản trị"
                  className="w-full px-4 py-3.5 pr-12 rounded-xl bg-white/10 border border-white/20 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all text-sm"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {error && (
                <div className="mt-2.5 flex items-center gap-2 text-red-400 text-xs animate-fade-in">
                  <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}
            </div>
          )}

          {/* Nút đăng nhập */}
          {selectedRole && (
            <button
              onClick={selectedRole === 'student' ? handleStudentLogin : handleAdminLogin}
              disabled={isLoading}
              className={`w-full py-4 rounded-xl font-semibold text-white transition-all duration-300 flex items-center justify-center gap-2 text-sm shadow-lg animate-slide-up ${
                selectedRole === 'student'
                  ? 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-blue-500/30 hover:-translate-y-0.5'
                  : 'bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 shadow-indigo-500/30 hover:-translate-y-0.5'
              } disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none`}
            >
              {isLoading ? (
                <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              ) : (
                <LogIn className="w-4 h-4" />
              )}
              {isLoading ? 'Đang đăng nhập…' : `Vào với vai trò ${selectedRole === 'student' ? 'Sinh Viên' : 'Quản Trị Viên'}`}
            </button>
          )}

          {!selectedRole && (
            <div className="text-center text-slate-500 text-sm py-2">↑ Chọn vai trò để tiếp tục</div>
          )}
        </div>

        {/* Chân trang */}
        <p className="text-center text-slate-600 text-xs mt-6">
          Ban Quan hệ Doanh nghiệp &bull; Năm học 2025–2026 &bull; v2.0
        </p>
      </div>
    </div>
  );
}
