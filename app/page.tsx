'use client';

import { useState, useCallback, useEffect } from 'react';
import { Company, Registration, Role, InternshipGuide, DEFAULT_GUIDE, StudentViewConfig, DEFAULT_STUDENT_VIEW_CONFIG, INITIAL_COMPANIES, INITIAL_REGISTRATIONS, fetchConfigFromAPI, saveConfigToAPI } from '@/lib/data';
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
        if (configData.customCompanies && Array.isArray(configData.customCompanies)) {
          setCompanies(configData.customCompanies);
        }
      }
    };
    fetchGlobalConfig();
  }, [hydrated]); // Run once after hydration

  // Auto-sync Google Form CSV to reduce slots on load
  useEffect(() => {
    if (!hydrated) return;
    const autoSyncCSV = async () => {
      // Use the Apps Script URL from the config
      const apiUrl = studentViewConfig.appsScriptUrl || DEFAULT_STUDENT_VIEW_CONFIG.appsScriptUrl;
      if (!apiUrl) return;

      try {
        const response = await fetch(apiUrl, {
          method: 'POST',
          body: JSON.stringify({
            action: 'getSlotCounts',
            companyNames: companies.map(c => c.name)
          }),
          headers: { 'Content-Type': 'text/plain;charset=utf-8' }
        });
        
        if (!response.ok) return;
        const result = await response.json();
        
        if (result.status === 'success' && result.data && typeof result.data === 'object' && !result.data.error) {
          const counts = result.data as Record<string, number>;
          
          setCompanies(prev => {
            return prev.map(c => {
              const used = counts[c.name] || 0;
              const newAvailable = Math.max(0, c.totalSlots - used);
              if (c.availableSlots !== newAvailable) {
                return { ...c, availableSlots: newAvailable };
              }
              return c;
            });
          });
        }
      } catch (err) {
        console.error("Auto sync API error:", err);
      }
    };
    
    // Chạy lần đầu tiên
    autoSyncCSV();
    
    // Cập nhật ngầm mỗi 15 giây
    const intervalId = setInterval(autoSyncCSV, 15000);
    return () => clearInterval(intervalId);
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

      if (studentViewConfig.appsScriptUrl && reg.rowIndex) {
        try {
          const res = await fetch(studentViewConfig.appsScriptUrl, {
            method: 'POST',
            body: JSON.stringify({ action: 'deleteRegistration', rowIndex: reg.rowIndex }),
            headers: { 'Content-Type': 'text/plain;charset=utf-8' }
          });
          const result = await res.json();
          if (result.status === 'success') {
            alert('Đã xóa thành công trên Google Sheets!');
          } else {
            alert('Lỗi từ Google Sheets: ' + result.message);
          }
        } catch (e) {
          console.error('Lỗi khi xóa trên Sheets API', e);
          alert('Lỗi kết nối khi xóa trên Google Sheets.');
        }
      } else if (studentViewConfig.appsScriptUrl && !reg.rowIndex) {
        alert('Bản ghi này chưa được đồng bộ từ Google Sheets (thiếu rowIndex). Vui lòng Đồng bộ Form trước khi xóa.');
        return;
      }

      // Vẫn cập nhật giao diện (Optimistic update)
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
    async (newCompanies: Company[], replace: boolean) => {
      setCompanies((prev) => {
        const updated = replace ? newCompanies : [...prev, ...newCompanies];
        if (studentViewConfig.appsScriptUrl) {
          saveConfigToAPI(studentViewConfig.appsScriptUrl, 'saveCompanies', updated)
            .then(success => {
              if (success) alert('Đã lưu danh sách doanh nghiệp lên Google Sheets!');
              else alert('Lỗi khi lưu doanh nghiệp lên Google Sheets.');
            });
        }
        return updated;
      });
    },
    [studentViewConfig.appsScriptUrl]
  );

  const handleSyncGoogleSheets = useCallback(async () => {
    if (!studentViewConfig.appsScriptUrl) return;
    try {
      const res = await fetch(studentViewConfig.appsScriptUrl, {
        method: 'POST',
        body: JSON.stringify({ action: 'getRegistrations' }),
        headers: { 'Content-Type': 'text/plain;charset=utf-8' }
      });
      const result = await res.json();
      if (result.status === 'success' && Array.isArray(result.data)) {
        const fetchedRegs = result.data.map((row: any) => {
          const matchedCompany = companies.find(c => c.name === row.companyName);
          return {
            id: row.id || `r_api_${Date.now()}`,
            rowIndex: row.rowIndex,
            studentId: row.studentId,
            studentName: row.studentName,
            studentPhone: String(row.studentPhone || ''),
            studentEmail: row.studentEmail,
            internClass: row.internClass,
            expectedSkills: row.expectedSkills || '',
            companyName: row.companyName,
            companyId: matchedCompany ? matchedCompany.id : 'UNKNOWN',
            registeredAt: row.registeredAt || new Date().toISOString(),
            isExternal: false
          };
        });

        // Thay thế toàn bộ registrations bằng dữ liệu từ sheet
        setRegistrations(fetchedRegs);
        alert('Đã đồng bộ danh sách đăng ký từ Google Sheets!');
      } else {
        alert('Có lỗi khi đồng bộ hoặc dữ liệu trống.');
      }
    } catch (err) {
      console.error("Sync API error:", err);
      alert('Lỗi mạng khi kết nối tới Google Sheets.');
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
