'use client';

import React, { useState, useMemo, useCallback } from 'react';
import {
  Shield, Search, LogOut, Upload, Copy, Users, Check, X, Filter,
} from 'lucide-react';
import { Company, Registration, Role } from '@/lib/data';
import StatCards from './StatCards';
import ChartCards from './ChartCards';
import CompanyTable from './CompanyTable';
import ManageRegistrationsModal from './ManageRegistrationsModal';
import UploadExcelModal from './UploadExcelModal';

interface AdminDashboardProps {
  companies: Company[];
  registrations: Registration[];
  onDeleteRegistration: (id: string) => void;
  onImportCompanies: (newCompanies: Company[], replace: boolean) => void;
  onLogout: () => void;
}

export default function AdminDashboard({
  companies,
  registrations,
  onDeleteRegistration,
  onImportCompanies,
  onLogout,
}: AdminDashboardProps) {
  const [search, setSearch] = useState('');
  const [statFilter, setStatFilter] = useState<string | null>(null);
  const [fieldFilter, setFieldFilter] = useState<string | null>(null);
  const [skillFilter, setSkillFilter] = useState<string | null>(null);
  const [showRegModal, setShowRegModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [emailCopied, setEmailCopied] = useState(false);

  const activeFilterCount = [statFilter, fieldFilter, skillFilter].filter(Boolean).length;

  const clearAllFilters = () => {
    setStatFilter(null);
    setFieldFilter(null);
    setSkillFilter(null);
    setSearch('');
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

  const handleCopyEmails = useCallback(() => {
    const emails = filteredCompanies.map((c) => c.contactEmail).join(', ');
    navigator.clipboard.writeText(emails).then(() => {
      setEmailCopied(true);
      setTimeout(() => setEmailCopied(false), 2500);
    });
  }, [filteredCompanies]);

  const handleImport = useCallback(
    (newCompanies: Company[], replace: boolean) => {
      onImportCompanies(newCompanies, replace);
      setShowUploadModal(false);
    },
    [onImportCompanies]
  );

  const noop = useCallback(() => {}, []);
  const role: Role = 'admin';

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-shrink-0">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-sm">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-bold text-slate-800 leading-tight">UniIntern Hub</p>
              <p className="text-xs text-slate-400 leading-tight">Bảng Quản Trị</p>
            </div>
          </div>

          <div className="flex-1 max-w-xl relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm kiếm doanh nghiệp…"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-sm"
            />
            {search && (
              <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-2 bg-indigo-50 border border-indigo-200 px-3 py-1.5 rounded-full">
              <Shield className="w-3.5 h-3.5 text-indigo-600" />
              <span className="text-xs font-semibold text-indigo-600">Quản Trị Viên</span>
            </div>
            <button onClick={onLogout}
              className="flex items-center gap-1.5 text-slate-500 hover:text-red-600 text-sm font-medium transition-colors p-2 rounded-lg hover:bg-red-50">
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Đăng xuất</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-screen-2xl mx-auto px-4 sm:px-6 py-7 space-y-6">
        {/* Tiêu đề + Thanh hành động Admin */}
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Quản Lý Tuyển Dụng</h1>
            <p className="text-slate-500 text-sm mt-1">
              Toàn quyền quản lý — {companies.length} doanh nghiệp &bull; {registrations.length} đăng ký
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Nhập Excel */}
            <button onClick={() => setShowUploadModal(true)} className="btn-secondary">
              <Upload className="w-4 h-4" />
              Nhập Excel
            </button>

            {/* Sao chép Email */}
            <button
              onClick={handleCopyEmails}
              className={`btn-secondary transition-all ${emailCopied ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : ''}`}
            >
              {emailCopied ? (
                <><Check className="w-4 h-4" /> Đã sao chép!</>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  Sao Chép Email
                  {filteredCompanies.length > 0 && (
                    <span className="ml-1 bg-slate-200 text-slate-600 text-xs px-1.5 py-0.5 rounded-md">
                      {filteredCompanies.length}
                    </span>
                  )}
                </>
              )}
            </button>

            {/* Quản lý đăng ký */}
            <button onClick={() => setShowRegModal(true)} className="btn-primary">
              <Users className="w-4 h-4" />
              Quản Lý Đăng Ký
              {registrations.length > 0 && (
                <span className="ml-1 bg-white/25 text-white text-xs px-1.5 py-0.5 rounded-md">
                  {registrations.length}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Thanh bộ lọc đang hoạt động */}
        {activeFilterCount > 0 && (
          <div className="flex items-center gap-3 p-3.5 bg-indigo-50 border border-indigo-200 rounded-xl animate-fade-in">
            <Filter className="w-4 h-4 text-indigo-600 flex-shrink-0" />
            <span className="text-xs font-semibold text-indigo-700">{activeFilterCount} bộ lọc đang áp dụng</span>
            <div className="flex flex-wrap gap-2">
              {statFilter && (
                <span className="badge bg-indigo-100 text-indigo-700">
                  {statFilter === 'gala' ? '⭐ Nhà Tài Trợ Gala' : '📶 Tuyển Dụng Online'}
                  <button onClick={() => setStatFilter(null)} className="ml-1"><X className="w-2.5 h-2.5" /></button>
                </span>
              )}
              {fieldFilter && (
                <span className="badge bg-indigo-100 text-indigo-700">
                  Lĩnh vực: {fieldFilter}
                  <button onClick={() => setFieldFilter(null)} className="ml-1"><X className="w-2.5 h-2.5" /></button>
                </span>
              )}
              {skillFilter && (
                <span className="badge bg-indigo-100 text-indigo-700">
                  Kỹ năng: {skillFilter}
                  <button onClick={() => setSkillFilter(null)} className="ml-1"><X className="w-2.5 h-2.5" /></button>
                </span>
              )}
            </div>
            <button onClick={clearAllFilters} className="ml-auto text-xs text-indigo-600 hover:text-indigo-800 font-medium whitespace-nowrap">
              Bỏ tất cả
            </button>
          </div>
        )}

        {/* Thẻ thống kê */}
        <StatCards companies={companies} activeFilter={statFilter} onFilterChange={setStatFilter} />

        {/* Biểu đồ */}
        <ChartCards
          companies={companies}
          activeFieldFilter={fieldFilter}
          activeSkillFilter={skillFilter}
          onFieldFilter={setFieldFilter}
          onSkillFilter={setSkillFilter}
        />

        {/* Tóm tắt đăng ký */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Tổng Đăng Ký', value: registrations.length, color: 'text-indigo-600', bg: 'bg-indigo-50' },
            { label: 'Theo Danh Sách', value: registrations.filter((r) => !r.isExternal).length, color: 'text-blue-600', bg: 'bg-blue-50' },
            { label: 'Công Ty Ngoài', value: registrations.filter((r) => r.isExternal).length, color: 'text-violet-600', bg: 'bg-violet-50' },
            { label: 'Chỉ Tiêu Còn Lại', value: companies.reduce((s, c) => s + c.availableSlots, 0), color: 'text-emerald-600', bg: 'bg-emerald-50' },
          ].map((item) => (
            <div key={item.label} className={`card p-4 ${item.bg} border-0`}>
              <p className={`text-2xl font-bold ${item.color} tabular-nums`}>{item.value}</p>
              <p className="text-xs font-medium text-slate-600 mt-1">{item.label}</p>
            </div>
          ))}
        </div>

        {/* Bảng doanh nghiệp */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-slate-800">
              Danh Sách Doanh Nghiệp{' '}
              {filteredCompanies.length < companies.length && (
                <span className="text-base font-normal text-slate-400">
                  ({filteredCompanies.length} / {companies.length})
                </span>
              )}
            </h2>
            {filteredCompanies.length > 0 && (
              <p className="text-xs text-slate-400">
                Sao chép email của <span className="font-semibold">{filteredCompanies.length}</span> doanh nghiệp đang hiển thị
              </p>
            )}
          </div>
          <CompanyTable companies={filteredCompanies} role={role} onRegister={noop} />
        </div>
      </main>

      {/* Modal Quản Lý Đăng Ký */}
      {showRegModal && (
        <ManageRegistrationsModal
          registrations={registrations}
          onClose={() => setShowRegModal(false)}
          onDelete={onDeleteRegistration}
        />
      )}

      {/* Modal Nhập Excel */}
      {showUploadModal && (
        <UploadExcelModal
          onClose={() => setShowUploadModal(false)}
          onImport={(companies, replace) => handleImport(companies, replace)}
        />
      )}
    </div>
  );
}
