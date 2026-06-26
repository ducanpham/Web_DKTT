import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'UniIntern Hub — University Recruitment & Internship Dashboard',
  description:
    'Comprehensive role-based recruitment and internship management platform for university students and administrators.',
  keywords: 'university, internship, recruitment, dashboard, student, admin',
  openGraph: {
    title: 'UniIntern Hub',
    description: 'University Recruitment & Internship Management Dashboard',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.className} antialiased`}>{children}</body>
    </html>
  );
}
