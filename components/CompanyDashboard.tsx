'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { LogOut, User, ClipboardEdit } from 'lucide-react';
import { Company, Registration, StudentViewConfig } from '@/lib/data';
import CompanyWeeklyEvalModal from './CompanyWeeklyEvalModal';

interface CompanyDashboardProps {
  company: Company;
  registrations: Registration[];
  viewConfig: StudentViewConfig;
  onLogout: () => void;
}

export default function CompanyDashboard({ company, registrations, viewConfig, onLogout }: CompanyDashboardProps) {
  const [evalStudent, setEvalStudent] = useState<Registration | null>(null);

  const appsScriptUrl = viewConfig.appsScriptUrl || '';

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center shadow-sm border border-slate-100 bg-slate-50">
              <span className="text-xl">{company.logo || '🏢'}</span>
            </div>
            <div>
              <p className="text-sm font-bold text-slate-800 leading-tight">{company.name}</p>
              <p className="text-xs text-slate-400 leading-tight">Cổng Doanh Nghiệp</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-full">
              <span className="text-sm">🏢</span>
              <span className="text-xs font-semibold text-emerald-600">Doanh Nghiệp</span>
            </div>

            <button onClick={onLogout} className="flex items-center gap-1.5 text-slate-500 hover:text-red-600 text-sm font-medium transition-colors p-2 rounded-lg hover:bg-red-50">
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Đăng xuất</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-screen-2xl mx-auto px-4 sm:px-6 py-7 space-y-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <h2 className="text-lg font-bold text-slate-800 mb-4">Danh sách Sinh viên Thực tập</h2>
          <p className="text-sm text-slate-500 mb-6">
            Dưới đây là danh sách các sinh viên đã trúng tuyển thực tập tại doanh nghiệp của bạn. Vui lòng đánh giá tiến độ làm việc của các bạn hàng tuần.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {registrations.length === 0 ? (
              <div className="col-span-full py-12 text-center text-slate-500">
                Chưa có sinh viên nào đăng ký hoặc được phân bổ vào doanh nghiệp của bạn.
              </div>
            ) : (
              registrations.map(reg => (
                <div key={reg.id} className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm hover:shadow-md hover:border-emerald-200 transition-all">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center flex-shrink-0 text-slate-400 font-bold text-lg">
                      {reg.studentName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-800">{reg.studentName}</h3>
                      <p className="text-sm text-slate-500 font-mono mt-0.5">{reg.studentId}</p>
                      {reg.internClass && <p className="text-xs text-slate-400 mt-1">Lớp: {reg.internClass}</p>}
                    </div>
                  </div>
                  
                  <div className="space-y-2 mb-5 text-sm text-slate-600">
                    <p><span className="font-medium">SĐT:</span> {reg.studentPhone || 'Không có'}</p>
                    <p className="truncate"><span className="font-medium">Email:</span> {reg.studentEmail || 'Không có'}</p>
                  </div>

                  <button
                    onClick={() => setEvalStudent(reg)}
                    className="w-full py-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-600 font-semibold text-sm transition-colors flex items-center justify-center gap-2"
                  >
                    <ClipboardEdit className="w-4 h-4" /> Đánh giá tiến độ tuần
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </main>

      {evalStudent && (
        <CompanyWeeklyEvalModal
          registration={evalStudent}
          appsScriptUrl={appsScriptUrl}
          onClose={() => setEvalStudent(null)}
        />
      )}
    </div>
  );
}
