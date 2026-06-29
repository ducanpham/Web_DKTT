'use client';

import React, { useState, useMemo, useCallback } from 'react';
import Image from 'next/image';
import { Shield, Search, LogOut, Upload, Copy, Users, Check, X, Filter, BookOpen, Wrench, Link, Save, Settings, RefreshCcw, ClipboardList } from 'lucide-react';
import { Company, Registration, Role, InternshipGuide, StudentViewConfig, saveConfigToAPI } from '@/lib/data';
import StatCards from './StatCards';
import ChartCards from './ChartCards';
import CompanyTable from './CompanyTable';
import ManageRegistrationsModal from './ManageRegistrationsModal';
import UploadExcelModal from './UploadExcelModal';
import WeeklyReportModal from './WeeklyReportModal';

interface AdminDashboardProps {
  companies: Company[];
  registrations: Registration[];
  guide: InternshipGuide;
  viewConfig: StudentViewConfig;
  onDeleteRegistration: (id: string) => void;
  onImportCompanies: (newCompanies: Company[], replace: boolean) => void;
  onImportRegistrations: (newRegs: Registration[]) => void;
  onUpdateGuide: (guide: InternshipGuide) => void;
  onUpdateViewConfig: (config: StudentViewConfig) => void;
  onLogout: () => void;
  onSyncGoogleSheets?: () => Promise<void>;
}

export default function AdminDashboard({
  companies,
  registrations,
  guide,
  viewConfig,
  onDeleteRegistration,
  onImportCompanies,
  onImportRegistrations,
  onUpdateGuide,
  onUpdateViewConfig,
  onLogout,
  onSyncGoogleSheets
}: AdminDashboardProps) {
  const [search, setSearch] = useState('');
  const [isSyncingAPI, setIsSyncingAPI] = useState(false);
  const [statFilter, setStatFilter] = useState<string | null>(null);
  const [fieldFilter, setFieldFilter] = useState<string | null>(null);
  const [skillFilter, setSkillFilter] = useState<string | null>(null);
  const [showRegModal, setShowRegModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showWeeklyModal, setShowWeeklyModal] = useState(false);
  const [showGuidePanel, setShowGuidePanel] = useState(false);
  const [showViewPanel, setShowViewPanel] = useState(false);
  const [emailCopied, setEmailCopied] = useState(false);
  const [guideDraft, setGuideDraft] = useState<InternshipGuide>(guide);
  const [viewConfigDraft, setViewConfigDraft] = useState<StudentViewConfig>(viewConfig);
  const [guideSaved, setGuideSaved] = useState(false);
  const [viewSaved, setViewSaved] = useState(false);

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
      if (statFilter === 'online-gala' && !(c.isOnlineRecruitment && c.isGalaSponsor)) return false;
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

  const handleSaveGuide = useCallback(async () => {
    onUpdateGuide(guideDraft);
    if (viewConfig.appsScriptUrl) {
      await saveConfigToAPI(viewConfig.appsScriptUrl, 'saveGuide', guideDraft);
    }
    setGuideSaved(true);
    setTimeout(() => setGuideSaved(false), 2000);
    setShowGuidePanel(false);
  }, [guideDraft, onUpdateGuide, viewConfig.appsScriptUrl]);

  const handleSaveViewConfig = useCallback(async () => {
    onUpdateViewConfig(viewConfigDraft);
    if (viewConfigDraft.appsScriptUrl) {
      await saveConfigToAPI(viewConfigDraft.appsScriptUrl, 'saveViewConfig', viewConfigDraft);
    }
    setViewSaved(true);
    setTimeout(() => setViewSaved(false), 2000);
    setShowViewPanel(false);
  }, [viewConfigDraft, onUpdateViewConfig]);

  const noop = useCallback(async () => Promise.resolve(null), []);
  const role: Role = 'admin';

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
            {/* Cấu hình View Sinh Viên */}
            <button onClick={() => setShowViewPanel(!showViewPanel)}
              className={`btn-secondary ${showViewPanel ? 'bg-indigo-50 border-indigo-200 text-indigo-700' : ''}`}>
              <Settings className="w-4 h-4" />
              Giao Diện Sinh Viên
            </button>

            {/* Quản lý Hướng dẫn Thực tập */}
            <button onClick={() => setShowGuidePanel(!showGuidePanel)}
              className={`btn-secondary ${showGuidePanel ? 'bg-indigo-50 border-indigo-200 text-indigo-700' : ''}`}>
              <BookOpen className="w-4 h-4" />
              Hướng Dẫn TT
            </button>

            {/* Đồng bộ API Google Sheets */}
            {viewConfig.appsScriptUrl && onSyncGoogleSheets && (
              <button onClick={async () => {
                setIsSyncingAPI(true);
                try { await onSyncGoogleSheets(); }
                catch(e) { alert('Đồng bộ thất bại. Vui lòng kiểm tra console.'); }
                finally { setIsSyncingAPI(false); }
              }} disabled={isSyncingAPI}
                className="btn-secondary text-indigo-600 hover:bg-indigo-50 hover:border-indigo-200 disabled:opacity-50">
                <RefreshCcw className={`w-4 h-4 ${isSyncingAPI ? 'animate-spin' : ''}`} />
                {isSyncingAPI ? 'Đang đồng bộ...' : 'Đồng bộ từ Sheets API'}
              </button>
            )}

            {/* Nhập Excel */}
            <button onClick={() => setShowUploadModal(true)} className="btn-secondary">
              <Upload className="w-4 h-4" />
              Nhập Excel
            </button>

            {/* Đồng bộ Google Form */}
            <button 
              onClick={async () => {
                if (onSyncGoogleSheets) {
                  setIsSyncingAPI(true);
                  await onSyncGoogleSheets();
                  setIsSyncingAPI(false);
                }
              }} 
              disabled={isSyncingAPI}
              className="btn-secondary text-orange-600 hover:bg-orange-50 hover:border-orange-200 disabled:opacity-50"
            >
              <RefreshCcw className={`w-4 h-4 ${isSyncingAPI ? 'animate-spin' : ''}`} />
              {isSyncingAPI ? 'Đang đồng bộ...' : 'Đồng bộ Form'}
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

            {/* Báo cáo tiến độ */}
            <button onClick={() => setShowWeeklyModal(true)}
              className="btn-secondary text-emerald-600 hover:bg-emerald-50 hover:border-emerald-200">
              <ClipboardList className="w-4 h-4" />
              Báo Cáo Tuần
            </button>
          </div>
        </div>

        {/* Panel Hướng Dẫn Thực Tập */}
        {showGuidePanel && (
          <div className="rounded-2xl border border-indigo-200 bg-indigo-50/60 p-5 animate-fade-in mb-4">
            <div className="flex items-center gap-2 mb-4">
              <BookOpen className="w-5 h-5 text-indigo-600" />
              <h3 className="font-bold text-slate-800">Cấu Hình Hướng Dẫn Thực Tập</h3>
              <span className="text-xs text-slate-400 ml-1">(Link sẽ hiển thị cho sinh viên)</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  <Wrench className="w-4 h-4 inline mr-1 text-slate-500" />
                  Nhãn — Thực tập Kỹ thuật
                </label>
                <input type="text" value={guideDraft.technicalLabel}
                  onChange={(e) => setGuideDraft((p) => ({ ...p, technicalLabel: e.target.value }))}
                  placeholder="Hướng dẫn Thực tập Kỹ thuật"
                  className="input-field text-sm" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  <Link className="w-4 h-4 inline mr-1 text-slate-500" />
                  Link Drive — Thực tập Kỹ thuật
                </label>
                <input type="url" value={guideDraft.technicalLink}
                  onChange={(e) => setGuideDraft((p) => ({ ...p, technicalLink: e.target.value }))}
                  placeholder="https://drive.google.com/..."
                  className="input-field text-sm" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  <BookOpen className="w-4 h-4 inline mr-1 text-slate-500" />
                  Nhãn — Thực tập Kỹ sư Chuyên sâu
                </label>
                <input type="text" value={guideDraft.engineerLabel}
                  onChange={(e) => setGuideDraft((p) => ({ ...p, engineerLabel: e.target.value }))}
                  placeholder="Thực tập Kỹ sư Chuyên sâu"
                  className="input-field text-sm" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  <Link className="w-4 h-4 inline mr-1 text-slate-500" />
                  Link Drive — Thực tập Kỹ sư Chuyên sâu
                </label>
                <input type="url" value={guideDraft.engineerLink}
                  onChange={(e) => setGuideDraft((p) => ({ ...p, engineerLink: e.target.value }))}
                  placeholder="https://drive.google.com/..."
                  className="input-field text-sm" />
              </div>
            </div>
            <div className="flex gap-3 mt-4">
              <button onClick={() => setShowGuidePanel(false)} className="btn-secondary">Hủy</button>
              <button onClick={handleSaveGuide}
                className={`btn-primary ${guideSaved ? 'bg-emerald-500 border-emerald-500' : ''}`}>
                {guideSaved ? <><Check className="w-4 h-4" /> Đã lưu!</> : <><Save className="w-4 h-4" /> Lưu & Công bố</>}
              </button>
            </div>
          </div>
        )}

        {/* Panel Cấu Hình Giao Diện Sinh Viên */}
        {showViewPanel && (
          <div className="rounded-2xl border border-indigo-200 bg-indigo-50/60 p-5 animate-fade-in mb-4">
            <div className="flex items-center gap-2 mb-4">
              <Settings className="w-5 h-5 text-indigo-600" />
              <h3 className="font-bold text-slate-800">Cấu Hình Giao Diện Sinh Viên</h3>
              <span className="text-xs text-slate-400 ml-1">(Bật/tắt các cột hiển thị trong bảng)</span>
            </div>
            <div className="flex flex-wrap gap-6 mb-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={viewConfigDraft.showFields}
                  onChange={(e) => setViewConfigDraft((p) => ({ ...p, showFields: e.target.checked }))}
                  className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500" />
                <span className="text-sm font-medium text-slate-700">Lĩnh vực</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={viewConfigDraft.showSkills}
                  onChange={(e) => setViewConfigDraft((p) => ({ ...p, showSkills: e.target.checked }))}
                  className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500" />
                <span className="text-sm font-medium text-slate-700">Kỹ năng</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={viewConfigDraft.showBenefits}
                  onChange={(e) => setViewConfigDraft((p) => ({ ...p, showBenefits: e.target.checked }))}
                  className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500" />
                <span className="text-sm font-medium text-slate-700">Quyền lợi & Hỗ trợ</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={viewConfigDraft.showSlots}
                  onChange={(e) => setViewConfigDraft((p) => ({ ...p, showSlots: e.target.checked }))}
                  className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500" />
                <span className="text-sm font-medium text-slate-700">Chỉ tiêu / Số lượng</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={viewConfigDraft.showStatCards}
                  onChange={(e) => setViewConfigDraft((p) => ({ ...p, showStatCards: e.target.checked }))}
                  className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500" />
                <span className="text-sm font-medium text-slate-700">Thẻ Thống kê (5 thẻ màu)</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={viewConfigDraft.showCompanyAddress}
                  onChange={(e) => setViewConfigDraft((p) => ({ ...p, showCompanyAddress: e.target.checked }))}
                  className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500" />
                <span className="text-sm font-medium text-slate-700">Địa chỉ Công ty</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={viewConfigDraft.showContactPerson}
                  onChange={(e) => setViewConfigDraft((p) => ({ ...p, showContactPerson: e.target.checked }))}
                  className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500" />
                <span className="text-sm font-medium text-slate-700">Người liên hệ & Điện thoại/Email</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={viewConfigDraft.allowExternalDeclaration}
                  onChange={(e) => setViewConfigDraft((p) => ({ ...p, allowExternalDeclaration: e.target.checked }))}
                  className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500" />
                <span className="text-sm font-medium text-slate-700">Cho phép SV Đề xuất/Khai báo công ty ngoài</span>
              </label>
              
              <div className="border-t border-slate-200 pt-3 mt-1">
                <label className="flex items-center gap-2 cursor-pointer mb-3">
                  <input type="checkbox" checked={viewConfigDraft.enableFallback}
                    onChange={(e) => setViewConfigDraft((p) => ({ ...p, enableFallback: e.target.checked }))}
                    className="w-4 h-4 text-orange-600 rounded border-slate-300 focus:ring-orange-500" />
                  <span className="text-sm font-semibold text-slate-800">Bật Chế độ quá tải (Chuyển hướng Đăng ký sang Google Form)</span>
                </label>
                <input
                  type="url"
                  value={viewConfigDraft.fallbackFormUrl}
                  onChange={(e) => setViewConfigDraft(p => ({ ...p, fallbackFormUrl: e.target.value }))}
                  placeholder="Nhập link Google Form..."
                  className={`w-full text-sm border border-slate-200 rounded-lg px-3 py-2 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all mb-3 ${!viewConfigDraft.enableFallback ? 'opacity-50' : ''}`}
                />
                
                <label className="block text-sm font-semibold text-slate-800 mb-1">
                  API Google Apps Script (Đồng bộ Google Sheets)
                </label>
                <p className="text-xs text-slate-500 mb-2">
                  Dán link Web App URL của Google Apps Script vào đây để kết nối Web với Google Sheets.
                </p>
                <input
                  type="url"
                  value={viewConfigDraft.appsScriptUrl}
                  onChange={(e) => setViewConfigDraft(p => ({ ...p, appsScriptUrl: e.target.value }))}
                  placeholder="https://script.google.com/macros/s/.../exec"
                  className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                />
              </div>

              {/* Báo cáo tiến độ hàng tuần */}
              <div className="border-t border-slate-200 pt-3 mt-1 space-y-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox"
                    checked={viewConfigDraft.weeklyReport?.enabled ?? false}
                    onChange={(e) => setViewConfigDraft(p => ({ ...p, weeklyReport: { ...(p.weeklyReport ?? { googleFormUrl: '', sheetsCsvUrl: '' }), enabled: e.target.checked } }))}
                    className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500" />
                  <span className="text-sm font-semibold text-slate-800">Bật Báo cáo tiến độ hàng tuần</span>
                </label>
                <div className={`space-y-2 pl-6 ${!viewConfigDraft.weeklyReport?.enabled ? 'opacity-50' : ''}`}>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Link Google Form (Sinh viên nộp báo cáo)</label>
                    <input type="url"
                      value={viewConfigDraft.weeklyReport?.googleFormUrl ?? ''}
                      onChange={e => setViewConfigDraft(p => ({ ...p, weeklyReport: { ...(p.weeklyReport ?? { enabled: true, sheetsCsvUrl: '' }), googleFormUrl: e.target.value } }))}
                      placeholder="https://forms.gle/..."
                      className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Link Google Sheets CSV (Admin theo dõi kết quả)</label>
                    <input type="url"
                      value={viewConfigDraft.weeklyReport?.sheetsCsvUrl ?? ''}
                      onChange={e => setViewConfigDraft(p => ({ ...p, weeklyReport: { ...(p.weeklyReport ?? { enabled: true, googleFormUrl: '' }), sheetsCsvUrl: e.target.value } }))}
                      placeholder="https://docs.google.com/spreadsheets/d/.../export?format=csv"
                      className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Sự kiện hướng nghiệp */}
              <div className="border-t border-slate-200 pt-3 mt-1 space-y-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox"
                    checked={viewConfigDraft.careerEvent?.enabled ?? false}
                    onChange={(e) => setViewConfigDraft(p => ({ ...p, careerEvent: { ...(p.careerEvent ?? { url: '' }), enabled: e.target.checked } }))}
                    className="w-4 h-4 text-purple-600 rounded border-slate-300 focus:ring-purple-500" />
                  <span className="text-sm font-semibold text-slate-800">Hiển thị nút Đăng ký Sự kiện Hướng nghiệp</span>
                </label>
                <div className={`space-y-2 pl-6 ${!viewConfigDraft.careerEvent?.enabled ? 'opacity-50' : ''}`}>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Link Đăng ký Sự kiện</label>
                    <input type="url"
                      value={viewConfigDraft.careerEvent?.url ?? ''}
                      onChange={e => setViewConfigDraft(p => ({ ...p, careerEvent: { ...(p.careerEvent ?? { enabled: true }), url: e.target.value } }))}
                      placeholder="https://forms.gle/..."
                      className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition-all"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setShowViewPanel(false)} className="btn-secondary">Hủy</button>
              <button onClick={handleSaveViewConfig}
                className={`btn-primary ${viewSaved ? 'bg-emerald-500 border-emerald-500' : ''}`}>
                {viewSaved ? <><Check className="w-4 h-4" /> Đã lưu!</> : <><Save className="w-4 h-4" /> Áp dụng ngay</>}
              </button>
            </div>
          </div>
        )}

        {/* Thanh bộ lọc đang hoạt động */}
        {activeFilterCount > 0 && (
          <div className="flex items-center gap-3 p-3.5 bg-indigo-50 border border-indigo-200 rounded-xl animate-fade-in">
            <Filter className="w-4 h-4 text-indigo-600 flex-shrink-0" />
            <span className="text-xs font-semibold text-indigo-700">{activeFilterCount} bộ lọc đang áp dụng</span>
            <div className="flex flex-wrap gap-2">
              {statFilter && (
                <span className="badge bg-indigo-100 text-indigo-700">
                  {statFilter === 'gala' ? '⭐ Tham dự Ngày hội TN' : statFilter === 'online' ? '📶 Tuyển Dụng Online' : '⭐ T.Dụng Online & Ngày hội TN'}
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

      {/* Modal Báo cáo Tiến độ Hàng Tuần */}
      {showWeeklyModal && (
        <WeeklyReportModal
          config={viewConfig.weeklyReport ?? { enabled: false, googleFormUrl: '', sheetsCsvUrl: '' }}
          registrations={registrations}
          onClose={() => setShowWeeklyModal(false)}
        />
      )}
    </div>
  );
}
