export type Role = 'student' | 'admin';

export interface Company {
  id: string;
  name: string;
  logo: string; // emoji placeholder
  isGalaSponsor: boolean;
  isOnlineRecruitment: boolean;
  // Fields visible to both
  fields: string[];
  skills: string[];
  benefits: {
    allowance: string;
    meals: string;
    housing: string;
  };
  totalSlots: number;
  availableSlots: number;
  // Admin-only fields
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  website: string;
  industry: string;
}

export interface Registration {
  id: string;
  studentId: string;
  studentName: string;
  companyId: string;
  companyName: string;
  registeredAt: string;
  isExternal: boolean;
}

export const INITIAL_COMPANIES: Company[] = [
  {
    id: 'c1',
    name: 'FPT Software',
    logo: '🔷',
    isGalaSponsor: true,
    isOnlineRecruitment: true,
    fields: ['Software Engineering', 'AI/ML', 'Cloud Computing'],
    skills: ['React', 'Java', 'Python', 'DevOps'],
    benefits: {
      allowance: '3,000,000 VND/month',
      meals: 'Free lunch provided',
      housing: 'Housing allowance available',
    },
    totalSlots: 15,
    availableSlots: 15,
    contactName: 'Nguyen Thi Lan',
    contactPhone: '0901 234 567',
    contactEmail: 'internship@fpt.com.vn',
    website: 'https://fptsoftware.com',
    industry: 'Information Technology',
  },
  {
    id: 'c2',
    name: 'Viettel Solutions',
    logo: '📡',
    isGalaSponsor: true,
    isOnlineRecruitment: false,
    fields: ['Telecommunications', 'Network Engineering', 'Cybersecurity'],
    skills: ['Linux', 'Networking', 'Python', 'C++'],
    benefits: {
      allowance: '2,500,000 VND/month',
      meals: 'Meal allowance 50,000 VND/day',
      housing: 'Not provided',
    },
    totalSlots: 10,
    availableSlots: 10,
    contactName: 'Tran Van Minh',
    contactPhone: '0912 345 678',
    contactEmail: 'hr.intern@viettel.com.vn',
    website: 'https://viettel.com.vn',
    industry: 'Telecommunications',
  },
  {
    id: 'c3',
    name: 'VNG Corporation',
    logo: '🎮',
    isGalaSponsor: true,
    isOnlineRecruitment: true,
    fields: ['Game Development', 'Backend Engineering', 'Data Science'],
    skills: ['Unity', 'Node.js', 'SQL', 'Machine Learning'],
    benefits: {
      allowance: '4,000,000 VND/month',
      meals: 'Canteen access included',
      housing: 'Transportation subsidy',
    },
    totalSlots: 8,
    availableSlots: 8,
    contactName: 'Le Thi Hoa',
    contactPhone: '0923 456 789',
    contactEmail: 'talent@vng.com.vn',
    website: 'https://vng.com.vn',
    industry: 'Technology & Gaming',
  },
  {
    id: 'c4',
    name: 'Momo E-Wallet',
    logo: '💳',
    isGalaSponsor: false,
    isOnlineRecruitment: true,
    fields: ['FinTech', 'Mobile Development', 'UX/UI Design'],
    skills: ['React Native', 'Flutter', 'Figma', 'TypeScript'],
    benefits: {
      allowance: '3,500,000 VND/month',
      meals: 'Not provided',
      housing: 'Not provided',
    },
    totalSlots: 6,
    availableSlots: 6,
    contactName: 'Pham Quoc Bao',
    contactPhone: '0934 567 890',
    contactEmail: 'campus@momo.vn',
    website: 'https://momo.vn',
    industry: 'Financial Technology',
  },
  {
    id: 'c5',
    name: 'Shopee Vietnam',
    logo: '🛒',
    isGalaSponsor: true,
    isOnlineRecruitment: false,
    fields: ['E-Commerce', 'Data Analytics', 'Product Management'],
    skills: ['Python', 'SQL', 'Excel', 'Tableau'],
    benefits: {
      allowance: '4,500,000 VND/month',
      meals: 'Daily meal vouchers',
      housing: 'Housing support for out-of-city interns',
    },
    totalSlots: 12,
    availableSlots: 12,
    contactName: 'Hoang Bich Ngoc',
    contactPhone: '0945 678 901',
    contactEmail: 'intern.vn@shopee.com',
    website: 'https://shopee.vn',
    industry: 'E-Commerce',
  },
  {
    id: 'c6',
    name: 'Bosch Vietnam',
    logo: '⚙️',
    isGalaSponsor: false,
    isOnlineRecruitment: false,
    fields: ['Mechanical Engineering', 'Embedded Systems', 'Automotive'],
    skills: ['CAD/CAM', 'C Embedded', 'MATLAB', 'AutoCAD'],
    benefits: {
      allowance: '2,800,000 VND/month',
      meals: 'On-site cafeteria',
      housing: 'Not provided',
    },
    totalSlots: 5,
    availableSlots: 5,
    contactName: 'Vo Thanh Tung',
    contactPhone: '0956 789 012',
    contactEmail: 'hr.vietnam@bosch.com',
    website: 'https://bosch.com.vn',
    industry: 'Manufacturing & Engineering',
  },
  {
    id: 'c7',
    name: 'Grab Vietnam',
    logo: '🚗',
    isGalaSponsor: false,
    isOnlineRecruitment: true,
    fields: ['Software Engineering', 'Operations', 'Marketing Tech'],
    skills: ['Go', 'Kafka', 'Kubernetes', 'React'],
    benefits: {
      allowance: '5,000,000 VND/month',
      meals: 'GrabFood credits monthly',
      housing: 'Flexible work arrangement',
    },
    totalSlots: 7,
    availableSlots: 7,
    contactName: 'Nguyen Duc Hieu',
    contactPhone: '0967 890 123',
    contactEmail: 'campus.vn@grab.com',
    website: 'https://grab.com',
    industry: 'Super App / Logistics',
  },
  {
    id: 'c8',
    name: 'KPMG Vietnam',
    logo: '📊',
    isGalaSponsor: false,
    isOnlineRecruitment: false,
    fields: ['Accounting & Audit', 'Tax Consulting', 'Financial Advisory'],
    skills: ['Excel', 'PowerBI', 'Accounting', 'Tax Law'],
    benefits: {
      allowance: '2,000,000 VND/month',
      meals: 'Not provided',
      housing: 'Not provided',
    },
    totalSlots: 9,
    availableSlots: 9,
    contactName: 'Dang Thi Mai',
    contactPhone: '0978 901 234',
    contactEmail: 'grad.recruit@kpmg.com.vn',
    website: 'https://kpmg.com/vn',
    industry: 'Professional Services',
  },
  {
    id: 'c9',
    name: 'Tiki Corporation',
    logo: '📦',
    isGalaSponsor: false,
    isOnlineRecruitment: true,
    fields: ['E-Commerce', 'Logistics Tech', 'Data Engineering'],
    skills: ['Spark', 'Airflow', 'dbt', 'PostgreSQL'],
    benefits: {
      allowance: '3,200,000 VND/month',
      meals: 'Lunch provided on Tuesdays & Thursdays',
      housing: 'Not provided',
    },
    totalSlots: 11,
    availableSlots: 11,
    contactName: 'Ly Van Thanh',
    contactPhone: '0989 012 345',
    contactEmail: 'talent@tiki.vn',
    website: 'https://tiki.vn',
    industry: 'E-Commerce',
  },
  {
    id: 'c10',
    name: 'GE Healthcare Vietnam',
    logo: '🏥',
    isGalaSponsor: true,
    isOnlineRecruitment: false,
    fields: ['Biomedical Engineering', 'Healthcare IT', 'Quality Assurance'],
    skills: ['HL7/FHIR', 'Python', 'ISO 13485', 'Signal Processing'],
    benefits: {
      allowance: '3,800,000 VND/month',
      meals: 'On-site cafeteria subsidy',
      housing: 'Relocation package available',
    },
    totalSlots: 4,
    availableSlots: 4,
    contactName: 'Bui Minh Duc',
    contactPhone: '0990 123 456',
    contactEmail: 'intern.vn@ge.com',
    website: 'https://gehealthcare.com',
    industry: 'Healthcare Technology',
  },
];

export const INITIAL_REGISTRATIONS: Registration[] = [
  {
    id: 'r1',
    studentId: 'SV001',
    studentName: 'Nguyen Van An',
    companyId: 'c1',
    companyName: 'FPT Software',
    registeredAt: '2026-06-10T08:30:00Z',
    isExternal: false,
  },
  {
    id: 'r2',
    studentId: 'SV002',
    studentName: 'Tran Thi Bich',
    companyId: 'c3',
    companyName: 'VNG Corporation',
    registeredAt: '2026-06-11T09:15:00Z',
    isExternal: false,
  },
  {
    id: 'r3',
    studentId: 'SV003',
    studentName: 'Le Quang Huy',
    companyId: 'c5',
    companyName: 'Shopee Vietnam',
    registeredAt: '2026-06-12T10:00:00Z',
    isExternal: false,
  },
  {
    id: 'r4',
    studentId: 'SV004',
    studentName: 'Pham Ngoc Linh',
    companyId: 'c7',
    companyName: 'Grab Vietnam',
    registeredAt: '2026-06-13T11:45:00Z',
    isExternal: false,
  },
  {
    id: 'r5',
    studentId: 'SV005',
    studentName: 'Hoang Duc Nam',
    companyId: 'EXT',
    companyName: 'Microsoft Vietnam (External)',
    registeredAt: '2026-06-14T14:00:00Z',
    isExternal: true,
  },
];
