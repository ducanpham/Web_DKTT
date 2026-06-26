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
        label: 'Nhà Tài Trợ Gala',
        value: galaSponsors,
        icon: Star,
        bg: 'from-amber-500 to-orange-500',
        lightBg: 'bg-amber-50',
        textColor: 'text-amber-600',
        borderColor: 'border-amber-200',
        ringColor: 'ring-amber-400',
        description: 'Đối tác cao cấp',
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
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        const isActive = activeFilter === stat.key;
        const isClickable = stat.key !== 'slots';

        return (
          <div
            key={stat.key}
            onClick={() => handleClick(stat.key)}
            style={isActive ? { outline: `2px solid`, outlineOffset: '2px' } : {}}
            className={`card p-5 transition-all duration-200 select-none ${
              isClickable ? 'cursor-pointer hover:shadow-md hover:-translate-y-0.5' : ''
            } ${isActive ? `shadow-md -translate-y-0.5 ring-2 ${stat.ringColor}` : ''}`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${stat.bg} flex items-center justify-center shadow-sm`}>
                <Icon className="w-5 h-5 text-white" />
              </div>
              {isClickable && (
                <ChevronRight className={`w-4 h-4 transition-all duration-200 ${isActive ? `${stat.textColor} rotate-90` : 'text-slate-300'}`} />
              )}
            </div>
            <p className="text-3xl font-bold text-slate-800 mb-1 tabular-nums">{stat.value}</p>
            <p className="text-sm font-semibold text-slate-700">{stat.label}</p>
            <p className="text-xs text-slate-400 mt-0.5">{stat.description}</p>

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
