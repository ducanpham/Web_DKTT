'use client';

import React, { useState } from 'react';
import { X, CheckCircle2, AlertCircle } from 'lucide-react';
import { Registration } from '@/lib/data';

interface CompanyGeneralReportModalProps {
  registrations: Registration[];
  appsScriptUrl: string;
  onClose: () => void;
}

export default function CompanyGeneralReportModal({ registrations, appsScriptUrl, onClose }: CompanyGeneralReportModalProps) {
  const [weekNumber, setWeekNumber] = useState(1);
  const [attitude, setAttitude] = useState('');
  const [progress, setProgress] = useState('');
  const [learning, setLearning] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [notes, setNotes] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const ATTITUDE_OPTIONS = [
    '🌟 Xuất sắc (Chủ động, luôn đúng giờ, tuân thủ nội quy)',
    '✅ Tốt (Đi làm đầy đủ, thái độ hòa nhã)',
    '⚠️ Cần nhắc nhở (Đôi khi đi muộn, thiếu chủ động)',
    '🛑 Kém (Thường xuyên vắng mặt không phép, thái độ không tốt)'
  ];

  const PROGRESS_OPTIONS = [
    '🏆 Vượt kỳ vọng (Làm nhanh, chất lượng tốt)',
    '👍 Đạt yêu cầu cơ bản',
    '⏳ Đang trong quá trình đào tạo/hướng dẫn thêm',
    '📉 Không hoàn thành công việc được giao'
  ];

  const LEARNING_OPTIONS = [
    '🚀 Tiếp thu rất nhanh, áp dụng tốt',
    '🏃 Mức độ bình thường',
    '🐢 Chậm tiếp thu, cần hướng dẫn nhiều lần',
    '❌ Không có tinh thần học hỏi'
  ];

  const SUGGESTION_OPTIONS = [
    'Cần nhà trường nhắc nhở sinh viên về thái độ',
    'Đề xuất chuyển sinh viên sang bộ phận khác phù hợp hơn',
    'Đánh giá sinh viên có tiềm năng giữ lại làm nhân viên chính thức'
  ];

  const toggleSuggestion = (s: string) => {
    setSuggestions(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);
  };

  const handleSubmit = async () => {
    if (!attitude || !progress || !learning) {
      setError('Vui lòng chọn đầy đủ các tiêu chí bắt buộc (Thái độ, Tiến độ, Tiếp thu).');
      return;
    }

    const contentArr = [
      `Thái độ: ${attitude}`,
      `Tiến độ: ${progress}`,
      `Tiếp thu: ${learning}`
    ];
    
    if (suggestions.length > 0) {
      contentArr.push(`Đề xuất: ${suggestions.join('; ')}`);
    } else {
      contentArr.push(`Đề xuất: Không có`);
    }
    
    if (notes.trim()) {
      contentArr.push(`Nhận xét: ${notes.trim()}`);
    }

    const finalContent = contentArr.join('\n');

    setIsSubmitting(true);
    setError('');

    try {
      const mssvs = registrations.map(r => r.studentId);
      
      const res = await fetch(appsScriptUrl, {
        method: 'POST',
        body: JSON.stringify({
          action: 'submitCompanyGeneralEvaluation',
          mssvs: mssvs,
          weekNumber: weekNumber,
          content: finalContent
        }),
        headers: { 'Content-Type': 'text/plain;charset=utf-8' }
      });
      const result = await res.json();
      if (result.status === 'success') {
        setSuccess(true);
      } else {
        setError(result.message || 'Có lỗi xảy ra khi nộp đánh giá.');
      }
    } catch (err) {
      setError('Lỗi kết nối. Vui lòng kiểm tra mạng.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
        <div className="bg-white rounded-2xl w-full max-w-md p-6 text-center animate-slide-up shadow-2xl">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-8 h-8 text-emerald-600" />
          </div>
          <h2 className="text-xl font-bold text-slate-800 mb-2">Đã nộp đánh giá!</h2>
          <p className="text-slate-600 text-sm mb-6">
            Cảm ơn doanh nghiệp đã phản hồi tiến độ chung cho <strong>{registrations.length} sinh viên</strong> (Tuần {weekNumber}).
          </p>
          <button onClick={onClose} className="w-full bg-slate-900 hover:bg-slate-800 text-white font-medium py-2.5 rounded-xl transition-colors">
            Đóng
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl animate-slide-up">
        <div className="flex items-center justify-between p-5 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-bold text-slate-800">Đánh giá Tiến độ Chung</h2>
            <p className="text-sm text-slate-500 mt-0.5">
              Áp dụng cho tất cả {registrations.length} sinh viên đang thực tập
            </p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-2 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 overflow-y-auto flex-1 space-y-6 bg-slate-50/50">
          {error && (
            <div className="p-3 bg-red-50 text-red-600 text-sm rounded-xl border border-red-100 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-slate-800 mb-2">Đánh giá cho Tuần</label>
            <select
              value={weekNumber}
              onChange={e => setWeekNumber(Number(e.target.value))}
              className="w-full sm:w-64 px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
            >
              {Array.from({ length: 15 }, (_, i) => i + 1).map(w => (
                <option key={w} value={w}>Tuần {w}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-800 mb-2">A. Ý thức kỷ luật & Thái độ <span className="text-red-500">*</span></label>
            <div className="space-y-2">
              {ATTITUDE_OPTIONS.map(opt => (
                <label key={opt} className="flex items-start gap-3 p-3 rounded-xl border border-slate-200 bg-white hover:border-emerald-300 cursor-pointer transition-colors">
                  <input type="radio" name="attitude" value={opt} checked={attitude === opt} onChange={e => setAttitude(e.target.value)} className="mt-1" />
                  <span className="text-sm text-slate-700">{opt}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-800 mb-2">B. Tiến độ & Chất lượng công việc <span className="text-red-500">*</span></label>
            <div className="space-y-2">
              {PROGRESS_OPTIONS.map(opt => (
                <label key={opt} className="flex items-start gap-3 p-3 rounded-xl border border-slate-200 bg-white hover:border-emerald-300 cursor-pointer transition-colors">
                  <input type="radio" name="progress" value={opt} checked={progress === opt} onChange={e => setProgress(e.target.value)} className="mt-1" />
                  <span className="text-sm text-slate-700">{opt}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-800 mb-2">C. Khả năng tiếp thu & Kỹ năng <span className="text-red-500">*</span></label>
            <div className="space-y-2">
              {LEARNING_OPTIONS.map(opt => (
                <label key={opt} className="flex items-start gap-3 p-3 rounded-xl border border-slate-200 bg-white hover:border-emerald-300 cursor-pointer transition-colors">
                  <input type="radio" name="learning" value={opt} checked={learning === opt} onChange={e => setLearning(e.target.value)} className="mt-1" />
                  <span className="text-sm text-slate-700">{opt}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-800 mb-2">D. Đề xuất từ Doanh nghiệp (Tùy chọn)</label>
            <div className="space-y-2">
              {SUGGESTION_OPTIONS.map(opt => (
                <label key={opt} className="flex items-start gap-3 p-3 rounded-xl border border-slate-200 bg-white hover:border-emerald-300 cursor-pointer transition-colors">
                  <input type="checkbox" checked={suggestions.includes(opt)} onChange={() => toggleSuggestion(opt)} className="mt-1 rounded text-emerald-500 focus:ring-emerald-500" />
                  <span className="text-sm text-slate-700">{opt}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-800 mb-2">E. Nhận xét chi tiết (Tùy chọn)</label>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Ghi chú thêm về hiệu suất làm việc hoặc khuyên răn sinh viên..."
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white h-24 resize-none text-sm"
            />
          </div>
        </div>

        <div className="p-5 border-t border-slate-100 flex justify-end gap-3 bg-white rounded-b-2xl">
          <button onClick={onClose} disabled={isSubmitting} className="px-5 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition-colors">
            Hủy
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-6 py-2.5 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-colors flex items-center gap-2 disabled:opacity-70 shadow-sm shadow-emerald-500/20"
          >
            {isSubmitting ? (
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : null}
            {isSubmitting ? 'Đang gửi...' : 'Gửi đánh giá'}
          </button>
        </div>
      </div>
    </div>
  );
}
