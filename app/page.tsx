'use client';

import { useState, useCallback, useEffect } from 'react';
import { Company, Registration, Role, INITIAL_COMPANIES, INITIAL_REGISTRATIONS } from '@/lib/data';
import LoginScreen from '@/components/LoginScreen';
import StudentDashboard from '@/components/StudentDashboard';
import AdminDashboard from '@/components/AdminDashboard';

const STORAGE_KEY_ROLE = 'unintern_role';
const STORAGE_KEY_COMPANIES = 'unintern_companies';
const STORAGE_KEY_REGISTRATIONS = 'unintern_registrations';

function loadFromStorage<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function saveToStorage<T>(key: string, value: T) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(key, JSON.stringify(value));
}

export default function Home() {
  const [role, setRole] = useState<Role | null>(null);
  const [companies, setCompanies] = useState<Company[]>(INITIAL_COMPANIES);
  const [registrations, setRegistrations] = useState<Registration[]>(INITIAL_REGISTRATIONS);
  const [hydrated, setHydrated] = useState(false);

  // Hydrate from localStorage on mount
  useEffect(() => {
    const savedRole = loadFromStorage<Role | null>(STORAGE_KEY_ROLE, null);
    const savedCompanies = loadFromStorage<Company[]>(STORAGE_KEY_COMPANIES, INITIAL_COMPANIES);
    const savedRegistrations = loadFromStorage<Registration[]>(STORAGE_KEY_REGISTRATIONS, INITIAL_REGISTRATIONS);

    setRole(savedRole);
    setCompanies(savedCompanies);
    setRegistrations(savedRegistrations);
    setHydrated(true);
  }, []);

  // Persist companies and registrations on changes
  useEffect(() => {
    if (!hydrated) return;
    saveToStorage(STORAGE_KEY_COMPANIES, companies);
  }, [companies, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    saveToStorage(STORAGE_KEY_REGISTRATIONS, registrations);
  }, [registrations, hydrated]);

  const handleLogin = useCallback((selectedRole: Role) => {
    setRole(selectedRole);
    saveToStorage(STORAGE_KEY_ROLE, selectedRole);
  }, []);

  const handleLogout = useCallback(() => {
    setRole(null);
    saveToStorage(STORAGE_KEY_ROLE, null);
  }, []);

  /* ──── Student Actions ──── */

  const handleRegister = useCallback(
    (companyId: string, studentId: string, studentName: string) => {
      // Deduct 1 slot
      setCompanies((prev) =>
        prev.map((c) =>
          c.id === companyId
            ? { ...c, availableSlots: Math.max(0, c.availableSlots - 1) }
            : c
        )
      );
      // Add registration record
      const company = companies.find((c) => c.id === companyId);
      const newReg: Registration = {
        id: `r_${Date.now()}`,
        studentId,
        studentName,
        companyId,
        companyName: company?.name ?? 'Unknown',
        registeredAt: new Date().toISOString(),
        isExternal: false,
      };
      setRegistrations((prev) => [...prev, newReg]);
    },
    [companies]
  );

  const handleDeclareExternal = useCallback(
    (studentId: string, studentName: string, companyName: string) => {
      const newReg: Registration = {
        id: `r_ext_${Date.now()}`,
        studentId,
        studentName,
        companyId: 'EXT',
        companyName: `${companyName} (External)`,
        registeredAt: new Date().toISOString(),
        isExternal: true,
      };
      setRegistrations((prev) => [...prev, newReg]);
    },
    []
  );

  /* ──── Admin Actions ──── */

  const handleDeleteRegistration = useCallback(
    (regId: string) => {
      const reg = registrations.find((r) => r.id === regId);
      if (!reg) return;

      // Restore slot if internal registration
      if (!reg.isExternal && reg.companyId !== 'EXT') {
        setCompanies((prev) =>
          prev.map((c) => {
            if (c.id !== reg.companyId) return c;
            return { ...c, availableSlots: Math.min(c.totalSlots, c.availableSlots + 1) };
          })
        );
      }

      setRegistrations((prev) => prev.filter((r) => r.id !== regId));
    },
    [registrations]
  );

  /* ──── Render ──── */

  // Prevent flash during hydration
  if (!hydrated) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <svg className="animate-spin w-8 h-8 text-blue-500" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <p className="text-slate-400 text-sm">Loading UniIntern Hub…</p>
        </div>
      </div>
    );
  }

  if (!role) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  if (role === 'student') {
    return (
      <StudentDashboard
        companies={companies}
        registrations={registrations}
        onRegister={handleRegister}
        onDeclareExternal={handleDeclareExternal}
        onLogout={handleLogout}
      />
    );
  }

  return (
    <AdminDashboard
      companies={companies}
      registrations={registrations}
      onDeleteRegistration={handleDeleteRegistration}
      onLogout={handleLogout}
    />
  );
}
