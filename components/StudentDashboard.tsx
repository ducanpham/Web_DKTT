'use client';

import React, { useState, useMemo, useCallback } from 'react';
import Image from 'next/image';
import { Search, LogOut, X, ExternalLink, Bell, BookOpen, Wrench, ChevronRight } from 'lucide-react';
import { Company, Registration, Role, InternshipGuide, StudentViewConfig } from '@/lib/data';
import StatCards from './StatCards';
import ChartCards from './ChartCards';
import CompanyTable from './CompanyTable';
import { ExternalCompanyModal } from './RegistrationModals';

interface StudentDashboardProps {
  companies: Company[];
  registrations: Registration[];
  guide: InternshipGuide;
  viewConfig: StudentViewConfig;
  onRegister: (companyId: string, studentId: string, studentName: string, phone: string, email: string, internClass: string, expectedSkills?: string) => void;
  onDeclareExternal: (studentId: string, studentName: string, phone: string, email: string, internClass: string, companyName: string) => void;
  onLogout: () => void;
}

export default function StudentDashboard({
  companies, registrations, guide, viewConfig, onRegister, onDeclareExternal, onLogout,
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

  const handleExternalSubmit = useCallback((sid: string, sn: string, phone: string, email: string, cls: string, cn: string) => {
    onDeclareExternal(sid, sn, phone, email, cls, cn);
    setShowExternalModal(false);
  }, [onDeclareExternal]);

  const role: Role = 'student';

  const hasGuide = guide.technicalLink || guide.engineerLink;

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
              <p className="text-sm font-bold text-slate-800 leading-tight">KHOA CƠ ĐIỆN TỬ</p>
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
        {/* Banner Hướng dẫn Thực tập — chỉ hiện khi admin đã cung cấp link */}
        {hasGuide && (
          <div className="rounded-2xl bg-gradient-to-br from-indigo-600 via-blue-600 to-cyan-500 p-5 shadow-lg shadow-blue-500/20 text-white animate-fade-in">
            <div className="flex items-center gap-2 mb-4">
              <BookOpen className="w-5 h-5 text-white/80" />
              <h2 className="text-base font-bold tracking-wide">TÀI LIỆU HƯỚNG DẪN THỰC TẬP</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {guide.technicalLink && (
                <a href={guide.technicalLink} target="_blank" rel="noopener noreferrer"
                  className="group flex items-center justify-between bg-white/15 hover:bg-white/25 backdrop-blur-sm rounded-xl px-4 py-3.5 transition-all border border-white/20 hover:border-white/40">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-white/20 flex items-center justify-center flex-shrink-0">
                      <Wrench className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-white font-semibold text-sm">{guide.technicalLabel || 'Hướng dẫn Thực tập Kỹ thuật'}</p>
                      <p className="text-white/60 text-xs mt-0.5">Mở tài liệu Google Drive</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-white/60 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
                </a>
              )}
              {guide.engineerLink && (
                <a href={guide.engineerLink} target="_blank" rel="noopener noreferrer"
                  className="group flex items-center justify-between bg-white/15 hover:bg-white/25 backdrop-blur-sm rounded-xl px-4 py-3.5 transition-all border border-white/20 hover:border-white/40">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-white/20 flex items-center justify-center flex-shrink-0">
                      <BookOpen className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-white font-semibold text-sm">{guide.engineerLabel || 'Thực tập Kỹ sư Chuyên sâu'}</p>
                      <p className="text-white/60 text-xs mt-0.5">Mở tài liệu Google Drive</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-white/60 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
                </a>
              )}
            </div>
          </div>
        )}

        {/* Tiêu đề trang */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Cơ Hội Thực Tập</h1>
            <p className="text-slate-500 text-sm mt-1">
              Khám phá {companies.length} doanh nghiệp đối tác và đăng ký thực tập
            </p>
          </div>
          {viewConfig?.allowExternalDeclaration && (
            <button onClick={() => setShowExternalModal(true)}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-violet-500 to-purple-600 text-white font-semibold px-5 py-3 rounded-xl shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all text-sm">
              <ExternalLink className="w-4 h-4" />
              Đề xuất/Khai Báo Công Ty Ngoài
            </button>
          )}
        </div>

        {/* Thanh bộ lọc */}
        {activeFilterCount > 0 && (
          <div className="flex items-center gap-3 p-3.5 bg-blue-50 border border-blue-200 rounded-xl animate-fade-in">
            <span className="text-xs font-semibold text-blue-700">{activeFilterCount} bộ lọc đang áp dụng</span>
            <div className="flex flex-wrap gap-2">
              {statFilter && (
                <span className="badge bg-blue-100 text-blue-700">
                  {statFilter === 'gala' ? '⭐ Tham dự Ngày hội TN' : statFilter === 'online' ? '📶 Tuyển Dụng Online' : '⭐ T.Dụng Online & Ngày hội TN'}
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

        {viewConfig?.showStatCards !== false && (
          <StatCards companies={companies} activeFilter={statFilter} onFilterChange={setStatFilter} />
        )}

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
          <CompanyTable companies={filteredCompanies} role={role} viewConfig={viewConfig} onRegister={onRegister} />
        </div>
      </main>

      {showExternalModal && (
        <ExternalCompanyModal onClose={() => setShowExternalModal(false)} onSubmit={handleExternalSubmit} />
      )}
    </div>
  );
}
