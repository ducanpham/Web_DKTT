'use client';

import React, { useMemo } from 'react';
import { Building2, Star, Wifi, Layers, ChevronRight } from 'lucide-react';
import { Company } from '@/lib/data';

interface StatCardsProps {
  companies: Company[];
  activeFilter: string | null;
  onFilterChange: (filter: string | null) => void;
}

export default function StatCards({ companies, activeFilter, onFilterChange }: StatCardsProps) {
  const stats = useMemo(() => {
    const total = companies.length;
    const galaSponsors = companies.filter((c) => c.isGalaSponsor).length;
    const online = companies.filter((c) => c.isOnlineRecruitment).length;
    const onlineAndGala = companies.filter((c) => c.isOnlineRecruitment && c.isGalaSponsor).length;
    const totalSlots = companies.reduce((sum, c) => sum + c.totalSlots, 0);

    return [
      {
        key: 'all',
        label: 'Tổng Doanh Nghiệp',
        value: total,
        icon: Building2,
        bg: 'from-blue-500 to-blue-600',
        lightBg: 'bg-blue-50',
        textColor: 'text-blue-600',
        borderColor: 'border-blue-200',
        ringColor: 'ring-blue-400',
        description: 'Đơn vị tuyển dụng',
      },
      {
        key: 'gala',
        label: 'Đối Tác Thân Thiết',
        value: galaSponsors,
        icon: Star,
        bg: 'from-amber-500 to-orange-500',
        lightBg: 'bg-amber-50',
        textColor: 'text-amber-600',
        borderColor: 'border-amber-200',
        ringColor: 'ring-amber-400',
        description: 'Đối tác cao cấp của Khoa',
      },
      {
        key: 'online',
        label: 'Tuyển Dụng Online',
        value: online,
        icon: Wifi,
        bg: 'from-emerald-500 to-teal-500',
        lightBg: 'bg-emerald-50',
        textColor: 'text-emerald-600',
        borderColor: 'border-emerald-200',
        ringColor: 'ring-emerald-400',
        description: 'Hỗ trợ làm việc từ xa',
      },
      {
        key: 'online-gala',
        label: 'Online & Tài Trợ',
        value: onlineAndGala,
        icon: Star,
        bg: 'from-fuchsia-500 to-purple-600',
        lightBg: 'bg-fuchsia-50',
        textColor: 'text-fuchsia-600',
        borderColor: 'border-fuchsia-200',
        ringColor: 'ring-fuchsia-400',
        description: 'Vừa Online vừa Tài trợ',
      },
      {
        key: 'slots',
        label: 'Tổng Chỉ Tiêu',
        value: totalSlots,
        icon: Layers,
        bg: 'from-violet-500 to-purple-600',
        lightBg: 'bg-violet-50',
        textColor: 'text-violet-600',
        borderColor: 'border-violet-200',
        ringColor: 'ring-violet-400',
        description: 'Vị trí thực tập',
      },
    ];
  }, [companies]);

  const handleClick = (key: string) => {
    if (key === 'slots') return;
    onFilterChange(activeFilter === key ? null : key);
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        const isActive = activeFilter === stat.key;
        const isClickable = stat.key !== 'slots';

        return (
          <div
            key={stat.key}
            onClick={() => handleClick(stat.key)}
            className={`card p-4 transition-all duration-200 select-none ${
              isClickable ? 'cursor-pointer hover:shadow-md hover:-translate-y-0.5' : ''
            } ${isActive ? `shadow-md -translate-y-0.5 ring-2 ring-offset-2 ${stat.ringColor}` : ''}`}
          >
            <div className="flex items-start justify-between mb-3">
              <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${stat.bg} flex items-center justify-center shadow-sm`}>
                <Icon className="w-4 h-4 text-white" />
              </div>
              {isClickable && (
                <ChevronRight className={`w-4 h-4 transition-all duration-200 ${isActive ? `${stat.textColor} rotate-90` : 'text-slate-300'}`} />
              )}
            </div>
            <p className="text-2xl font-bold text-slate-800 mb-0.5 tabular-nums leading-none">{stat.value}</p>
            <p className="text-sm font-semibold text-slate-700 leading-tight">{stat.label}</p>
            <p className="text-[11px] text-slate-400 mt-1 leading-tight">{stat.description}</p>

            {isActive && (
              <div className={`mt-3 ${stat.lightBg} ${stat.borderColor} border rounded-lg px-2.5 py-1.5 flex items-center gap-1.5`}>
                <div className="w-1.5 h-1.5 rounded-full bg-current opacity-60" style={{ color: stat.textColor.replace('text-', '') }} />
                <span className={`text-xs font-medium ${stat.textColor}`}>Đang lọc</span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
