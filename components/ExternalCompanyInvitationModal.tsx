'use client';

import React, { useState } from 'react';
import { X, Send } from 'lucide-react';

interface ExternalCompanyInvitationModalProps {
  appsScriptUrl: string;
  externalFormUrl: string;
  onClose: () => void;
}

export function ExternalCompanyInvitationModal({ appsScriptUrl, externalFormUrl, onClose }: ExternalCompanyInvitationModalProps) {
  const [companyName, setCompanyName] = useState('');
  const [companyEmail, setCompanyEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSendAndContinue = async () => {
    if (!companyName.trim() || !companyEmail.trim()) {
      setError('Vui lòng điền đầy đủ Tên công ty và Email.');
      return;
    }
    
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(companyEmail)) {
      setError('Email công ty không hợp lệ.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const res = await fetch(appsScriptUrl, {
        method: 'POST',
        body: JSON.stringify({
          action: 'sendInvitationEmail',
          companyName: companyName.trim(),
          companyEmail: companyEmail.trim()
        }),
        headers: { 'Content-Type': 'text/plain;charset=utf-8' }
      });
      const result = await res.json();
      
      if (result.status === 'success') {
        window.open(externalFormUrl, '_blank');
        onClose();
      } else {
        setError(result.message || 'Lỗi khi gửi email thư mời.');
      }
    } catch (err) {
      setError('Lỗi kết nối tới hệ thống. Vui lòng thử lại.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-scale-up">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-violet-50">
          <h2 className="text-lg font-bold text-violet-800">Gửi Thư Mời Hợp Tác & Khai Báo</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6">
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
            <p className="text-sm text-amber-800 font-medium leading-relaxed">
              Nhà trường sẽ tự động gửi một email <strong>Thư Mời Hợp Tác</strong> tới doanh nghiệp. Vui lòng nhập thông tin chính xác.
              Sau khi gửi thư mời, bạn sẽ được chuyển hướng sang Form khai báo.
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
              {error}
            </div>
          )}

          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-semibold text-slate-800 mb-1">Tên Doanh Nghiệp <span className="text-red-500">*</span></label>
              <input 
                type="text" 
                value={companyName}
                onChange={e => setCompanyName(e.target.value)}
                placeholder="VD: Công ty TNHH VNG"
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-800 mb-1">Email Người Đại Diện / Nhân Sự <span className="text-red-500">*</span></label>
              <input 
                type="email" 
                value={companyEmail}
                onChange={e => setCompanyEmail(e.target.value)}
                placeholder="VD: hr@vng.com.vn"
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
            </div>
          </div>

          <div className="flex gap-3">
            <button 
              onClick={onClose} 
              disabled={isSubmitting}
              className="flex-1 px-4 py-2 bg-slate-100 text-slate-700 font-semibold rounded-xl hover:bg-slate-200 transition-colors text-sm disabled:opacity-70"
            >
              Hủy
            </button>
            <button 
              onClick={handleSendAndContinue}
              disabled={isSubmitting}
              className="flex-[2] flex items-center justify-center gap-2 px-4 py-2 bg-violet-600 text-white font-semibold rounded-xl hover:bg-violet-700 transition-colors text-sm shadow-sm disabled:opacity-70"
            >
              {isSubmitting ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Gửi Thư Mời & Điền Form
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
