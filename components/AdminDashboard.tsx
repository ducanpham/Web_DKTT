'use client';

import React, { useState, useMemo, useCallback } from 'react';
import {
  Shield,
  Search,
  LogOut,
  Upload,
  Copy,
  Users,
  Check,
  X,
  Filter,
} from 'lucide-react';
import { Company, Registration, Role } from '@/lib/data';
import StatCards from './StatCards';
import ChartCards from './ChartCards';
import CompanyTable from './CompanyTable';
import ManageRegistrationsModal from './ManageRegistrationsModal';

interface AdminDashboardProps {
  companies: Company[];
  registrations: Registration[];
  onDeleteRegistration: (id: string) => void;
  onLogout: () => void;
}

export default function AdminDashboard({
  companies,
  registrations,
  onDeleteRegistration,
  onLogout,
}: AdminDashboardProps) {
  const [search, setSearch] = useState('');
  const [statFilter, setStatFilter] = useState<string | null>(null);
  const [fieldFilter, setFieldFilter] = useState<string | null>(null);
  const [skillFilter, setSkillFilter] = useState<string | null>(null);
  const [showRegModal, setShowRegModal] = useState(false);
  const [emailCopied, setEmailCopied] = useState(false);
  const [uploadToast, setUploadToast] = useState(false);

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

  const handleUploadClick = () => {
    setUploadToast(true);
    setTimeout(() => setUploadToast(false), 3000);
  };

  // Admin view doesn't need register (no-op)
  const noop = useCallback(() => {}, []);

  const role: Role = 'admin';

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Toast notifications */}
      {uploadToast && (
        <div className="fixed top-4 right-4 z-50 animate-slide-up">
          <div className="bg-white border border-slate-200 shadow-xl rounded-2xl px-5 py-4 flex items-center gap-3 max-w-sm">
            <div className="w-9 h-9 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
              <Upload className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-800">Excel Upload</p>
              <p className="text-xs text-slate-500">File picker would open here (UI demo)</p>
            </div>
            <button onClick={() => setUploadToast(false)} className="text-slate-400 hover:text-slate-600 ml-2">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-sm">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-bold text-slate-800 leading-tight">UniIntern Hub</p>
              <p className="text-xs text-slate-400 leading-tight">Admin Panel</p>
            </div>
          </div>

          {/* Search */}
          <div className="flex-1 max-w-xl relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search companies…"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-sm"
            />
            {search && (
              <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            {/* Role badge */}
            <div className="hidden sm:flex items-center gap-2 bg-indigo-50 border border-indigo-200 px-3 py-1.5 rounded-full">
              <Shield className="w-3.5 h-3.5 text-indigo-600" />
              <span className="text-xs font-semibold text-indigo-600">Admin</span>
            </div>

            <button
              onClick={onLogout}
              className="flex items-center gap-1.5 text-slate-500 hover:text-red-600 text-sm font-medium transition-colors p-2 rounded-lg hover:bg-red-50"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-screen-2xl mx-auto px-4 sm:px-6 py-7 space-y-6">
        {/* Page Header + Admin Action Bar */}
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Recruitment Management</h1>
            <p className="text-slate-500 text-sm mt-1">
              Full access — {companies.length} companies &bull; {registrations.length} total registrations
            </p>
          </div>

          {/* Admin Action Bar */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Upload Excel */}
            <button
              onClick={handleUploadClick}
              className="btn-secondary"
            >
              <Upload className="w-4 h-4" />
              Upload Excel
            </button>

            {/* Copy Emails */}
            <button
              onClick={handleCopyEmails}
              className={`btn-secondary transition-all ${emailCopied ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : ''}`}
            >
              {emailCopied ? (
                <>
                  <Check className="w-4 h-4" />
                  Emails Copied!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  Copy Emails
                  {filteredCompanies.length > 0 && (
                    <span className="ml-1 bg-slate-200 text-slate-600 text-xs px-1.5 py-0.5 rounded-md">
                      {filteredCompanies.length}
                    </span>
                  )}
                </>
              )}
            </button>

            {/* Manage Registrations */}
            <button
              onClick={() => setShowRegModal(true)}
              className="btn-primary"
            >
              <Users className="w-4 h-4" />
              Manage Registrations
              {registrations.length > 0 && (
                <span className="ml-1 bg-white/25 text-white text-xs px-1.5 py-0.5 rounded-md">
                  {registrations.length}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Active filters bar */}
        {activeFilterCount > 0 && (
          <div className="flex items-center gap-3 p-3.5 bg-indigo-50 border border-indigo-200 rounded-xl animate-fade-in">
            <Filter className="w-4 h-4 text-indigo-600 flex-shrink-0" />
            <span className="text-xs font-semibold text-indigo-700">
              {activeFilterCount} filter{activeFilterCount > 1 ? 's' : ''} active
            </span>
            <div className="flex flex-wrap gap-2">
              {statFilter && (
                <span className="badge bg-indigo-100 text-indigo-700">
                  {statFilter === 'gala' ? '⭐ Gala Sponsors' : '📶 Online Recruitment'}
                  <button onClick={() => setStatFilter(null)} className="ml-1"><X className="w-2.5 h-2.5" /></button>
                </span>
              )}
              {fieldFilter && (
                <span className="badge bg-indigo-100 text-indigo-700">
                  Field: {fieldFilter}
                  <button onClick={() => setFieldFilter(null)} className="ml-1"><X className="w-2.5 h-2.5" /></button>
                </span>
              )}
              {skillFilter && (
                <span className="badge bg-indigo-100 text-indigo-700">
                  Skill: {skillFilter}
                  <button onClick={() => setSkillFilter(null)} className="ml-1"><X className="w-2.5 h-2.5" /></button>
                </span>
              )}
            </div>
            <button onClick={clearAllFilters} className="ml-auto text-xs text-indigo-600 hover:text-indigo-800 font-medium whitespace-nowrap">
              Clear all
            </button>
          </div>
        )}

        {/* Stat Cards */}
        <StatCards
          companies={companies}
          activeFilter={statFilter}
          onFilterChange={setStatFilter}
        />

        {/* Charts */}
        <ChartCards
          companies={companies}
          activeFieldFilter={fieldFilter}
          activeSkillFilter={skillFilter}
          onFieldFilter={setFieldFilter}
          onSkillFilter={setSkillFilter}
        />

        {/* Summary row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            {
              label: 'Total Registrations',
              value: registrations.length,
              color: 'text-indigo-600',
              bg: 'bg-indigo-50',
            },
            {
              label: 'Assigned (Company List)',
              value: registrations.filter((r) => !r.isExternal).length,
              color: 'text-blue-600',
              bg: 'bg-blue-50',
            },
            {
              label: 'External / Self-Found',
              value: registrations.filter((r) => r.isExternal).length,
              color: 'text-violet-600',
              bg: 'bg-violet-50',
            },
            {
              label: 'Slots Still Available',
              value: companies.reduce((s, c) => s + c.availableSlots, 0),
              color: 'text-emerald-600',
              bg: 'bg-emerald-50',
            },
          ].map((item) => (
            <div key={item.label} className={`card p-4 ${item.bg} border-0`}>
              <p className={`text-2xl font-bold ${item.color} tabular-nums`}>{item.value}</p>
              <p className="text-xs font-medium text-slate-600 mt-1">{item.label}</p>
            </div>
          ))}
        </div>

        {/* Table */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-slate-800">
              Companies{' '}
              {filteredCompanies.length < companies.length && (
                <span className="text-base font-normal text-slate-400">
                  ({filteredCompanies.length} of {companies.length})
                </span>
              )}
            </h2>
            {filteredCompanies.length > 0 && (
              <p className="text-xs text-slate-400">
                Copying emails from{' '}
                <span className="font-semibold">{filteredCompanies.length}</span> companies
              </p>
            )}
          </div>
          <CompanyTable
            companies={filteredCompanies}
            role={role}
            onRegister={noop}
          />
        </div>
      </main>

      {/* Manage Registrations Modal */}
      {showRegModal && (
        <ManageRegistrationsModal
          registrations={registrations}
          onClose={() => setShowRegModal(false)}
          onDelete={onDeleteRegistration}
        />
      )}
    </div>
  );
}
