'use client';

import React, { useState } from 'react';
import {
  Star, Wifi, ChevronDown, ChevronUp, Globe, Phone, Mail, User,
  Layers, Utensils, Home, Banknote, Lock, GraduationCap, Briefcase, Presentation, BookOpen, Clock
} from 'lucide-react';
import { Company, Role, StudentViewConfig } from '@/lib/data';
import { RegisterModal } from './RegistrationModals';

function getQOptionBadge(option: string) {
  const text = option.toLowerCase();
  if (text.includes('lễ tốt nghiệp')) return { icon: <GraduationCap className="w-3.5 h-3.5" />, text: 'Lễ tốt nghiệp (19/7)', color: 'bg-amber-50 text-amber-700 border border-amber-200' };
  if (text.includes('đồ án tốt nghiệp')) return { icon: <BookOpen className="w-3.5 h-3.5" />, text: 'Hướng dẫn ĐATN', color: 'bg-blue-50 text-blue-700 border border-blue-200' };
  if (text.includes('job fair')) return { icon: <Briefcase className="w-3.5 h-3.5" />, text: 'Job Fair / Tuyển dụng', color: 'bg-emerald-50 text-emerald-700 border border-emerald-200' };
  if (text.includes('hội thảo chuyên đề')) return { icon: <Presentation className="w-3.5 h-3.5" />, text: 'Hội thảo / Định hướng', color: 'bg-violet-50 text-violet-700 border border-violet-200' };
  return { icon: <Clock className="w-3.5 h-3.5" />, text: 'Chưa sắp xếp', color: 'bg-slate-50 text-slate-600 border border-slate-200' };
}

interface CompanyTableProps {
  companies: Company[];
  role: Role;
  viewConfig?: StudentViewConfig;
  onRegister: (companyId: string, studentId: string, studentName: string, phone: string, email: string, internClass: string, expectedSkills?: string) => Promise<string | null>;
}


function SlotProgress({ available, total }: { available: number; total: number }) {
  const filled = total - available;
  const pct = total > 0 ? (filled / total) * 100 : 0;
  const color = pct >= 90 ? 'bg-red-500' : pct >= 60 ? 'bg-amber-500' : 'bg-emerald-500';
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs text-slate-500 font-medium">{filled} đã đăng ký / {total} tổng</span>
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

function CompanyRow({ company, role, viewConfig, onRegister }: {
  company: Company;
  role: Role;
  viewConfig?: StudentViewConfig;
  onRegister: (companyId: string, studentId: string, studentName: string, phone: string, email: string, internClass: string, expectedSkills?: string) => Promise<string | null>
}) {
  const [expanded, setExpanded] = useState(false);
  const [registerModal, setRegisterModal] = useState(false);
  const hasSlots = company.availableSlots > 0;

  const handleRegSubmit = async (studentId: string, studentName: string, phone: string, email: string, internClass: string, expectedSkills: string) => {
    return await onRegister(company.id, studentId, studentName, phone, email, internClass, expectedSkills);
  };

  return (
    <>
      <tr className="table-row">
        {/* Tên công ty */}
        <td className="px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-xl flex-shrink-0 shadow-sm">
              {company.logo}
            </div>
            <div>
              <p className="font-semibold text-slate-800 text-sm leading-tight">{company.name}</p>
              {role === 'admin' && <p className="text-xs text-slate-400 mt-0.5">{company.industry}</p>}
              {(role === 'admin' || viewConfig?.showCompanyAddress) && company.address && (
                <div className="flex items-start gap-1 text-xs text-slate-500 mt-1">
                  <Home className="w-3 h-3 mt-0.5 shrink-0" />
                  <span className="line-clamp-1" title={company.address}>{company.address}</span>
                </div>
              )}
              <div className="flex items-center gap-1.5 mt-1">
                {company.isGalaSponsor && (
                  <span className="badge bg-amber-100 text-amber-700 gap-1"><Star className="w-3 h-3" /> Gala</span>
                )}
                {company.isOnlineRecruitment && (
                  <span className="badge bg-emerald-100 text-emerald-700 gap-1"><Wifi className="w-3 h-3" /> Online</span>
                )}
              </div>
            </div>
          </div>
        </td>

        {/* Lĩnh vực */}
        {(role === 'admin' || viewConfig?.showFields) && (
          <td className="px-5 py-4 hidden md:table-cell">
            <div className="flex flex-wrap gap-1.5">
              {company.fields.slice(0, 2).map((f) => (
                <span key={f} className="badge bg-blue-50 text-blue-700 font-medium">{f}</span>
              ))}
              {company.fields.length > 2 && <span className="badge bg-slate-100 text-slate-500">+{company.fields.length - 2}</span>}
            </div>
          </td>
        )}

        {/* Kỹ năng */}
        {(role === 'admin' || viewConfig?.showSkills) && (
          <td className="px-5 py-4 hidden lg:table-cell">
            <div className="flex flex-wrap gap-1.5">
              {company.skills.slice(0, 3).map((s) => (
                <span key={s} className="badge bg-violet-50 text-violet-700 font-mono text-xs">{s}</span>
              ))}
              {company.skills.length > 3 && <span className="badge bg-slate-100 text-slate-500">+{company.skills.length - 3}</span>}
            </div>
          </td>
        )}

        {/* Admin: Liên hệ */}
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
                <a href={`mailto:${company.contactEmail}`} className="hover:underline truncate max-w-[160px]">{company.contactEmail}</a>
              </div>
            </div>
          </td>
        )}

        {/* Sinh viên: ẩn thông tin liên hệ */}
        {role === 'student' && (
          <td className="px-5 py-4 hidden xl:table-cell">
            <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-50 rounded-lg px-3 py-2">
              <Lock className="w-3.5 h-3.5" />
              <span>Thông tin bị ẩn</span>
            </div>
          </td>
        )}

        {/* Chỉ tiêu / Hành động */}
        {(role === 'admin' || viewConfig?.showSlots) && (
          <td className="px-5 py-4">
            {role === 'student' ? (
              <div className="flex flex-col items-start gap-2">
                <span className={`badge font-semibold ${hasSlots ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-600'}`}>
                  <Layers className="w-3 h-3" />
                  {hasSlots ? `${company.availableSlots} chỉ tiêu` : 'Hết chỗ'}
                </span>
                <button onClick={() => {
                  if (viewConfig?.enableFallback && viewConfig?.fallbackFormUrl) {
                    window.open(viewConfig.fallbackFormUrl, '_blank');
                  } else {
                    setRegisterModal(true);
                  }
                }} disabled={!hasSlots}
                  className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-all ${
                    hasSlots ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm hover:shadow-md' : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  }`}>
                  {hasSlots ? 'Đăng ký' : 'Hết chỗ'}
                </button>
              </div>
            ) : (
              <div className="min-w-[130px]">
                <SlotProgress available={company.availableSlots} total={company.totalSlots} />
                <p className="text-xs text-slate-500 mt-1.5">Còn {company.availableSlots} chỉ tiêu</p>
              </div>
            )}
          </td>
        )}
        {role === 'student' && !viewConfig?.showSlots && (
          <td className="px-5 py-4">
            <button onClick={() => {
              if (viewConfig?.enableFallback && viewConfig?.fallbackFormUrl) {
                window.open(viewConfig.fallbackFormUrl, '_blank');
              } else {
                setRegisterModal(true);
              }
            }} disabled={!hasSlots}
              className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-all ${
                hasSlots ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm hover:shadow-md' : 'bg-slate-100 text-slate-400 cursor-not-allowed'
              }`}>
              {hasSlots ? 'Đăng ký' : 'Hết chỗ'}
            </button>
          </td>
        )}

        {/* Mở rộng */}
        <td className="px-3 py-4">
          <button onClick={() => setExpanded(!expanded)}
            className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors">
            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </td>
      </tr>

      {/* Chi tiết mở rộng */}
      {expanded && (
        <tr className="bg-slate-50/70">
          <td colSpan={6} className="px-5 pb-5 pt-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 animate-fade-in">
              {/* Phúc lợi */}
              {(role === 'admin' || viewConfig?.showBenefits) && (
                <div className="bg-white rounded-xl p-4 border border-slate-100">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Phúc Lợi</p>
                  <div className="space-y-2.5">
                    <div className="flex items-start gap-2.5">
                      <Banknote className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-xs font-semibold text-slate-600">Phụ cấp</p>
                        <p className="text-xs text-slate-500">{company.benefits.allowance}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <Utensils className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-xs font-semibold text-slate-600">Bữa ăn</p>
                        <p className="text-xs text-slate-500">{company.benefits.meals}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <Home className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-xs font-semibold text-slate-600">Chỗ ở</p>
                        <p className="text-xs text-slate-500">{company.benefits.housing}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Tất cả lĩnh vực & kỹ năng */}
              {(role === 'admin' || viewConfig?.showFields || viewConfig?.showSkills) && (
                <div className="bg-white rounded-xl p-4 border border-slate-100">
                  {(role === 'admin' || viewConfig?.showFields) && (
                    <>
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Lĩnh Vực</p>
                      <div className="flex flex-wrap gap-1.5">
                        {company.fields.map((f) => <span key={f} className="badge bg-blue-50 text-blue-700">{f}</span>)}
                      </div>
                    </>
                  )}
                  {(role === 'admin' || viewConfig?.showSkills) && (
                    <>
                      <p className={`text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 ${(role === 'admin' || viewConfig?.showFields) ? 'mt-3' : ''}`}>Kỹ Năng</p>
                      <div className="flex flex-wrap gap-1.5">
                        {company.skills.map((s) => <span key={s} className="badge bg-violet-50 text-violet-700 font-mono text-xs">{s}</span>)}
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* Liên hệ hoặc thông báo ẩn */}
              <div className="bg-white rounded-xl p-4 border border-slate-100">
                {role === 'admin' || viewConfig?.showCompanyAddress || viewConfig?.showContactPerson ? (
                  <>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Thông Tin Liên Hệ</p>
                    <div className="space-y-2">
                      {(role === 'admin' || viewConfig?.showContactPerson) && (
                        <>
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
                            <a href={`mailto:${company.contactEmail}`} className="text-blue-600 hover:underline">{company.contactEmail}</a>
                          </div>
                        </>
                      )}
                      {(role === 'admin' || viewConfig?.showCompanyAddress) && (
                        <>
                          <div className="flex items-start gap-2 text-sm">
                            <Globe className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                            <a href={company.website} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">
                              {company.website.replace('https://', '')}
                            </a>
                          </div>
                          <div className="flex items-start gap-2 text-sm">
                            <Home className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                            <span className="text-slate-700">{company.address}</span>
                          </div>
                        </>
                      )}
                    </div>
                  </>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center py-4">
                    <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mb-3">
                      <Lock className="w-6 h-6 text-slate-400" />
                    </div>
                    <p className="text-sm font-semibold text-slate-600">Thông tin liên hệ được bảo mật</p>
                    <p className="text-xs text-slate-400 mt-1">Chỉ quản trị viên mới được xem. Hãy đăng ký để bày tỏ sự quan tâm.</p>
                  </div>
                )}
              </div>

              {/* Các sự kiện tham gia (chỉ Admin) */}
              {role === 'admin' && company.qOptions && company.qOptions.length > 0 && (
                <div className="bg-white rounded-xl p-4 border border-slate-100 sm:col-span-2 lg:col-span-1">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Sự Kiện Tham Gia (Cột Q)</p>
                  <div className="flex flex-col gap-2">
                    {company.qOptions.map((opt, i) => {
                      const badge = getQOptionBadge(opt);
                      return (
                        <div key={i} className={`flex items-start gap-2 px-3 py-2 rounded-lg text-xs font-medium border shadow-sm ${badge.color}`}>
                          <div className="mt-0.5 flex-shrink-0">{badge.icon}</div>
                          <span className="leading-relaxed">{badge.text}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </td>
        </tr>
      )}

      {registerModal && (
        <RegisterModal companyId={company.id} companyName={company.name} availableSlots={company.availableSlots}
          onClose={() => setRegisterModal(false)} onSubmit={handleRegSubmit} />
      )}
    </>
  );
}

export default function CompanyTable({ companies, role, viewConfig, onRegister }: CompanyTableProps) {
  if (companies.length === 0) {
    return (
      <div className="card p-16 text-center">
        <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
          <span className="text-4xl">🔍</span>
        </div>
        <p className="text-slate-600 font-semibold text-lg">Không tìm thấy công ty nào</p>
        <p className="text-slate-400 text-sm mt-1">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
      </div>
    );
  }

  return (
    <div className="card overflow-hidden">
      <div className="table-scroll">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/70">
              <th className="table-header px-5 py-3.5 text-left">Doanh Nghiệp</th>
              {(role === 'admin' || viewConfig?.showFields) && (
                <th className="table-header px-5 py-3.5 text-left hidden md:table-cell">Lĩnh Vực</th>
              )}
              {(role === 'admin' || viewConfig?.showSkills) && (
                <th className="table-header px-5 py-3.5 text-left hidden lg:table-cell">Kỹ Năng</th>
              )}
              <th className="table-header px-5 py-3.5 text-left hidden xl:table-cell">
                {role === 'admin' ? 'Liên Hệ' : 'Bảo Mật'}
              </th>
              {(role === 'admin' || viewConfig?.showSlots) && (
                <th className="table-header px-5 py-3.5 text-left">
                  {role === 'student' ? 'Chỉ Tiêu' : 'Tiến Độ Chỉ Tiêu'}
                </th>
              )}
              {role === 'student' && !viewConfig?.showSlots && (
                <th className="table-header px-5 py-3.5 text-left">Đăng Ký</th>
              )}
              <th className="px-3 py-3.5"></th>
            </tr>
          </thead>
          <tbody>
            {companies.map((company) => (
              <CompanyRow key={company.id} company={company} role={role} viewConfig={viewConfig} onRegister={onRegister} />
            ))}
          </tbody>
        </table>
      </div>
      <div className="px-5 py-3 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
        <p className="text-xs text-slate-400">Hiển thị {companies.length} doanh nghiệp</p>
        <p className="text-xs text-slate-400">Nhấn <ChevronDown className="w-3 h-3 inline" /> để xem chi tiết</p>
      </div>
    </div>
  );
}
