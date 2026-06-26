import fs from 'fs';

const data = JSON.parse(fs.readFileSync('companies_real.json', 'utf8'));

// Clean newlines in text fields
data.forEach(c => {
  c.name = c.name.replace(/\r\n|\r|\n/g, ' ').trim();
  c.contactEmail = c.contactEmail.replace(/\r\n|\r|\n/g, '').trim();
  c.contactPhone = c.contactPhone.replace(/\r\n|\r|\n/g, '').trim();
  c.contactName = c.contactName.replace(/\r\n|\r|\n/g, ' ').trim();
  // Fix company 10 that had empty isGalaSponsor
  if (c.isGalaSponsor === '' || c.isGalaSponsor === null || c.isGalaSponsor === undefined) c.isGalaSponsor = false;
  if (c.isOnlineRecruitment === '' || c.isOnlineRecruitment === null || c.isOnlineRecruitment === undefined) c.isOnlineRecruitment = false;
});

function esc(s) {
  return JSON.stringify(s);
}

const companiesTs = data.map(c => {
  return `  {
    id: ${esc(c.id)},
    name: ${esc(c.name)},
    logo: ${esc(c.logo)},
    isGalaSponsor: ${!!c.isGalaSponsor},
    isOnlineRecruitment: ${!!c.isOnlineRecruitment},
    fields: ${JSON.stringify(c.fields)},
    skills: ${JSON.stringify(c.skills)},
    benefits: {
      allowance: ${esc(c.benefits.allowance)},
      meals: ${esc(c.benefits.meals)},
      housing: ${esc(c.benefits.housing)},
    },
    totalSlots: ${c.totalSlots},
    availableSlots: ${c.availableSlots},
    contactName: ${esc(c.contactName)},
    contactPhone: ${esc(c.contactPhone)},
    contactEmail: ${esc(c.contactEmail)},
    website: '#',
    industry: 'Cơ Điện Tử & Tự Động Hóa',
  }`;
}).join(',\n');

const ts = `export type Role = 'student' | 'admin';

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
${companiesTs},
];

export const INITIAL_REGISTRATIONS: Registration[] = [];
`;

fs.writeFileSync('lib/data.ts', ts, 'utf8');
console.log('Written lib/data.ts with', data.length, 'companies');
console.log('Gala sponsors:', data.filter(c => c.isGalaSponsor).length);
console.log('Online:', data.filter(c => c.isOnlineRecruitment).length);
console.log('Total slots:', data.reduce((s, c) => s + c.totalSlots, 0));
