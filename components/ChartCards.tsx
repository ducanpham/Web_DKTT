'use client';

import React, { useMemo } from 'react';
import { TrendingUp, Code2, Filter } from 'lucide-react';
import { Company } from '@/lib/data';

interface ChartCardsProps {
  companies: Company[];
  activeFieldFilter: string | null;
  activeSkillFilter: string | null;
  onFieldFilter: (field: string | null) => void;
  onSkillFilter: (skill: string | null) => void;
}

function HorizontalBar({
  label,
  count,
  max,
  color,
  isActive,
  onClick,
}: {
  label: string;
  count: number;
  max: number;
  color: string;
  isActive: boolean;
  onClick: () => void;
}) {
  const pct = max > 0 ? (count / max) * 100 : 0;

  return (
    <button
      onClick={onClick}
      className={`w-full text-left group px-3 py-2.5 rounded-xl transition-all duration-200 ${
        isActive ? 'bg-blue-50 ring-1 ring-blue-200' : 'hover:bg-slate-50'
      }`}
    >
      <div className="flex items-center justify-between mb-1.5">
        <span className={`text-xs font-semibold truncate max-w-[70%] ${isActive ? 'text-blue-700' : 'text-slate-700'}`}>
          {label}
        </span>
        <span className={`text-xs font-bold tabular-nums ml-2 ${isActive ? 'text-blue-600' : 'text-slate-500'}`}>
          {count}
        </span>
      </div>
      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ease-out ${color}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </button>
  );
}

export default function ChartCards({
  companies,
  activeFieldFilter,
  activeSkillFilter,
  onFieldFilter,
  onSkillFilter,
}: ChartCardsProps) {
  const { fieldCounts, skillCounts } = useMemo(() => {
    const fieldMap: Record<string, number> = {};
    const skillMap: Record<string, number> = {};

    companies.forEach((c) => {
      c.fields.forEach((f) => {
        fieldMap[f] = (fieldMap[f] || 0) + 1;
      });
      c.skills.forEach((s) => {
        skillMap[s] = (skillMap[s] || 0) + 1;
      });
    });

    const sortDesc = (m: Record<string, number>) =>
      Object.entries(m)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 7);

    return {
      fieldCounts: sortDesc(fieldMap),
      skillCounts: sortDesc(skillMap),
    };
  }, [companies]);

  const maxField = fieldCounts[0]?.[1] ?? 1;
  const maxSkill = skillCounts[0]?.[1] ?? 1;

  const fieldColors = [
    'bg-blue-500',
    'bg-indigo-500',
    'bg-violet-500',
    'bg-purple-500',
    'bg-sky-500',
    'bg-cyan-500',
    'bg-teal-500',
  ];
  const skillColors = [
    'bg-emerald-500',
    'bg-green-500',
    'bg-lime-500',
    'bg-amber-500',
    'bg-orange-500',
    'bg-rose-500',
    'bg-pink-500',
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
      {/* Fields of Interest */}
      <div className="card p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-sm">
              <TrendingUp className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-800">Top Fields of Interest</h3>
              <p className="text-xs text-slate-400">Click to filter table</p>
            </div>
          </div>
          {activeFieldFilter && (
            <button
              onClick={() => onFieldFilter(null)}
              className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-2.5 py-1 rounded-full transition-all"
            >
              <Filter className="w-3 h-3" />
              Clear
            </button>
          )}
        </div>
        <div className="space-y-1">
          {fieldCounts.map(([field, count], i) => (
            <HorizontalBar
              key={field}
              label={field}
              count={count}
              max={maxField}
              color={fieldColors[i % fieldColors.length]}
              isActive={activeFieldFilter === field}
              onClick={() => onFieldFilter(activeFieldFilter === field ? null : field)}
            />
          ))}
        </div>
      </div>

      {/* Core Skills */}
      <div className="card p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-sm">
              <Code2 className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-800">Top Core Skills</h3>
              <p className="text-xs text-slate-400">Click to filter table</p>
            </div>
          </div>
          {activeSkillFilter && (
            <button
              onClick={() => onSkillFilter(null)}
              className="flex items-center gap-1 text-xs text-emerald-600 hover:text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1 rounded-full transition-all"
            >
              <Filter className="w-3 h-3" />
              Clear
            </button>
          )}
        </div>
        <div className="space-y-1">
          {skillCounts.map(([skill, count], i) => (
            <HorizontalBar
              key={skill}
              label={skill}
              count={count}
              max={maxSkill}
              color={skillColors[i % skillColors.length]}
              isActive={activeSkillFilter === skill}
              onClick={() => onSkillFilter(activeSkillFilter === skill ? null : skill)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
