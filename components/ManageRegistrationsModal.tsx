'use client';

import React from 'react';
import { X, Trash2, Users, ExternalLink, Calendar } from 'lucide-react';
import { Registration } from '@/lib/data';

interface ManageRegistrationsModalProps {
  registrations: Registration[];
  onClose: () => void;
  onDelete: (registrationId: string) => void;
}

export default function ManageRegistrationsModal({
  registrations,
  onClose,
  onDelete,
}: ManageRegistrationsModalProps) {
  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const internal = registrations.filter((r) => !r.isExternal);
  const external = registrations.filter((r) => r.isExternal);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content max-w-2xl w-full" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100 sticky top-0 bg-white rounded-t-2xl z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-sm">
              <Users className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-800">Manage Registrations</h2>
              <p className="text-xs text-slate-400">
                {registrations.length} total &bull; {internal.length} assigned &bull; {external.length} external
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          {/* Internal Registrations */}
          {internal.length > 0 && (
            <section>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Assigned to Company</span>
                <span className="badge bg-blue-100 text-blue-700">{internal.length}</span>
              </div>
              <div className="space-y-2">
                {internal.map((reg) => (
                  <div
                    key={reg.id}
                    className="flex items-center justify-between p-3.5 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:border-slate-200 transition-all group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                        <span className="text-blue-600 font-bold text-xs">{reg.studentId.slice(0, 2)}</span>
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-slate-800 truncate">{reg.studentName}</p>
                        <p className="text-xs text-slate-500">
                          {reg.studentId} &bull; <span className="font-medium text-slate-600">{reg.companyName}</span>
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0 ml-3">
                      <div className="flex items-center gap-1 text-xs text-slate-400">
                        <Calendar className="w-3 h-3" />
                        {formatDate(reg.registeredAt)}
                      </div>
                      <button
                        onClick={() => onDelete(reg.id)}
                        className="opacity-0 group-hover:opacity-100 btn-danger py-1.5 px-2.5 transition-opacity"
                        title="Delete registration"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* External Registrations */}
          {external.length > 0 && (
            <section>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">External / Self-Found</span>
                <span className="badge bg-violet-100 text-violet-700">{external.length}</span>
              </div>
              <div className="space-y-2">
                {external.map((reg) => (
                  <div
                    key={reg.id}
                    className="flex items-center justify-between p-3.5 rounded-xl border border-violet-100 bg-violet-50/50 hover:bg-white hover:border-violet-200 transition-all group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-lg bg-violet-100 flex items-center justify-center flex-shrink-0">
                        <ExternalLink className="w-4 h-4 text-violet-600" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-slate-800 truncate">{reg.studentName}</p>
                        <p className="text-xs text-slate-500">
                          {reg.studentId} &bull; <span className="font-medium text-violet-600">{reg.companyName}</span>
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0 ml-3">
                      <div className="flex items-center gap-1 text-xs text-slate-400">
                        <Calendar className="w-3 h-3" />
                        {formatDate(reg.registeredAt)}
                      </div>
                      <button
                        onClick={() => onDelete(reg.id)}
                        className="opacity-0 group-hover:opacity-100 btn-danger py-1.5 px-2.5 transition-opacity"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Delete
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
              <p className="text-slate-500 font-medium">No registrations yet</p>
              <p className="text-slate-400 text-sm mt-1">Student registrations will appear here</p>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-slate-100 flex justify-end">
          <button onClick={onClose} className="btn-secondary">Close</button>
        </div>
      </div>
    </div>
  );
}
