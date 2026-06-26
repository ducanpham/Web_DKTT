'use client';

import React, { useState, useMemo, useCallback } from 'react';
import Image from 'next/image';
import { Search, LogOut, X, ExternalLink, Bell } from 'lucide-react';
import { Company, Registration, Role } from '@/lib/data';
import StatCards from './StatCards';
import ChartCards from './ChartCards';
import CompanyTable from './CompanyTable';
import { ExternalCompanyModal } from './RegistrationModals';

interface StudentDashboardProps {
  companies: Company[];
  registrations: Registration[];
  onRegister: (companyId: string, studentId: string, studentName: string) => void;
  onDeclareExternal: (studentId: string, studentName: string, companyName: string) => void;
  onLogout: () => void;
}

export default function StudentDashboard({
  companies, registrations, onRegister, onDeclareExternal, onLogout,
}: StudentDashboardProps) {
  const [search, setSearch] = useState('');
  const [statFilter, setStatFilter] = useState<string | null>(null);
  const [fieldFilter, setFieldFilter] = useState<string | null>(null);
  const [skillFilter, setSkillFilter] = useState<string | null>(null);
  const [showExternalModal, setShowExternalModal] = useState(false);

  const activeFilterCount = [statFilter, fieldFilter, skillFilter].filter(Boolean).length;

  const clearAllFilters = () => {
    setStatFilter(null); setFieldFilter(null); setSkillFilter(null); setSearch('');
  };

  const filteredCompanies = useMemo(() => {
    return companies.filter((c) => {
      if (search && !c.name.toLowerCase().includes(search.toLowerCase())) return false;
      if (statFilter === 'gala' && !c.isGalaSponsor) return false;
      if (statFilter === 'online' && !c.isOnlineRecruitment) return false;
      if (fieldFilter && !c.fields.some((f) => f === fieldFilter)) return false;
      if (skillFilter && !c.skills.some((s) => s === skillFilter)) return false;
      return true;
    });
  }, [companies, search, statFilter, fieldFilter, skillFilter]);

  const handleExternalSubmit = useCallback((sid: string, sn: string, cn: string) => {
    onDeclareExternal(sid, sn, cn);
    setShowExternalModal(false);
  }, [onDeclareExternal]);

  const role: Role = 'student';

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-shrink-0">
            <div className="w-8 h-8 rounded-lg overflow-hidden shadow-sm">
              <Image src="/logo.png" alt="Khoa Cơ Điện Tử" width={32} height={32} className="w-full h-full object-cover" />
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-bold text-slate-800 leading-tight">KHOA CƠ ĐIỆN Tử</p>
              <p className="text-xs text-slate-400 leading-tight">Cổng Đăng Ký Thực Tập</p>
            </div>
          </div>

          <div className="flex-1 max-w-xl relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm kiếm doanh nghiệp…"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-sm" />
            {search && (
              <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 bg-blue-50 border border-blue-200 px-3 py-1.5 rounded-full">
              <span className="text-sm">🤖</span>
              <span className="text-xs font-semibold text-blue-600">Sinh Viên</span>
            </div>

            {registrations.length > 0 && (
              <div className="relative">
                <div className="p-2 rounded-lg bg-slate-100 text-slate-500">
                  <Bell className="w-4 h-4" />
                </div>
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center">
                  {registrations.length}
                </span>
              </div>
            )}

            <button onClick={onLogout}
              className="flex items-center gap-1.5 text-slate-500 hover:text-red-600 text-sm font-medium transition-colors p-2 rounded-lg hover:bg-red-50">
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Đăng xuất</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-screen-2xl mx-auto px-4 sm:px-6 py-7 space-y-6">
        {/* Tiêu đề trang */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Cơ Hội Thực Tập</h1>
            <p className="text-slate-500 text-sm mt-1">
              Khám phá {companies.length} doanh nghiệp đối tác và đăng ký thực tập
            </p>
          </div>
          <button onClick={() => setShowExternalModal(true)}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-violet-500 to-purple-600 text-white font-semibold px-5 py-3 rounded-xl shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all text-sm">
            <ExternalLink className="w-4 h-4" />
            Khai Báo Công Ty Ngoài
          </button>
        </div>

        {/* Thanh bộ lọc */}
        {activeFilterCount > 0 && (
          <div className="flex items-center gap-3 p-3.5 bg-blue-50 border border-blue-200 rounded-xl animate-fade-in">
            <span className="text-xs font-semibold text-blue-700">{activeFilterCount} bộ lọc đang áp dụng</span>
            <div className="flex flex-wrap gap-2">
              {statFilter && (
                <span className="badge bg-blue-100 text-blue-700">
                  {statFilter === 'gala' ? '⭐ Nhà Tài Trợ Gala' : '📶 Tuyển Dụng Online'}
                  <button onClick={() => setStatFilter(null)} className="ml-1 hover:text-blue-900"><X className="w-2.5 h-2.5" /></button>
                </span>
              )}
              {fieldFilter && (
                <span className="badge bg-blue-100 text-blue-700">
                  Lĩnh vực: {fieldFilter}
                  <button onClick={() => setFieldFilter(null)} className="ml-1 hover:text-blue-900"><X className="w-2.5 h-2.5" /></button>
                </span>
              )}
              {skillFilter && (
                <span className="badge bg-blue-100 text-blue-700">
                  Kỹ năng: {skillFilter}
                  <button onClick={() => setSkillFilter(null)} className="ml-1 hover:text-blue-900"><X className="w-2.5 h-2.5" /></button>
                </span>
              )}
            </div>
            <button onClick={clearAllFilters} className="ml-auto text-xs text-blue-600 hover:text-blue-800 font-medium">Bỏ tất cả</button>
          </div>
        )}

        <StatCards companies={companies} activeFilter={statFilter} onFilterChange={setStatFilter} />

        <ChartCards companies={companies} activeFieldFilter={fieldFilter} activeSkillFilter={skillFilter}
          onFieldFilter={setFieldFilter} onSkillFilter={setSkillFilter} />

        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-slate-800">
              Danh Sách Doanh Nghiệp{' '}
              {filteredCompanies.length < companies.length && (
                <span className="text-base font-normal text-slate-400">({filteredCompanies.length} / {companies.length})</span>
              )}
            </h2>
          </div>
          <CompanyTable companies={filteredCompanies} role={role} onRegister={onRegister} />
        </div>
      </main>

      {showExternalModal && (
        <ExternalCompanyModal onClose={() => setShowExternalModal(false)} onSubmit={handleExternalSubmit} />
      )}
    </div>
  );
}
