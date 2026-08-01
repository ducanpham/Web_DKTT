'use client';

import React, { useState } from 'react';
import { X, CheckCircle2, AlertCircle } from 'lucide-react';
import { Registration } from '@/lib/data';

import { Company } from '@/lib/data';

interface StudentWeeklyReportModalProps {
  companies: Company[];
  appsScriptUrl: string;
  onClose: () => void;
}

export default function StudentWeeklyReportModal({ companies, appsScriptUrl, onClose }: StudentWeeklyReportModalProps) {
  const [studentId, setStudentId] = useState('');
  const [studentName, setStudentName] = useState('');
  const [companyId, setCompanyId] = useState('');
  const [weekNumber, setWeekNumber] = useState(1);
  const [status, setStatus] = useState('');
  const [tasks, setTasks] = useState<string[]>([]);
  const [taskOther, setTaskOther] = useState('');
  const [skills, setSkills] = useState<string[]>([]);
  const [skillOther, setSkillOther] = useState('');
  const [difficulties, setDifficulties] = useState<string[]>([]);
  const [difficultyOther, setDifficultyOther] = useState('');
  const [suitability, setSuitability] = useState('');
  const [suitabilityReason, setSuitabilityReason] = useState('');
  const [supportNeeded, setSupportNeeded] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const STATUS_OPTIONS = [
    '🟢 Hoàn thành vượt tiến độ',
    '🔵 Đúng tiến độ yêu cầu',
    '🟡 Chậm tiến độ (Cần cải thiện)',
    '🔴 Đang gặp khó khăn lớn (Cần hỗ trợ)'
  ];

  const TASK_OPTIONS = [
    'Nghiên cứu tài liệu / Tìm hiểu công cụ mới',
    'Tham gia đào tạo / Training',
    'Thực hiện task được giao (Coding / Thiết kế / Lắp ráp...)',
    'Kiểm thử / Testing / QA',
    'Hỗ trợ dự án thực tế / Khảo sát hiện trường',
    'Viết báo cáo / Document'
  ];

  const SKILL_OPTIONS = [
    'Kỹ năng lập trình / Phần mềm',
    'Kiến thức chuyên ngành cơ điện tử',
    'Kỹ năng làm việc nhóm / Giao tiếp',
    'Kỹ năng giải quyết vấn đề',
    'Ngoại ngữ'
  ];

  const DIFFICULTY_OPTIONS = [
    'Thiếu kiến thức nền tảng',
    'Công cụ / Phần mềm / Thiết bị chưa quen thuộc',
    'Khó khăn trong giao tiếp với mentor / đồng nghiệp',
    'Khối lượng công việc nhiều',
    'Môi trường làm việc chưa thích nghi kịp'
  ];

  const SUITABILITY_OPTIONS = [
    'Rất phù hợp (Đúng chuyên ngành, học hỏi nhiều kiến thức CĐT)',
    'Phù hợp (Có liên quan đến chuyên ngành, môi trường tốt)',
    'Bình thường (Ít liên quan nhưng rèn luyện được kỹ năng)',
    'Không phù hợp (Hoàn toàn trái ngành, không có cơ hội phát triển)'
  ];

  const toggleArray = (arr: string[], setArr: React.Dispatch<React.SetStateAction<string[]>>, item: string) => {
    setArr(arr.includes(item) ? arr.filter(x => x !== item) : [...arr, item]);
  };

  const handleSubmit = async () => {
    if (!studentId || !studentName || !companyId) {
      setError('Vui lòng nhập đầy đủ MSSV, Họ tên và chọn công ty thực tập.');
      return;
    }
    if (!status) {
      setError('Vui lòng chọn trạng thái tiến độ chung.');
      return;
    }
    if (!suitability) {
      setError('Vui lòng đánh giá mức độ phù hợp của doanh nghiệp với sinh viên Cơ điện tử.');
      return;
    }

    const taskList = [...tasks];
    if (taskOther.trim()) taskList.push(`Khác: ${taskOther.trim()}`);

    const skillList = [...skills];
    if (skillOther.trim()) skillList.push(`Khác: ${skillOther.trim()}`);

    const difficultyList = [...difficulties];
    if (difficultyOther.trim()) difficultyList.push(`Khác: ${difficultyOther.trim()}`);

    const contentArr = [
      `Trạng thái: ${status}`,
      `Công việc: ${taskList.length > 0 ? taskList.join('; ') : 'Không có'}`,
      `Kỹ năng: ${skillList.length > 0 ? skillList.join('; ') : 'Không có'}`,
      `Khó khăn: ${difficultyList.length > 0 ? difficultyList.join('; ') : 'Không có'}`,
      `Mức độ phù hợp CĐT: ${suitability}`,
      `Lý do / Góp ý về môi trường: ${suitabilityReason.trim() || 'Không có'}`,
      `Đề xuất hỗ trợ: ${supportNeeded.trim() || 'Không có'}`
    ];

    const finalContent = contentArr.join('\n');

    setIsSubmitting(true);
    setError('');

    try {
      const res = await fetch(appsScriptUrl, {
        method: 'POST',
        body: JSON.stringify({
          action: 'submitStudentReport',
          mssv: studentId.trim(),
          weekNumber: weekNumber,
          studentName: studentName.trim(),
          companyName: companies.find(c => c.id === companyId)?.name || companyId,
          content: finalContent
        }),
        headers: { 'Content-Type': 'text/plain;charset=utf-8' }
      });
      const result = await res.json();
      if (result.status === 'success') {
        setSuccess(true);
      } else {
        setError(result.message || 'Có lỗi xảy ra khi nộp báo cáo.');
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
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-8 h-8 text-blue-600" />
          </div>
          <h2 className="text-xl font-bold text-slate-800 mb-2">Đã nộp báo cáo!</h2>
          <p className="text-slate-600 text-sm mb-6">
            Báo cáo Tuần {weekNumber} của bạn đã được gửi thành công.
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
            <h2 className="text-lg font-bold text-slate-800">Báo cáo Tiến độ Thực tập</h2>
            <p className="text-sm text-slate-500 mt-0.5">
              Điền thông tin và nộp báo cáo hàng tuần
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-800 mb-2">MSSV <span className="text-red-500">*</span></label>
              <input type="text" value={studentId} onChange={e => setStudentId(e.target.value)} placeholder="Nhập MSSV..." className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-800 mb-2">Họ và Tên <span className="text-red-500">*</span></label>
              <input type="text" value={studentName} onChange={e => setStudentName(e.target.value)} placeholder="Nhập họ tên..." className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-800 mb-2">Công ty Thực tập <span className="text-red-500">*</span></label>
              <select value={companyId} onChange={e => setCompanyId(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                <option value="">-- Chọn công ty --</option>
                {companies.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-800 mb-2">Báo cáo cho Tuần <span className="text-red-500">*</span></label>
              <select
                value={weekNumber}
                onChange={e => setWeekNumber(Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                {Array.from({ length: 15 }, (_, i) => i + 1).map(w => (
                  <option key={w} value={w}>Tuần {w}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-800 mb-2">1. Trạng thái tiến độ chung <span className="text-red-500">*</span></label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {STATUS_OPTIONS.map(opt => (
                <label key={opt} className="flex items-start gap-3 p-3 rounded-xl border border-slate-200 bg-white hover:border-blue-300 cursor-pointer transition-colors">
                  <input type="radio" name="status" value={opt} checked={status === opt} onChange={e => setStatus(e.target.value)} className="mt-1" />
                  <span className="text-sm text-slate-700">{opt}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-800 mb-2">2. Công việc thực hiện trong tuần</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-2">
              {TASK_OPTIONS.map(opt => (
                <label key={opt} className="flex items-start gap-3 p-2.5 rounded-xl border border-slate-200 bg-white hover:border-blue-300 cursor-pointer transition-colors">
                  <input type="checkbox" checked={tasks.includes(opt)} onChange={() => toggleArray(tasks, setTasks, opt)} className="mt-1 rounded text-blue-500 focus:ring-blue-500" />
                  <span className="text-sm text-slate-700">{opt}</span>
                </label>
              ))}
            </div>
            <input
              type="text"
              placeholder="Công việc khác (chi tiết)..."
              value={taskOther}
              onChange={e => setTaskOther(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-800 mb-2">3. Kỹ năng đã áp dụng / học được</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-2">
              {SKILL_OPTIONS.map(opt => (
                <label key={opt} className="flex items-start gap-3 p-2.5 rounded-xl border border-slate-200 bg-white hover:border-blue-300 cursor-pointer transition-colors">
                  <input type="checkbox" checked={skills.includes(opt)} onChange={() => toggleArray(skills, setSkills, opt)} className="mt-1 rounded text-blue-500 focus:ring-blue-500" />
                  <span className="text-sm text-slate-700">{opt}</span>
                </label>
              ))}
            </div>
            <input
              type="text"
              placeholder="Kỹ năng khác (chi tiết)..."
              value={skillOther}
              onChange={e => setSkillOther(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-800 mb-2">4. Khó khăn gặp phải</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-2">
              {DIFFICULTY_OPTIONS.map(opt => (
                <label key={opt} className="flex items-start gap-3 p-2.5 rounded-xl border border-slate-200 bg-white hover:border-blue-300 cursor-pointer transition-colors">
                  <input type="checkbox" checked={difficulties.includes(opt)} onChange={() => toggleArray(difficulties, setDifficulties, opt)} className="mt-1 rounded text-blue-500 focus:ring-blue-500" />
                  <span className="text-sm text-slate-700">{opt}</span>
                </label>
              ))}
            </div>
            <input
              type="text"
              placeholder="Khó khăn khác (chi tiết)..."
              value={difficultyOther}
              onChange={e => setDifficultyOther(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-800 mb-2">5. Đánh giá mức độ phù hợp của doanh nghiệp với SV Cơ điện tử <span className="text-red-500">*</span></label>
            <div className="grid grid-cols-1 gap-2 mb-2">
              {SUITABILITY_OPTIONS.map(opt => (
                <label key={opt} className="flex items-start gap-3 p-3 rounded-xl border border-slate-200 bg-white hover:border-blue-300 cursor-pointer transition-colors">
                  <input type="radio" name="suitability" value={opt} checked={suitability === opt} onChange={e => setSuitability(e.target.value)} className="mt-1" />
                  <span className="text-sm text-slate-700">{opt}</span>
                </label>
              ))}
            </div>
            <input
              type="text"
              placeholder="Lý do / Góp ý thêm về môi trường làm việc..."
              value={suitabilityReason}
              onChange={e => setSuitabilityReason(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-800 mb-2">6. Đề xuất / Yêu cầu hỗ trợ (Nhà trường, Công ty)</label>
            <textarea
              value={supportNeeded}
              onChange={e => setSupportNeeded(e.target.value)}
              placeholder="Nhập nội dung đề xuất..."
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white h-24 resize-none text-sm"
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
            className="px-6 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors flex items-center gap-2 disabled:opacity-70 shadow-sm shadow-blue-500/20"
          >
            {isSubmitting ? (
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : null}
            {isSubmitting ? 'Đang gửi...' : 'Gửi báo cáo'}
          </button>
        </div>
      </div>
    </div>
  );
}
