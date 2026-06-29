'use client';

import React, { useState, useRef, useCallback } from 'react';
import {
  X, Upload, FileSpreadsheet, AlertCircle, CheckCircle2,
  ChevronRight, RefreshCw, Info, Eye,
} from 'lucide-react';
import * as XLSX from 'xlsx';
import { Company } from '@/lib/data';

/* ─── Kiểu dữ liệu hàng Excel thô ─── */
type RawRow = Record<string, string | number | boolean | null | undefined>;

/* ─── Cấu trúc sau khi map cột ─── */
interface MappedCompany {
  name: string;
  industry: string;
  fields: string[];
  skills: string[];
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  website: string;
  totalSlots: number;
  allowance: string;
  meals: string;
  housing: string;
  isGalaSponsor: boolean;
  isOnlineRecruitment: boolean;
  address: string;
}

interface UploadExcelModalProps {
  currentCompanies: Company[];
  onClose: () => void;
  onImport: (companies: Company[], replace: boolean) => void;
}

/* Mapping tên cột Excel → trường dữ liệu */
const COLUMN_MAP: Record<string, keyof MappedCompany> = {
  'tên công ty': 'name',
  'ten cong ty': 'name',
  'company name': 'name',
  'company': 'name',
  'ngành': 'industry',
  'nganh': 'industry',
  'industry': 'industry',
  'lĩnh vực': 'fields',
  'linh vuc': 'fields',
  'fields': 'fields',
  'kỹ năng': 'skills',
  'ky nang': 'skills',
  'skills': 'skills',
  'người liên hệ': 'contactName',
  'nguoi lien he': 'contactName',
  'contact name': 'contactName',
  'contact': 'contactName',
  'số điện thoại': 'contactPhone',
  'so dien thoai': 'contactPhone',
  'phone': 'contactPhone',
  'sdt': 'contactPhone',
  'email': 'contactEmail',
  'website': 'website',
  'địa chỉ': 'address',
  'dia chi': 'address',
  'address': 'address',
  'địa chỉ công ty': 'address',
  'dia chi cong ty': 'address',
  'trụ sở': 'address',
  'tru so': 'address',
  'địa điểm': 'address',
  'dia diem': 'address',
  'địa điểm làm việc': 'address',
  'dia diem lam viec': 'address',
  'nơi làm việc': 'address',
  'noi lam viec': 'address',
  'chỉ tiêu': 'totalSlots',
  'chi tieu': 'totalSlots',
  'slots': 'totalSlots',
  'số lượng': 'totalSlots',
  'phụ cấp': 'allowance',
  'phu cap': 'allowance',
  'allowance': 'allowance',
  'bữa ăn': 'meals',
  'bua an': 'meals',
  'meals': 'meals',
  'chỗ ở': 'housing',
  'cho o': 'housing',
  'housing': 'housing',
  'gala': 'isGalaSponsor',
  'nhà tài trợ gala': 'isGalaSponsor',
  'nha tai tro gala': 'isGalaSponsor',
  'gala sponsor': 'isGalaSponsor',
  'tham gia ngay hoi sinh vien co dien tu': 'isGalaSponsor',
  'tham gia ngay hoi tn': 'isGalaSponsor',
  'online': 'isOnlineRecruitment',
  'tuyển dụng online': 'isOnlineRecruitment',
  'online recruitment': 'isOnlineRecruitment',
  'tai tro': 'isOnlineRecruitment',
};

const EMOJI_LIST = ['🔷','📡','🎮','💳','🛒','⚙️','🚗','📊','📦','🏥','🌐','💼','🏗️','🔬','✈️'];

function normalizeHeader(h: string): string {
  return h.toLowerCase().trim()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, ' ');
}

function parseBool(val: string | number | boolean | null | undefined): boolean {
  if (typeof val === 'boolean') return val;
  if (typeof val === 'number') return val !== 0;
  const s = String(val ?? '').toLowerCase().trim();
  const normalized = s.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  
  if (normalized.includes('khong') || normalized.includes('no') || normalized.includes('false')) return false;
  if (normalized.includes('co') || normalized.includes('tham gia') || normalized.includes('yes') || normalized === '1' || normalized === 'x' || normalized === '✓') {
    return true;
  }
  return false;
}

function parseList(val: string | number | boolean | null | undefined): string[] {
  const s = String(val ?? '').trim();
  if (!s) return [];
  return s.split(/[,;/|]/).map((x) => x.trim()).filter(Boolean);
}

export default function UploadExcelModal({ currentCompanies, onClose, onImport }: UploadExcelModalProps) {
  const [step, setStep] = useState<'upload' | 'preview' | 'success'>('upload');
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState('');
  const [headers, setHeaders] = useState<string[]>([]);
  const [mapped, setMapped] = useState<MappedCompany[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [replaceMode, setReplaceMode] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = useCallback((file: File) => {
    if (!file.name.match(/\.(xlsx|xls|csv)$/i)) {
      setErrors(['Chỉ chấp nhận file .xlsx, .xls hoặc .csv']);
      return;
    }
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const wb = XLSX.read(data, { type: 'binary', cellDates: true });
        const ws = wb.Sheets[wb.SheetNames[0]];
        const json: RawRow[] = XLSX.utils.sheet_to_json(ws, { defval: '' });

        if (json.length === 0) {
          setErrors(['File không có dữ liệu hoặc sheet đầu tiên trống.']);
          return;
        }

        const rawHeaders = Object.keys(json[0]);
        setHeaders(rawHeaders);

        // Tự động map cột
        const parseErrors: string[] = [];
        const mappedList: MappedCompany[] = json.map((row, idx) => {
          const out: Partial<MappedCompany> = {
            name: '',
            industry: '',
            fields: [],
            skills: [],
            contactName: '',
            contactPhone: '',
            contactEmail: '',
            website: '',
            totalSlots: 0,
            allowance: 'Không cung cấp',
            meals: 'Không cung cấp',
            housing: 'Không cung cấp',
            isGalaSponsor: false,
            isOnlineRecruitment: false,
            address: '',
          };

          rawHeaders.forEach((h) => {
            const key = COLUMN_MAP[normalizeHeader(h)];
            if (!key) return;
            const val = row[h];
            if (key === 'fields' || key === 'skills') {
              (out[key] as string[]) = parseList(val);
            } else if (key === 'isGalaSponsor' || key === 'isOnlineRecruitment') {
              out[key] = parseBool(val);
            } else if (key === 'totalSlots') {
              const n = parseInt(String(val), 10);
              out.totalSlots = isNaN(n) ? 0 : n;
            } else {
              (out[key] as string) = String(val ?? '').trim();
            }
          });

          if (!out.name) parseErrors.push(`Hàng ${idx + 2}: thiếu tên công ty`);
          return out as MappedCompany;
        });

        setMapped(mappedList.filter((m) => m.name));
        setErrors(parseErrors);
        setStep('preview');
      } catch {
        setErrors(['Không thể đọc file. Vui lòng kiểm tra định dạng file Excel.']);
      }
    };
    reader.readAsBinaryString(file);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  }, [processFile]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const handleConfirmImport = () => {
    if (!replaceMode) {
      const duplicates = mapped.filter(m => currentCompanies.some(c => c.name.toLowerCase().trim() === m.name.toLowerCase().trim()));
      if (duplicates.length > 0) {
        const confirmMsg = `Cảnh báo: Có ${duplicates.length} công ty trùng tên với danh sách hiện tại (VD: ${duplicates.slice(0, 3).map(d => d.name).join(', ')}). Bạn có chắc chắn muốn tiếp tục thêm?`;
        if (!window.confirm(confirmMsg)) return;
      }
    }

    const companies: Company[] = mapped.map((m, i) => ({
      id: `imported_${Date.now()}_${i}`,
      name: m.name,
      logo: EMOJI_LIST[i % EMOJI_LIST.length],
      isGalaSponsor: m.isGalaSponsor,
      isOnlineRecruitment: m.isOnlineRecruitment,
      fields: m.fields.length > 0 ? m.fields : ['Chưa xác định'],
      skills: m.skills.length > 0 ? m.skills : [],
      benefits: {
        allowance: m.allowance || 'Không cung cấp',
        meals: m.meals || 'Không cung cấp',
        housing: m.housing || 'Không cung cấp',
      },
      totalSlots: m.totalSlots || 0,
      availableSlots: m.totalSlots || 0,
      contactName: m.contactName || 'Chưa cập nhật',
      contactPhone: m.contactPhone || 'Chưa cập nhật',
      contactEmail: m.contactEmail || 'Chưa cập nhật',
      website: m.website || '#',
      address: m.address || 'Chưa cập nhật',
      industry: m.industry || 'Chưa xác định',
    }));
    onImport(companies, replaceMode);
    setStep('success');
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content max-w-2xl w-full" onClick={(e) => e.stopPropagation()}>
        {/* Tiêu đề */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-sm">
              <FileSpreadsheet className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-800">Nhập Dữ Liệu từ Excel</h2>
              <p className="text-xs text-slate-400">
                {step === 'upload' && 'Chọn file .xlsx, .xls hoặc .csv'}
                {step === 'preview' && `${mapped.length} doanh nghiệp sẵn sàng nhập`}
                {step === 'success' && 'Nhập dữ liệu thành công'}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Bước 1: Upload */}
        {step === 'upload' && (
          <div className="p-6 space-y-5">
            {/* Vùng kéo thả */}
            <div
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all duration-200 ${
                isDragging ? 'border-emerald-400 bg-emerald-50' : 'border-slate-200 hover:border-emerald-300 hover:bg-slate-50'
              }`}
            >
              <input ref={fileInputRef} type="file" accept=".xlsx,.xls,.csv" onChange={handleFileChange} className="hidden" />
              <div className="w-14 h-14 rounded-2xl bg-emerald-100 flex items-center justify-center mx-auto mb-4">
                <Upload className="w-7 h-7 text-emerald-600" />
              </div>
              <p className="text-slate-700 font-semibold text-sm">Kéo thả file vào đây</p>
              <p className="text-slate-400 text-xs mt-1">hoặc nhấn để chọn file từ máy tính</p>
              <p className="text-slate-300 text-xs mt-3">Hỗ trợ: .xlsx, .xls, .csv</p>
            </div>

            {/* Lỗi */}
            {errors.length > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                {errors.map((e, i) => (
                  <div key={i} className="flex items-center gap-2 text-red-600 text-sm">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" /> {e}
                  </div>
                ))}
              </div>
            )}

            {/* Hướng dẫn cột */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <Info className="w-4 h-4 text-slate-500" />
                <p className="text-xs font-bold text-slate-600 uppercase tracking-wide">Tên cột được hỗ trợ</p>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                {[
                  'Tên Công Ty *', 'Ngành', 'Lĩnh Vực', 'Kỹ Năng',
                  'Người Liên Hệ', 'Số Điện Thoại', 'Email', 'Website',
                  'Chỉ Tiêu', 'Phụ Cấp', 'Bữa Ăn', 'Chỗ Ở',
                  'Gala', 'Online',
                ].map((col) => (
                  <span key={col} className={`text-xs px-2.5 py-1 rounded-lg font-medium ${
                    col.includes('*') ? 'bg-red-100 text-red-700' : 'bg-white text-slate-600 border border-slate-200'
                  }`}>{col}</span>
                ))}
              </div>
              <p className="text-xs text-slate-400 mt-2">* Bắt buộc. Cột Lĩnh Vực và Kỹ Năng có thể dùng dấu phẩy để phân cách nhiều giá trị.</p>
            </div>
          </div>
        )}

        {/* Bước 2: Xem trước */}
        {step === 'preview' && (
          <div className="flex flex-col max-h-[75vh]">
            {/* Cột được nhận dạng */}
            <div className="px-6 pt-5 pb-3 flex-shrink-0">
              <div className="flex items-center gap-2 mb-2">
                <Eye className="w-4 h-4 text-slate-500" />
                <p className="text-xs font-bold text-slate-600 uppercase tracking-wide">Cột nhận dạng từ file: {fileName}</p>
              </div>
              <div className="flex flex-wrap gap-1.5 mb-4">
                {headers.map((h) => {
                  const mapped = COLUMN_MAP[normalizeHeader(h)];
                  return (
                    <span key={h} className={`text-xs px-2.5 py-1 rounded-lg font-medium ${
                      mapped ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-400'
                    }`}>
                      {h} {mapped ? `→ ${mapped}` : '(bỏ qua)'}
                    </span>
                  );
                })}
              </div>

              {errors.length > 0 && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-3">
                  <p className="text-xs font-semibold text-amber-700 mb-1">Cảnh báo ({errors.length})</p>
                  {errors.slice(0, 3).map((e, i) => <p key={i} className="text-xs text-amber-600">{e}</p>)}
                  {errors.length > 3 && <p className="text-xs text-amber-500">và {errors.length - 3} cảnh báo khác...</p>}
                </div>
              )}

              {/* Tuỳ chọn nhập */}
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                <input type="checkbox" id="replaceMode" checked={replaceMode} onChange={(e) => setReplaceMode(e.target.checked)}
                  className="w-4 h-4 accent-indigo-600" />
                <label htmlFor="replaceMode" className="text-sm text-slate-700 cursor-pointer">
                  <span className="font-semibold">Ghi đè toàn bộ</span> — xóa danh sách hiện tại và thay thế bằng dữ liệu từ file
                </label>
              </div>
            </div>

            {/* Bảng xem trước */}
            <div className="overflow-y-auto flex-1 px-6 pb-4">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">
                Xem trước — {mapped.length} doanh nghiệp
              </p>
              <div className="space-y-2">
                {mapped.map((m, i) => (
                  <div key={i} className="flex items-start gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="w-9 h-9 rounded-lg bg-emerald-100 flex items-center justify-center flex-shrink-0 text-lg">
                      {EMOJI_LIST[i % EMOJI_LIST.length]}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-sm font-semibold text-slate-800">{m.name}</p>
                        {m.isGalaSponsor && <span className="badge bg-amber-100 text-amber-700 text-xs">⭐ Gala</span>}
                        {m.isOnlineRecruitment && <span className="badge bg-emerald-100 text-emerald-700 text-xs">🌐 Online</span>}
                      </div>
                      <div className="flex flex-wrap gap-3 mt-1">
                        <span className="text-xs text-slate-500">📍 {m.industry || '—'}</span>
                        <span className="text-xs text-slate-500">🎯 {m.totalSlots} chỉ tiêu</span>
                        {m.contactEmail && <span className="text-xs text-blue-500">✉ {m.contactEmail}</span>}
                      </div>
                      {m.fields.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1.5">
                          {m.fields.slice(0, 3).map((f) => <span key={f} className="text-xs bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded">{f}</span>)}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Nút hành động */}
            <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between gap-3 flex-shrink-0">
              <button onClick={() => { setStep('upload'); setErrors([]); setFileName(''); }}
                className="btn-secondary flex items-center gap-2">
                <RefreshCw className="w-4 h-4" /> Chọn file khác
              </button>
              <button onClick={handleConfirmImport}
                className="btn-primary flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                {replaceMode ? 'Ghi đè & Nhập' : 'Thêm vào danh sách'}
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Bước 3: Thành công */}
        {step === 'success' && (
          <div className="p-10 text-center animate-scale-in">
            <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-10 h-10 text-emerald-500" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">Nhập thành công!</h3>
            <p className="text-slate-500 text-sm mb-6">
              Đã {replaceMode ? 'ghi đè và nhập' : 'thêm'}{' '}
              <span className="font-semibold text-slate-700">{mapped.length} doanh nghiệp</span> vào hệ thống.
            </p>
            <button onClick={onClose} className="btn-primary mx-auto">Đóng</button>
          </div>
        )}
      </div>
    </div>
  );
}
