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
        label: 'Total Companies',
        value: total,
        icon: Building2,
        color: 'blue',
        bg: 'from-blue-500 to-blue-600',
        lightBg: 'bg-blue-50',
        textColor: 'text-blue-600',
        borderColor: 'border-blue-200',
        description: 'Participating recruiters',
      },
      {
        key: 'gala',
        label: 'Gala Sponsors',
        value: galaSponsors,
        icon: Star,
        color: 'amber',
        bg: 'from-amber-500 to-orange-500',
        lightBg: 'bg-amber-50',
        textColor: 'text-amber-600',
        borderColor: 'border-amber-200',
        description: 'Premium partners',
      },
      {
        key: 'online',
        label: 'Online Recruitment',
        value: online,
        icon: Wifi,
        color: 'emerald',
        bg: 'from-emerald-500 to-teal-500',
        lightBg: 'bg-emerald-50',
        textColor: 'text-emerald-600',
        borderColor: 'border-emerald-200',
        description: 'Remote-friendly',
      },
      {
        key: 'slots',
        label: 'Total Slots',
        value: totalSlots,
        icon: Layers,
        color: 'violet',
        bg: 'from-violet-500 to-purple-600',
        lightBg: 'bg-violet-50',
        textColor: 'text-violet-600',
        borderColor: 'border-violet-200',
        description: 'Available positions',
      },
    ];
  }, [companies]);

  const handleClick = (key: string) => {
    if (key === 'slots') return; // Not filterable
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
            className={`
              card p-5 transition-all duration-200 select-none
              ${isClickable ? 'cursor-pointer hover:shadow-md hover:-translate-y-0.5' : ''}
              ${isActive ? `ring-2 ring-offset-1 ring-${stat.color}-400 shadow-md -translate-y-0.5` : ''}
            `}
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${stat.bg} flex items-center justify-center shadow-sm`}>
                <Icon className="w-5 h-5 text-white" />
              </div>
              {isClickable && (
                <ChevronRight
                  className={`w-4 h-4 transition-all duration-200 ${
                    isActive ? `${stat.textColor} rotate-90` : 'text-slate-300'
                  }`}
                />
              )}
            </div>
            <p className="text-3xl font-bold text-slate-800 mb-1 tabular-nums">
              {stat.value}
            </p>
            <p className="text-sm font-semibold text-slate-700">{stat.label}</p>
            <p className="text-xs text-slate-400 mt-0.5">{stat.description}</p>

            {isActive && (
              <div className={`mt-3 ${stat.lightBg} ${stat.borderColor} border rounded-lg px-2.5 py-1.5 flex items-center gap-1.5`}>
                <div className={`w-1.5 h-1.5 rounded-full ${stat.textColor.replace('text-', 'bg-')}`} />
                <span className={`text-xs font-medium ${stat.textColor}`}>Active filter</span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
