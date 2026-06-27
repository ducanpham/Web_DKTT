import React, { useState } from 'react';
import { X, Link as LinkIcon, RefreshCcw, AlertCircle, CheckCircle2 } from 'lucide-react';
import Papa from 'papaparse';
import { Company, Registration } from '@/lib/data';

interface SyncGoogleFormModalProps {
  companies: Company[];
  onClose: () => void;
  onImportRegistrations: (newRegs: Registration[]) => void;
}

export default function SyncGoogleFormModal({ companies, onClose, onImportRegistrations }: SyncGoogleFormModalProps) {
  const [csvUrl, setCsvUrl] = useState('');
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successCount, setSuccessCount] = useState<number | null>(null);

  const handleSync = async () => {
    if (!csvUrl.trim()) {
      setError('Vui lòng nhập link CSV');
      return;
    }
    setError(null);
    setSyncing(true);

    try {
      const response = await fetch(csvUrl);
      if (!response.ok) throw new Error('Không thể tải file CSV. Vui lòng kiểm tra lại quyền chia sẻ.');
      const csvText = await response.text();

      Papa.parse(csvText, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          const rows = results.data as any[];
          const newRegs: Registration[] = [];

          rows.forEach((row: any) => {
            // Expected columns from Google Form (can be adapted)
            // Cột có thể là "MSSV", "Họ và Tên", "Số điện thoại", "Email", "Lớp", "Công ty đăng ký"
            const mssv = row['MSSV'] || row['Mã số sinh viên'] || row['Student ID'];
            const name = row['Họ và Tên'] || row['Họ tên'] || row['Name'];
            const phone = row['Số điện thoại'] || row['Phone'];
            const email = row['Email'];
            const internClass = row['Lớp'] || row['Lớp thực tập'] || row['Class'];
            const companyNameRaw = row['Công ty đăng ký'] || row['Công ty'] || row['Company'];

            if (!mssv || !name || !companyNameRaw) return;

            // Find company
            const matchedCompany = companies.find(c => 
              c.name.toLowerCase().includes(companyNameRaw.toLowerCase()) || 
              companyNameRaw.toLowerCase().includes(c.name.toLowerCase())
            );

            newRegs.push({
              id: `sync_${Date.now()}_${mssv}`,
              studentId: mssv,
              studentName: name,
              studentPhone: phone || '',
              studentEmail: email || '',
              internClass: internClass || '',
              companyId: matchedCompany ? matchedCompany.id : 'EXT',
              companyName: matchedCompany ? matchedCompany.name : companyNameRaw,
              registeredAt: new Date().toISOString(),
              isExternal: !matchedCompany,
            });
          });

          onImportRegistrations(newRegs);
          setSuccessCount(newRegs.length);
          setSyncing(false);
        },
        error: (err: any) => {
          setError('Lỗi khi phân tích CSV: ' + err.message);
          setSyncing(false);
        }
      });
    } catch (e: any) {
      setError(e.message);
      setSyncing(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content max-w-lg w-full" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center">
              <RefreshCcw className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-800">Đồng bộ Google Forms</h2>
              <p className="text-xs text-slate-500">Tự động đọc danh sách sinh viên đăng ký</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {successCount !== null ? (
            <div className="text-center p-6">
              <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8 text-emerald-500" />
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-2">Đồng bộ thành công!</h3>
              <p className="text-slate-600 text-sm">Đã đọc và cập nhật <span className="font-bold">{successCount}</span> bản ghi mới.</p>
              <button onClick={onClose} className="mt-6 btn-primary w-full justify-center">Đóng cửa sổ</button>
            </div>
          ) : (
            <>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Link CSV từ Google Sheets</label>
                <div className="relative">
                  <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="url"
                    value={csvUrl}
                    onChange={e => setCsvUrl(e.target.value)}
                    placeholder="https://docs.google.com/spreadsheets/d/e/2PACX.../pub?output=csv"
                    className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                  />
                </div>
                <p className="text-xs text-slate-500 mt-2">
                  Hướng dẫn: Trong Google Sheets, chọn <b>File &gt; Share &gt; Publish to web</b>. Chọn định dạng <b>Comma-separated values (.csv)</b> và copy link dán vào đây.
                </p>
              </div>

              {error && (
                <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-lg text-sm">
                  <AlertCircle className="w-4 h-4 shrink-0" /> {error}
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <button onClick={onClose} className="btn-secondary flex-1 justify-center">Hủy</button>
                <button onClick={handleSync} disabled={syncing} className="btn-primary bg-orange-600 hover:bg-orange-700 border-orange-600 flex-1 justify-center disabled:opacity-50 disabled:cursor-not-allowed">
                  {syncing ? <RefreshCcw className="w-4 h-4 animate-spin" /> : <RefreshCcw className="w-4 h-4" />}
                  {syncing ? 'Đang đồng bộ...' : 'Đồng bộ ngay'}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
