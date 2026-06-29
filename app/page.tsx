'use client';

import { useState, useCallback, useEffect } from 'react';
import { Company, Registration, Role, InternshipGuide, DEFAULT_GUIDE, StudentViewConfig, DEFAULT_STUDENT_VIEW_CONFIG, INITIAL_COMPANIES, INITIAL_REGISTRATIONS, fetchConfigFromAPI } from '@/lib/data';
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

  // Khôi phục cấu hình chung từ Database (Google Sheets API) nếu có
  useEffect(() => {
    if (!hydrated) return;
    const fetchGlobalConfig = async () => {
      // Use the URL from local config or default
      const apiUrl = studentViewConfig.appsScriptUrl || DEFAULT_STUDENT_VIEW_CONFIG.appsScriptUrl;
      if (!apiUrl) return;
      
      const configData = await fetchConfigFromAPI(apiUrl);
      if (configData) {
        if (configData.studentViewConfig) {
          // Merge with local config to preserve the appsScriptUrl if it was set locally
          setStudentViewConfig(prev => ({
            ...configData.studentViewConfig!,
            appsScriptUrl: prev.appsScriptUrl || configData.studentViewConfig!.appsScriptUrl
          }));
        }
        if (configData.guide) {
          setGuide(configData.guide);
        }
      }
    };
    fetchGlobalConfig();
  }, [hydrated]); // Run once after hydration

  // Auto-sync Google Form CSV to reduce slots on load
  useEffect(() => {
    if (!hydrated) return;
    const autoSyncCSV = async () => {
      try {
        const sheetCsvUrl = "https://docs.google.com/spreadsheets/d/1KLgP6Ty01qP8hbPZfwQPKbpCiakbKzaHKPKpYBGdD2M/export?format=csv&gid=439149178";
        const response = await fetch(sheetCsvUrl);
        if (!response.ok) return; // Silent fail if private or error
        const csvText = await response.text();
        
        const Papa = (await import('papaparse')).default;
        Papa.parse(csvText, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            const data = results.data as any[];
            setCompanies(prev => {
              const counts: Record<string, number> = {};
              data.forEach(row => {
                // Check all column values for company names
                const values = Object.values(row).map(v => String(v).trim().toUpperCase());
                prev.forEach(c => {
                  if (values.some(v => v.includes(c.name.trim().toUpperCase()))) {
                     counts[c.id] = (counts[c.id] || 0) + 1;
                  }
                });
              });
              
              return prev.map(c => {
                const used = counts[c.id] || 0;
                // Only update if slots actually changed to avoid unnecessary renders
                const newAvailable = Math.max(0, c.totalSlots - used);
                if (c.availableSlots !== newAvailable) {
                  return { ...c, availableSlots: newAvailable };
                }
                return c;
              });
            });
          }
        });
      } catch (err) {
        console.error("Auto sync CSV error:", err);
      }
    };
    autoSyncCSV();
  }, [hydrated]);

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
    async (companyId: string, studentId: string, studentName: string, studentPhone: string, studentEmail: string, internClass: string, expectedSkills?: string): Promise<string | null> => {
      const company = companies.find((c) => c.id === companyId);
      const companyName = company?.name ?? 'Không xác định';

      if (studentViewConfig.appsScriptUrl) {
        try {
          const res = await fetch(studentViewConfig.appsScriptUrl, {
            method: 'POST',
            body: JSON.stringify({
              action: 'register',
              studentId, studentName, phone: studentPhone, email: studentEmail, internClass, expectedSkills: expectedSkills || '', companyName
            }),
            headers: { 'Content-Type': 'text/plain;charset=utf-8' }
          });
          const result = await res.json();
          if (result.status === 'error') return result.message || 'Lỗi đăng ký qua API.';
        } catch (error) {
          return 'Lỗi mạng khi kết nối đến Google Sheets.';
        }
      } else {
        if (registrations.some(r => r.studentId.trim().toUpperCase() === studentId.trim().toUpperCase())) {
          return 'MSSV này đã đăng ký thực tập tại một công ty khác!';
        }
      }

      setCompanies((prev) =>
        prev.map((c) =>
          c.id === companyId ? { ...c, availableSlots: Math.max(0, c.availableSlots - 1) } : c
        )
      );
      
      const newReg: Registration = {
        id: `r_${Date.now()}`,
        studentId, studentName, studentPhone, studentEmail, internClass,
        companyId, companyName,
        registeredAt: new Date().toISOString(),
        isExternal: false, expectedSkills,
      };
      setRegistrations((prev) => [...prev, newReg]);
      
      return null;
    },
    [companies, registrations, studentViewConfig.appsScriptUrl]
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
    async (regId: string) => {
      const reg = registrations.find((r) => r.id === regId);
      if (!reg) return;

      if (studentViewConfig.appsScriptUrl) {
        try {
          await fetch(studentViewConfig.appsScriptUrl, {
            method: 'POST',
            body: JSON.stringify({ action: 'delete', studentId: reg.studentId }),
            headers: { 'Content-Type': 'text/plain;charset=utf-8' }
          });
        } catch (e) {
          console.error('Lỗi khi xóa trên Sheets API', e);
          alert('Lỗi kết nối khi xóa trên Google Sheets. Bạn có thể cần đồng bộ lại sau.');
        }
      }

      if (!reg.isExternal && reg.companyId !== 'EXT') {
        setCompanies((prev) =>
          prev.map((c) =>
            c.id !== reg.companyId ? c : { ...c, availableSlots: Math.min(c.totalSlots, c.availableSlots + 1) }
          )
        );
      }
      setRegistrations((prev) => prev.filter((r) => r.id !== regId));
    },
    [registrations, studentViewConfig.appsScriptUrl]
  );

  const handleImportCompanies = useCallback(
    (newCompanies: Company[], replace: boolean) => {
      setCompanies((prev) => (replace ? newCompanies : [...prev, ...newCompanies]));
    },
    []
  );

  const handleSyncGoogleSheets = useCallback(async () => {
    if (!studentViewConfig.appsScriptUrl) return;
    try {
      const res = await fetch(studentViewConfig.appsScriptUrl);
      const result = await res.json();
      if (result.status === 'success' && result.data) {
        const fetchedRegs = result.data.map((row: any, i: number) => {
          const matchedCompany = companies.find(c => c.name === row.companyName);
          return {
            id: `r_api_${i}_${Date.now()}`,
            studentId: row.studentId,
            studentName: row.studentName,
            studentPhone: String(row.phone || ''),
            studentEmail: row.email,
            internClass: row.internClass,
            expectedSkills: row.expectedSkills,
            companyName: row.companyName,
            companyId: matchedCompany ? matchedCompany.id : 'UNKNOWN',
            registeredAt: row.timestamp || new Date().toISOString(),
            isExternal: false
          };
        });

        // Thay thế toàn bộ registrations bằng dữ liệu từ sheet
        setRegistrations(fetchedRegs);

        // Tính lại slot cho company
        setCompanies(prev => {
          const counts: Record<string, number> = {};
          fetchedRegs.forEach((r: Registration) => {
            if (r.companyId && r.companyId !== 'UNKNOWN') {
              counts[r.companyId] = (counts[r.companyId] || 0) + 1;
            }
          });
          return prev.map(c => ({
            ...c,
            availableSlots: Math.max(0, c.totalSlots - (counts[c.id] || 0))
          }));
        });
      } else {
        throw new Error(result.message || 'Lỗi dữ liệu trả về');
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
  }, [studentViewConfig.appsScriptUrl, companies]);

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
      onSyncGoogleSheets={handleSyncGoogleSheets}
    />
  );
}
