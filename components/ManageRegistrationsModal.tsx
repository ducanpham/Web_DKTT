'use client';

import React, { useState } from 'react';
import { X, Trash2, Users, ExternalLink, Calendar, Search, Download } from 'lucide-react';
import { Registration } from '@/lib/data';
import * as XLSX from 'xlsx';

interface ManageRegistrationsModalProps {
  registrations: Registration[];
  onClose: () => void;
  onDelete: (registrationId: string) => void;
}

export default function ManageRegistrationsModal({ registrations, onClose, onDelete }: ManageRegistrationsModalProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  const filteredRegistrations = registrations.filter(r => {
    const q = searchQuery.toLowerCase();
    return r.studentId.toLowerCase().includes(q) ||
           r.studentName.toLowerCase().includes(q) ||
           r.companyName.toLowerCase().includes(q) ||
           (r.internClass && r.internClass.toLowerCase().includes(q));
  });

  const internal = filteredRegistrations.filter((r) => !r.isExternal);
  const external = filteredRegistrations.filter((r) => r.isExternal);

  const exportToExcel = () => {
    const data = registrations.map(r => ({
      'MSSV': r.studentId,
      'Họ và Tên': r.studentName,
      'Số điện thoại': r.studentPhone,
      'Email': r.studentEmail,
      'Lớp thực tập': r.internClass || '',
      'Công ty Đăng ký': r.companyName,
      'Kỳ vọng kỹ năng': r.expectedSkills || '',
      'Khai báo ngoài': r.isExternal ? 'Có' : 'Không',
      'Thời gian đăng ký': formatDate(r.registeredAt)
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Đăng Ký Thực Tập");
    XLSX.writeFile(wb, "DanhSachDangKyThucTap.xlsx");
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content max-w-2xl w-full" onClick={(e) => e.stopPropagation()}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-6 border-b border-slate-100 sticky top-0 bg-white rounded-t-2xl z-10 gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-sm">
              <Users className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-800">Quản Lý Đăng Ký</h2>
              <p className="text-xs text-slate-400">
                {registrations.length} tổng &bull; {internal.length} theo danh sách &bull; {external.length} ngoài
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={exportToExcel} className="btn-secondary py-1.5 px-3 text-xs bg-emerald-50 text-emerald-600 border-emerald-200 hover:bg-emerald-100 hover:border-emerald-300">
              <Download className="w-3.5 h-3.5" /> Xuất Excel
            </button>
            <button onClick={onClose} className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Tìm kiếm theo MSSV, Tên, Lớp, Công ty..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
            />
          </div>
        </div>

        <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
          {/* Đăng ký theo công ty trong danh sách */}
          {internal.length > 0 && (
            <section>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Đăng ký theo Danh Sách</span>
                <span className="badge bg-blue-100 text-blue-700">{internal.length}</span>
              </div>
              <div className="space-y-2">
                {internal.map((reg) => (
                  <div key={reg.id} className="flex items-center justify-between p-3.5 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:border-slate-200 transition-all group">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                        <span className="text-blue-600 font-bold text-xs">{reg.studentId.slice(0, 2).toUpperCase()}</span>
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-slate-800 truncate">{reg.studentName}</p>
                        <p className="text-xs text-slate-500">
                          {reg.studentId} &bull; <span className="font-medium text-indigo-600">{reg.companyName}</span>
                        </p>
                        {reg.expectedSkills && (
                          <p className="text-xs text-slate-400 mt-0.5 line-clamp-1 italic text-ellipsis">Kỳ vọng: {reg.expectedSkills}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0 ml-3">
                      <div className="flex items-center gap-1 text-xs text-slate-400">
                        <Calendar className="w-3 h-3" /> {formatDate(reg.registeredAt)}
                      </div>
                      <button onClick={() => onDelete(reg.id)}
                        className="opacity-0 group-hover:opacity-100 btn-danger py-1.5 px-2.5 transition-opacity" title="Xóa đăng ký">
                        <Trash2 className="w-3.5 h-3.5" /> Xóa
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Khai báo ngoài */}
          {external.length > 0 && (
            <section>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Khai Báo Công Ty Ngoài</span>
                <span className="badge bg-violet-100 text-violet-700">{external.length}</span>
              </div>
              <div className="space-y-2">
                {external.map((reg) => (
                  <div key={reg.id} className="flex items-center justify-between p-3.5 rounded-xl border border-violet-100 bg-violet-50/50 hover:bg-white hover:border-violet-200 transition-all group">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-lg bg-violet-100 flex items-center justify-center flex-shrink-0">
                        <ExternalLink className="w-4 h-4 text-violet-600" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-slate-800 truncate">{reg.studentName}</p>
                        <p className="text-xs text-slate-500">
                          {reg.studentId} &bull; <span className="font-medium text-violet-600">{reg.companyName}</span>
                        </p>
                        {reg.expectedSkills && (
                          <p className="text-xs text-slate-400 mt-0.5 line-clamp-1 italic text-ellipsis">Kỳ vọng: {reg.expectedSkills}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0 ml-3">
                      <div className="flex items-center gap-1 text-xs text-slate-400">
                        <Calendar className="w-3 h-3" /> {formatDate(reg.registeredAt)}
                      </div>
                      <button onClick={() => onDelete(reg.id)}
                        className="opacity-0 group-hover:opacity-100 btn-danger py-1.5 px-2.5 transition-opacity">
                        <Trash2 className="w-3.5 h-3.5" /> Xóa
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {registrations.length === 0 && (
            <div className="text-center py-16">
              <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-slate-400" />
              </div>
              <p className="text-slate-500 font-medium">Chưa có đăng ký nào</p>
              <p className="text-slate-400 text-sm mt-1">Các đăng ký của sinh viên sẽ hiển thị ở đây</p>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-slate-100 flex justify-end">
          <button onClick={onClose} className="btn-secondary">Đóng</button>
        </div>
      </div>
    </div>
  );
}
