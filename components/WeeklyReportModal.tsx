'use client';

import React, { useState, useCallback, useMemo } from 'react';
import {
  X, RefreshCcw, AlertCircle, CheckCircle2, ClipboardList,
  Search, Filter, Download, Calendar, Users, Building2,
  ChevronDown, AlertTriangle, User,
} from 'lucide-react';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import { Registration, WeeklyReport, WeeklyReportConfig } from '@/lib/data';

interface WeeklyReportModalProps {
  config: WeeklyReportConfig;
  registrations: Registration[];
  onClose: () => void;
}

function formatDate(iso: string) {
  try { return new Date(iso).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }); } catch { return iso; }
}

export default function WeeklyReportModal({ config, registrations, onClose }: WeeklyReportModalProps) {
  const [reports, setReports] = useState<WeeklyReport[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fetched, setFetched] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [weekFilter, setWeekFilter] = useState<string>('');
  const [companyFilter, setCompanyFilter] = useState<string>('');
  const [showMissingOnly, setShowMissingOnly] = useState(false);

  const weeks = useMemo(() => {
    const all = new Set(reports.map(r => r.weekLabel));
    return Array.from(all).sort();
  }, [reports]);

  const companies = useMemo(() => {
    const all = new Set(reports.map(r => r.companyName).filter(Boolean));
    return Array.from(all).sort();
  }, [reports]);

  // Danh sách SV đã đăng ký (để kiểm tra ai chưa nộp)
  const registeredStudents = useMemo(() => registrations.filter(r => !r.isExternal || r.companyId === 'EXT'), [registrations]);

  const filteredReports = useMemo(() => {
    return reports.filter(r => {
      const q = searchQuery.toLowerCase();
      if (q && !r.studentId.toLowerCase().includes(q) && !r.studentName.toLowerCase().includes(q)) return false;
      if (weekFilter && r.weekLabel !== weekFilter) return false;
      if (companyFilter && r.companyName !== companyFilter) return false;
      return true;
    });
  }, [reports, searchQuery, weekFilter, companyFilter]);

  // Tìm SV chưa nộp báo cáo trong tuần đang lọc
  const missingStudents = useMemo(() => {
    if (!weekFilter) return [];
    const submitted = new Set(reports.filter(r => r.weekLabel === weekFilter).map(r => r.studentId.toUpperCase()));
    return registeredStudents.filter(r => !submitted.has(r.studentId.toUpperCase()));
  }, [weekFilter, reports, registeredStudents]);

  const displayList = showMissingOnly ? [] : filteredReports;

  const handleFetch = useCallback(async () => {
    if (!config.sheetsCsvUrl.trim()) {
      setError('Admin chưa cấu hình link Google Sheets CSV trong phần Giao diện Sinh viên.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const resp = await fetch(config.sheetsCsvUrl);
      if (!resp.ok) throw new Error('Không tải được CSV. Hãy kiểm tra quyền chia sẻ của Google Sheets (Anyone with link).');
      const text = await resp.text();
      Papa.parse(text, {
        header: true,
        skipEmptyLines: true,
        complete: (result) => {
          const rows = result.data as Record<string, string>[];
          const parsed: WeeklyReport[] = rows.map((row, i) => {
            const mssv = row['MSSV'] || row['Mã số sinh viên'] || row['Student ID'] || '';
            const name = row['Họ và Tên'] || row['Họ tên'] || row['Name'] || '';
            const cls = row['Lớp'] || row['Lớp thực tập'] || row['Class'] || '';
            const company = row['Công ty'] || row['Tên công ty'] || row['Company'] || '';
            const week = row['Tuần'] || row['Tuần báo cáo'] || row['Week'] || `Tuần ${i + 1}`;
            const content = row['Công việc đã làm'] || row['Nội dung'] || row['Content'] || '';
            const diff = row['Khó khăn'] || row['Đề xuất'] || row['Difficulties'] || '';
            const time = row['Thời gian'] || row['Timestamp'] || new Date().toISOString();
            return {
              id: `${mssv}_${week}_${i}`,
              studentId: mssv.trim(),
              studentName: name.trim(),
              internClass: cls.trim(),
              companyName: company.trim(),
              weekLabel: week.trim(),
              content: content.trim(),
              difficulties: diff.trim(),
              submittedAt: time.trim(),
            };
          }).filter(r => r.studentId && r.studentName);
          setReports(parsed);
          setFetched(true);
          setLoading(false);
        },
        error: () => {
          setError('Lỗi phân tích CSV. Vui lòng kiểm tra định dạng file Google Sheets.');
          setLoading(false);
        }
      });
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Lỗi không xác định';
      setError(msg);
      setLoading(false);
    }
  }, [config.sheetsCsvUrl]);

  const handleExport = useCallback(() => {
    const data = filteredReports.map(r => ({
      'MSSV': r.studentId,
      'Họ và Tên': r.studentName,
      'Lớp': r.internClass,
      'Công ty': r.companyName,
      'Tuần': r.weekLabel,
      'Công việc đã làm': r.content,
      'Khó khăn / Đề xuất': r.difficulties,
      'Thời gian nộp': r.submittedAt,
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'BaoCaoTienDo');
    XLSX.writeFile(wb, `BaoCaoTienDo_${weekFilter || 'TatCa'}.xlsx`);
  }, [filteredReports, weekFilter]);

  const submittedCount = weekFilter ? reports.filter(r => r.weekLabel === weekFilter).length : reports.length;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content max-w-4xl w-full" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100 sticky top-0 bg-white rounded-t-2xl z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-sm">
              <ClipboardList className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-800">Theo Dõi Báo Cáo Tiến Độ</h2>
              <p className="text-xs text-slate-400 mt-0.5">Dữ liệu từ Google Sheets — {reports.length} báo cáo</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-all">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5 overflow-y-auto max-h-[calc(100vh-10rem)]">
          {/* Fetch + Config Info */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3 flex items-center gap-3 min-w-0">
              <Calendar className="w-4 h-4 text-emerald-600 shrink-0" />
              <div className="min-w-0">
                <p className="text-xs font-semibold text-emerald-700">Link Google Sheets (CSV)</p>
                <p className="text-xs text-emerald-600 truncate">{config.sheetsCsvUrl || 'Chưa cấu hình'}</p>
              </div>
            </div>
            <button
              onClick={handleFetch}
              disabled={loading}
              className="btn-primary px-5 shrink-0"
            >
              <RefreshCcw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              {loading ? 'Đang tải...' : fetched ? 'Tải lại' : 'Tải dữ liệu'}
            </button>
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-xl p-4 animate-fade-in">
              <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 shrink-0" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* Stats after fetch */}
          {fetched && !loading && (
            <>
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-slate-50 rounded-xl p-4 text-center border border-slate-100">
                  <p className="text-2xl font-bold text-slate-800">{reports.length}</p>
                  <p className="text-xs text-slate-500 mt-1">Tổng báo cáo</p>
                </div>
                <div className="bg-emerald-50 rounded-xl p-4 text-center border border-emerald-100">
                  <p className="text-2xl font-bold text-emerald-700">{submittedCount}</p>
                  <p className="text-xs text-emerald-600 mt-1">{weekFilter ? `Nộp ${weekFilter}` : 'Báo cáo lọc'}</p>
                </div>
                <div className="bg-red-50 rounded-xl p-4 text-center border border-red-100">
                  <p className="text-2xl font-bold text-red-600">{weekFilter ? missingStudents.length : '—'}</p>
                  <p className="text-xs text-red-500 mt-1">{weekFilter ? 'Chưa nộp' : 'Chọn tuần để xem'}</p>
                </div>
              </div>

              {/* Filters */}
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Tìm MSSV, tên sinh viên..."
                    className="input-field !pl-9 w-full"
                  />
                </div>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                  <select
                    value={weekFilter}
                    onChange={e => { setWeekFilter(e.target.value); setShowMissingOnly(false); }}
                    className="input-field !pl-9 pr-8 appearance-none cursor-pointer"
                  >
                    <option value="">Tất cả tuần</option>
                    {weeks.map(w => <option key={w} value={w}>{w}</option>)}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                </div>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                  <select
                    value={companyFilter}
                    onChange={e => setCompanyFilter(e.target.value)}
                    className="input-field !pl-9 pr-8 appearance-none cursor-pointer min-w-[170px]"
                  >
                    <option value="">Tất cả công ty</option>
                    {companies.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                </div>
              </div>

              <div className="flex items-center justify-between">
                {weekFilter && missingStudents.length > 0 && (
                  <button
                    onClick={() => setShowMissingOnly(!showMissingOnly)}
                    className={`flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-xl border transition-all ${
                      showMissingOnly
                        ? 'bg-red-500 text-white border-red-500'
                        : 'bg-red-50 text-red-600 border-red-200 hover:bg-red-100'
                    }`}
                  >
                    <AlertTriangle className="w-4 h-4" />
                    {showMissingOnly ? 'Đang lọc: Chưa nộp' : `Xem ${missingStudents.length} SV chưa nộp ${weekFilter}`}
                  </button>
                )}
                {filteredReports.length > 0 && !showMissingOnly && (
                  <button onClick={handleExport} className="btn-secondary ml-auto">
                    <Download className="w-4 h-4" />
                    Xuất Excel
                  </button>
                )}
              </div>

              {/* Missing Students Table */}
              {showMissingOnly && weekFilter && (
                <div className="space-y-2 animate-fade-in">
                  <p className="text-sm font-semibold text-red-600 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" />
                    {missingStudents.length} Sinh viên chưa nộp báo cáo {weekFilter}
                  </p>
                  {missingStudents.length === 0 ? (
                    <div className="text-center py-8 text-slate-400 text-sm">
                      <CheckCircle2 className="w-10 h-10 mx-auto mb-2 text-emerald-400" />
                      Tất cả sinh viên đã nộp báo cáo!
                    </div>
                  ) : (
                    missingStudents.map(reg => (
                      <div key={reg.id} className="flex items-center gap-3 p-3.5 rounded-xl border border-red-100 bg-red-50/40 hover:bg-white transition-all">
                        <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center shrink-0">
                          <User className="w-4 h-4 text-red-500" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-slate-800">{reg.studentName}</p>
                          <p className="text-xs text-slate-500">{reg.studentId} • {reg.companyName}</p>
                        </div>
                        <span className="text-xs font-semibold px-2.5 py-1 bg-red-100 text-red-600 rounded-full shrink-0">Chưa nộp</span>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* Report List */}
              {!showMissingOnly && (
                <div className="space-y-2">
                  {displayList.length === 0 ? (
                    <div className="text-center py-12 text-slate-400">
                      <ClipboardList className="w-10 h-10 mx-auto mb-3 opacity-40" />
                      <p className="text-sm">Không có báo cáo nào phù hợp</p>
                    </div>
                  ) : (
                    displayList.map(rep => (
                      <details key={rep.id} className="group rounded-xl border border-slate-100 bg-slate-50/50 hover:border-slate-200 hover:bg-white transition-all">
                        <summary className="flex items-center gap-3 p-3.5 cursor-pointer select-none list-none">
                          <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center shrink-0">
                            <ClipboardList className="w-4 h-4 text-emerald-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-slate-800 truncate">{rep.studentName}</p>
                            <p className="text-xs text-slate-500">{rep.studentId} • <span className="font-medium text-emerald-600">{rep.companyName}</span></p>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <span className="text-xs font-semibold px-2.5 py-1 bg-emerald-100 text-emerald-700 rounded-full">{rep.weekLabel}</span>
                            <ChevronDown className="w-4 h-4 text-slate-400 group-open:rotate-180 transition-transform" />
                          </div>
                        </summary>
                        <div className="px-4 pb-4 space-y-3 border-t border-slate-100 mt-0 pt-3">
                          {rep.content && (
                            <div>
                              <p className="text-xs font-bold text-slate-500 uppercase mb-1">Công việc đã làm</p>
                              <p className="text-sm text-slate-700 whitespace-pre-line">{rep.content}</p>
                            </div>
                          )}
                          {rep.difficulties && (
                            <div>
                              <p className="text-xs font-bold text-slate-500 uppercase mb-1">Khó khăn / Đề xuất</p>
                              <p className="text-sm text-slate-700 whitespace-pre-line">{rep.difficulties}</p>
                            </div>
                          )}
                          <p className="text-xs text-slate-400">Nộp lúc: {formatDate(rep.submittedAt)}</p>
                        </div>
                      </details>
                    ))
                  )}
                </div>
              )}
            </>
          )}

          {/* Initial state */}
          {!fetched && !loading && !error && (
            <div className="text-center py-12 text-slate-400">
              <RefreshCcw className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p className="text-sm">Nhấn <strong>"Tải dữ liệu"</strong> để lấy danh sách báo cáo từ Google Sheets</p>
              <p className="text-xs mt-1 text-slate-300">Cấu hình link trong mục Giao diện Sinh viên → Báo cáo tiến độ</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
