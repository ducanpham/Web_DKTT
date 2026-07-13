import React, { useState } from 'react';
import { X, Search, CheckCircle, User, Phone, Mail, Building, Building2 } from 'lucide-react';
import { Company, Registration } from '@/lib/data';

interface StudentLookupModalProps {
  companies: Company[];
  registrations: Registration[];
  onClose: () => void;
}

export function StudentLookupModal({ companies, registrations, onClose }: StudentLookupModalProps) {
  const [mssv, setMssv] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const [foundReg, setFoundReg] = useState<Registration | null>(null);
  const [foundCompany, setFoundCompany] = useState<Company | null>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = mssv.trim().toLowerCase();
    if (!query) return;

    const reg = registrations.find(r => r.studentId.toLowerCase() === query);
    if (reg) {
      setFoundReg(reg);
      const company = companies.find(c => c.id === reg.companyId);
      setFoundCompany(company || null);
    } else {
      setFoundReg(null);
      setFoundCompany(null);
    }
    setHasSearched(true);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-scale-up flex flex-col max-h-[90vh]">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center">
              <Search className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-800">Tra cứu thông tin thực tập</h2>
              <p className="text-xs text-slate-500">Xem công ty bạn đã đăng ký thành công</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto">
          <form onSubmit={handleSearch} className="mb-6 flex gap-3">
            <div className="flex-1 relative">
              <input
                type="text"
                required
                value={mssv}
                onChange={(e) => setMssv(e.target.value)}
                placeholder="Nhập Mã số sinh viên..."
                className="w-full pl-4 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-sm font-medium"
              />
            </div>
            <button
              type="submit"
              className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl font-semibold text-sm hover:bg-indigo-700 transition-colors shadow-sm whitespace-nowrap"
            >
              Tìm kiếm
            </button>
          </form>

          {hasSearched && (
            <div className="animate-fade-in">
              {foundReg ? (
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5">
                  <div className="flex items-center gap-2 mb-4 text-emerald-700">
                    <CheckCircle className="w-5 h-5" />
                    <h3 className="font-bold">Đã tìm thấy thông tin đăng ký!</h3>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <p className="text-xs font-semibold text-emerald-600/70 uppercase tracking-wider mb-1">Sinh viên</p>
                      <p className="text-sm font-bold text-slate-800">{foundReg.studentName} <span className="font-normal text-slate-500">({foundReg.studentId})</span></p>
                    </div>

                    <div className="h-px bg-emerald-200/50 w-full" />

                    <div>
                      <p className="text-xs font-semibold text-emerald-600/70 uppercase tracking-wider mb-2">Công ty thực tập</p>
                      <div className="flex items-start gap-2 text-sm font-bold text-slate-800">
                        {foundReg.isExternal ? <Building2 className="w-4 h-4 mt-0.5 text-violet-500" /> : <Building className="w-4 h-4 mt-0.5 text-blue-500" />}
                        <span>{foundReg.isExternal ? foundReg.companyName : foundCompany?.name}</span>
                      </div>
                      {foundReg.isExternal && (
                        <span className="inline-block mt-1 text-[10px] font-bold bg-violet-100 text-violet-700 px-2 py-0.5 rounded uppercase tracking-wider">
                          Tự liên hệ (Công ty ngoài)
                        </span>
                      )}
                    </div>

                    {foundCompany && !foundReg.isExternal && (
                      <div className="bg-white/60 rounded-lg p-3 space-y-2 mt-2">
                        <p className="text-xs font-bold text-slate-700 border-b border-slate-200/50 pb-1.5 mb-2">Thông tin người đại diện tại công ty:</p>
                        <div className="flex items-center gap-2 text-sm text-slate-700">
                          <User className="w-4 h-4 text-slate-400" />
                          <span>{foundCompany.contactName || 'Chưa cập nhật'}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-700">
                          <Phone className="w-4 h-4 text-slate-400" />
                          <span>{foundCompany.contactPhone || 'Chưa cập nhật'}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-blue-600">
                          <Mail className="w-4 h-4 text-blue-400" />
                          {foundCompany.contactEmail ? (
                            <a href={`mailto:${foundCompany.contactEmail}`} className="hover:underline">{foundCompany.contactEmail}</a>
                          ) : (
                            <span className="text-slate-500">Chưa cập nhật</span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="bg-red-50 border border-red-200 rounded-xl p-5 text-center">
                  <div className="w-12 h-12 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-3">
                    <X className="w-6 h-6" />
                  </div>
                  <p className="font-bold text-red-700 mb-1">Không tìm thấy dữ liệu</p>
                  <p className="text-sm text-red-600/80">Không có đăng ký nào khớp với MSSV <strong>{mssv}</strong>. Sinh viên có thể chưa đăng ký hoặc nhập sai mã số.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
