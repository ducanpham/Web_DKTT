'use client';

import { useState, useCallback, useEffect } from 'react';
import { Company, Registration, Role, InternshipGuide, DEFAULT_GUIDE, StudentViewConfig, DEFAULT_STUDENT_VIEW_CONFIG, INITIAL_COMPANIES, INITIAL_REGISTRATIONS } from '@/lib/data';
import LoginScreen from '@/components/LoginScreen';
import StudentDashboard from '@/components/StudentDashboard';
import AdminDashboard from '@/components/AdminDashboard';

const STORAGE_KEY_ROLE = 'unintern_role';
const STORAGE_KEY_COMPANIES = 'unintern_companies_v3';
const STORAGE_KEY_REGISTRATIONS = 'unintern_registrations';
const STORAGE_KEY_GUIDE = 'unintern_guide';
const STORAGE_KEY_STUDENT_VIEW = 'unintern_student_view';

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
  const [guide, setGuide] = useState<InternshipGuide>(DEFAULT_GUIDE);
  const [studentViewConfig, setStudentViewConfig] = useState<StudentViewConfig>(DEFAULT_STUDENT_VIEW_CONFIG);
  const [hydrated, setHydrated] = useState(false);

  // Khôi phục từ localStorage khi tải trang
  useEffect(() => {
    const savedRole = loadFromStorage<Role | null>(STORAGE_KEY_ROLE, null);
    const savedCompanies = loadFromStorage<Company[]>(STORAGE_KEY_COMPANIES, INITIAL_COMPANIES);
    const savedRegistrations = loadFromStorage<Registration[]>(STORAGE_KEY_REGISTRATIONS, INITIAL_REGISTRATIONS);
    const savedGuide = loadFromStorage<InternshipGuide>(STORAGE_KEY_GUIDE, DEFAULT_GUIDE);
    const savedStudentView = loadFromStorage<StudentViewConfig>(STORAGE_KEY_STUDENT_VIEW, DEFAULT_STUDENT_VIEW_CONFIG);
    setRole(savedRole);
    setCompanies(savedCompanies);
    setRegistrations(savedRegistrations);
    setGuide(savedGuide);
    setStudentViewConfig(savedStudentView);
    setHydrated(true);
  }, []);

  useEffect(() => { if (hydrated) saveToStorage(STORAGE_KEY_COMPANIES, companies); }, [companies, hydrated]);
  useEffect(() => { if (hydrated) saveToStorage(STORAGE_KEY_REGISTRATIONS, registrations); }, [registrations, hydrated]);
  useEffect(() => { if (hydrated) saveToStorage(STORAGE_KEY_GUIDE, guide); }, [guide, hydrated]);
  useEffect(() => { if (hydrated) saveToStorage(STORAGE_KEY_STUDENT_VIEW, studentViewConfig); }, [studentViewConfig, hydrated]);

  const handleLogin = useCallback((selectedRole: Role) => {
    setRole(selectedRole);
    saveToStorage(STORAGE_KEY_ROLE, selectedRole);
  }, []);

  const handleLogout = useCallback(() => {
    setRole(null);
    saveToStorage(STORAGE_KEY_ROLE, null);
  }, []);

  /* ──── Hành động của Sinh viên ──── */

  const handleRegister = useCallback(
    (companyId: string, studentId: string, studentName: string, studentPhone: string, studentEmail: string, internClass: string, expectedSkills?: string) => {
      setCompanies((prev) =>
        prev.map((c) =>
          c.id === companyId
            ? { ...c, availableSlots: Math.max(0, c.availableSlots - 1) }
            : c
        )
      );
      const company = companies.find((c) => c.id === companyId);
      const newReg: Registration = {
        id: `r_${Date.now()}`,
        studentId,
        studentName,
        studentPhone,
        studentEmail,
        internClass,
        companyId,
        companyName: company?.name ?? 'Không xác định',
        registeredAt: new Date().toISOString(),
        isExternal: false,
        expectedSkills,
      };
      setRegistrations((prev) => [...prev, newReg]);
    },
    [companies]
  );

  const handleDeclareExternal = useCallback(
    (studentId: string, studentName: string, studentPhone: string, studentEmail: string, internClass: string, companyName: string, expectedSkills?: string) => {
      const newReg: Registration = {
        id: `r_ext_${Date.now()}`,
        studentId,
        studentName,
        studentPhone,
        studentEmail,
        internClass,
        companyId: 'EXT',
        companyName: `${companyName} (Ngoài)`,
        registeredAt: new Date().toISOString(),
        isExternal: true,
        expectedSkills,
      };
      setRegistrations((prev) => [...prev, newReg]);
    },
    []
  );

  /* ──── Hành động của Admin ──── */

  const handleDeleteRegistration = useCallback(
    (regId: string) => {
      const reg = registrations.find((r) => r.id === regId);
      if (!reg) return;
      if (!reg.isExternal && reg.companyId !== 'EXT') {
        setCompanies((prev) =>
          prev.map((c) =>
            c.id !== reg.companyId ? c : { ...c, availableSlots: Math.min(c.totalSlots, c.availableSlots + 1) }
          )
        );
      }
      setRegistrations((prev) => prev.filter((r) => r.id !== regId));
    },
    [registrations]
  );

  const handleImportCompanies = useCallback(
    (newCompanies: Company[], replace: boolean) => {
      setCompanies((prev) => (replace ? newCompanies : [...prev, ...newCompanies]));
    },
    []
  );

  const handleImportRegistrations = useCallback(
    (newRegs: Registration[]) => {
      setRegistrations((prev) => {
        const currentIds = new Set(prev.map(r => r.studentId.toUpperCase()));
        const uniqueNewRegs = newRegs.filter(r => !currentIds.has(r.studentId.toUpperCase()));
        return [...prev, ...uniqueNewRegs];
      });

      // Update availableSlots by counting newRegs per company
      setCompanies((prev) => {
        const counts: Record<string, number> = {};
        newRegs.forEach(r => {
          if (!r.isExternal && r.companyId !== 'EXT') {
            counts[r.companyId] = (counts[r.companyId] || 0) + 1;
          }
        });
        return prev.map(c => {
          if (counts[c.id]) {
            return { ...c, availableSlots: Math.max(0, c.availableSlots - counts[c.id]) };
          }
          return c;
        });
      });
    },
    []
  );

  const handleUpdateGuide = useCallback((newGuide: InternshipGuide) => {
    setGuide(newGuide);
  }, []);

  /* ──── Render ──── */

  if (!hydrated) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <svg className="animate-spin w-8 h-8 text-blue-500" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <p className="text-slate-400 text-sm">Đang tải hệ thống Khoa Cơ Điện Tử…</p>
        </div>
      </div>
    );
  }

  if (!role) return <LoginScreen onLogin={handleLogin} />;

  if (role === 'student') {
    return (
      <StudentDashboard
        companies={companies}
        registrations={registrations}
        guide={guide}
        viewConfig={studentViewConfig}
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
      guide={guide}
      viewConfig={studentViewConfig}
      onDeleteRegistration={handleDeleteRegistration}
      onImportCompanies={handleImportCompanies}
      onImportRegistrations={handleImportRegistrations}
      onUpdateGuide={handleUpdateGuide}
      onUpdateViewConfig={setStudentViewConfig}
      onLogout={handleLogout}
    />
  );
}
