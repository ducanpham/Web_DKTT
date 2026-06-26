'use client';

import React, { useState } from 'react';
import {
  Star,
  Wifi,
  ChevronDown,
  ChevronUp,
  Globe,
  Phone,
  Mail,
  User,
  Layers,
  Utensils,
  Home,
  Banknote,
  Lock,
} from 'lucide-react';
import { Company, Role } from '@/lib/data';
import { RegisterModal } from './RegistrationModals';

interface CompanyTableProps {
  companies: Company[];
  role: Role;
  onRegister: (companyId: string, studentId: string, studentName: string) => void;
}

function SlotProgress({ available, total }: { available: number; total: number }) {
  const filled = total - available;
  const pct = total > 0 ? (filled / total) * 100 : 0;
  const color = pct >= 90 ? 'bg-red-500' : pct >= 60 ? 'bg-amber-500' : 'bg-emerald-500';

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs text-slate-500 font-medium">{filled} filled / {total} total</span>
        <span className={`text-xs font-bold ${pct >= 90 ? 'text-red-600' : pct >= 60 ? 'text-amber-600' : 'text-emerald-600'}`}>
          {Math.round(pct)}%
        </span>
      </div>
      <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all duration-500 ${color}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

function CompanyRow({ company, role, onRegister }: { company: Company; role: Role; onRegister: (id: string, sid: string, sn: string) => void }) {
  const [expanded, setExpanded] = useState(false);
  const [registerModal, setRegisterModal] = useState(false);

  const hasSlots = company.availableSlots > 0;

  const handleRegSubmit = (studentId: string, studentName: string) => {
    onRegister(company.id, studentId, studentName);
    setRegisterModal(false);
  };

  return (
    <>
      {/* Main Row */}
      <tr className="table-row">
        {/* Company Name */}
        <td className="px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-xl flex-shrink-0 shadow-sm">
              {company.logo}
            </div>
            <div>
              <p className="font-semibold text-slate-800 text-sm leading-tight">{company.name}</p>
              {role === 'admin' && (
                <p className="text-xs text-slate-400 mt-0.5">{company.industry}</p>
              )}
              <div className="flex items-center gap-1.5 mt-1">
                {company.isGalaSponsor && (
                  <span className="badge bg-amber-100 text-amber-700 gap-1">
                    <Star className="w-3 h-3" /> Gala
                  </span>
                )}
                {company.isOnlineRecruitment && (
                  <span className="badge bg-emerald-100 text-emerald-700 gap-1">
                    <Wifi className="w-3 h-3" /> Online
                  </span>
                )}
              </div>
            </div>
          </div>
        </td>

        {/* Fields */}
        <td className="px-5 py-4 hidden md:table-cell">
          <div className="flex flex-wrap gap-1.5">
            {company.fields.slice(0, 2).map((f) => (
              <span key={f} className="badge bg-blue-50 text-blue-700 font-medium">{f}</span>
            ))}
            {company.fields.length > 2 && (
              <span className="badge bg-slate-100 text-slate-500">+{company.fields.length - 2}</span>
            )}
          </div>
        </td>

        {/* Skills */}
        <td className="px-5 py-4 hidden lg:table-cell">
          <div className="flex flex-wrap gap-1.5">
            {company.skills.slice(0, 3).map((s) => (
              <span key={s} className="badge bg-violet-50 text-violet-700 font-mono text-xs">{s}</span>
            ))}
            {company.skills.length > 3 && (
              <span className="badge bg-slate-100 text-slate-500">+{company.skills.length - 3}</span>
            )}
          </div>
        </td>

        {/* Admin-only: Contact */}
        {role === 'admin' && (
          <td className="px-5 py-4 hidden xl:table-cell">
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-xs text-slate-600">
                <User className="w-3 h-3 text-slate-400 flex-shrink-0" />
                <span className="truncate max-w-[140px]">{company.contactName}</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-slate-600">
                <Phone className="w-3 h-3 text-slate-400 flex-shrink-0" />
                <span>{company.contactPhone}</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-blue-600">
                <Mail className="w-3 h-3 text-blue-400 flex-shrink-0" />
                <a href={`mailto:${company.contactEmail}`} className="hover:underline truncate max-w-[160px]">
                  {company.contactEmail}
                </a>
              </div>
            </div>
          </td>
        )}

        {/* Hidden contact shield (student) */}
        {role === 'student' && (
          <td className="px-5 py-4 hidden xl:table-cell">
            <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-50 rounded-lg px-3 py-2">
              <Lock className="w-3.5 h-3.5" />
              <span>Contact info hidden</span>
            </div>
          </td>
        )}

        {/* Slots / Action */}
        <td className="px-5 py-4">
          {role === 'student' ? (
            <div className="flex flex-col items-start gap-2">
              <span className={`badge font-semibold ${hasSlots ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-600'}`}>
                <Layers className="w-3 h-3" />
                {hasSlots ? `${company.availableSlots} slots` : 'Full'}
              </span>
              <button
                onClick={() => setRegisterModal(true)}
                disabled={!hasSlots}
                className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-all ${
                  hasSlots
                    ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm hover:shadow-md'
                    : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                }`}
              >
                {hasSlots ? 'Register' : 'No Slots'}
              </button>
            </div>
          ) : (
            <div className="min-w-[130px]">
              <SlotProgress available={company.availableSlots} total={company.totalSlots} />
              <p className="text-xs text-slate-500 mt-1.5">{company.availableSlots} remaining</p>
            </div>
          )}
        </td>

        {/* Expand Button */}
        <td className="px-3 py-4">
          <button
            onClick={() => setExpanded(!expanded)}
            className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
          >
            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </td>
      </tr>

      {/* Expanded Details Row */}
      {expanded && (
        <tr className="bg-slate-50/70">
          <td colSpan={role === 'admin' ? 6 : 6} className="px-5 pb-5 pt-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 animate-fade-in">
              {/* Benefits */}
              <div className="bg-white rounded-xl p-4 border border-slate-100">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Benefits</p>
                <div className="space-y-2.5">
                  <div className="flex items-start gap-2.5">
                    <Banknote className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs font-semibold text-slate-600">Allowance</p>
                      <p className="text-xs text-slate-500">{company.benefits.allowance}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <Utensils className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs font-semibold text-slate-600">Meals</p>
                      <p className="text-xs text-slate-500">{company.benefits.meals}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <Home className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs font-semibold text-slate-600">Housing</p>
                      <p className="text-xs text-slate-500">{company.benefits.housing}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* All Fields */}
              <div className="bg-white rounded-xl p-4 border border-slate-100">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">All Fields</p>
                <div className="flex flex-wrap gap-1.5">
                  {company.fields.map((f) => (
                    <span key={f} className="badge bg-blue-50 text-blue-700">{f}</span>
                  ))}
                </div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-3 mb-2">All Skills</p>
                <div className="flex flex-wrap gap-1.5">
                  {company.skills.map((s) => (
                    <span key={s} className="badge bg-violet-50 text-violet-700 font-mono text-xs">{s}</span>
                  ))}
                </div>
              </div>

              {/* Admin: Contact & Website | Student: Privacy notice */}
              <div className="bg-white rounded-xl p-4 border border-slate-100">
                {role === 'admin' ? (
                  <>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Contact Details</p>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <User className="w-4 h-4 text-slate-400" />
                        <span className="text-slate-700">{company.contactName}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="w-4 h-4 text-slate-400" />
                        <span className="text-slate-700">{company.contactPhone}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="w-4 h-4 text-slate-400" />
                        <a href={`mailto:${company.contactEmail}`} className="text-blue-600 hover:underline">
                          {company.contactEmail}
                        </a>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Globe className="w-4 h-4 text-slate-400" />
                        <a href={company.website} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline truncate">
                          {company.website.replace('https://', '')}
                        </a>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center py-4">
                    <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mb-3">
                      <Lock className="w-6 h-6 text-slate-400" />
                    </div>
                    <p className="text-sm font-semibold text-slate-600">Contact Info Private</p>
                    <p className="text-xs text-slate-400 mt-1">
                      Contact details are only visible to administrators. Register to express your interest.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </td>
        </tr>
      )}

      {/* Register Modal */}
      {registerModal && (
        <RegisterModal
          companyId={company.id}
          companyName={company.name}
          availableSlots={company.availableSlots}
          onClose={() => setRegisterModal(false)}
          onSubmit={handleRegSubmit}
        />
      )}
    </>
  );
}

export default function CompanyTable({ companies, role, onRegister }: CompanyTableProps) {
  if (companies.length === 0) {
    return (
      <div className="card p-16 text-center">
        <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
          <span className="text-4xl">🔍</span>
        </div>
        <p className="text-slate-600 font-semibold text-lg">No companies found</p>
        <p className="text-slate-400 text-sm mt-1">Try adjusting your filters or search query</p>
      </div>
    );
  }

  return (
    <div className="card overflow-hidden">
      <div className="table-scroll">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/70">
              <th className="table-header px-5 py-3.5 text-left">Company</th>
              <th className="table-header px-5 py-3.5 text-left hidden md:table-cell">Fields</th>
              <th className="table-header px-5 py-3.5 text-left hidden lg:table-cell">Skills</th>
              <th className="table-header px-5 py-3.5 text-left hidden xl:table-cell">
                {role === 'admin' ? 'Contact' : 'Privacy'}
              </th>
              <th className="table-header px-5 py-3.5 text-left">
                {role === 'student' ? 'Slots / Action' : 'Slot Progress'}
              </th>
              <th className="px-3 py-3.5"></th>
            </tr>
          </thead>
          <tbody>
            {companies.map((company) => (
              <CompanyRow
                key={company.id}
                company={company}
                role={role}
                onRegister={onRegister}
              />
            ))}
          </tbody>
        </table>
      </div>
      <div className="px-5 py-3 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
        <p className="text-xs text-slate-400">
          Showing {companies.length} {companies.length === 1 ? 'company' : 'companies'}
        </p>
        <p className="text-xs text-slate-400">
          Click <ChevronDown className="w-3 h-3 inline" /> to expand details
        </p>
      </div>
    </div>
  );
}
