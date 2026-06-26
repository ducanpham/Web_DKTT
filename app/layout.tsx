import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'UniIntern Hub — Hệ thống Quản lý Thực tập Sinh viên',
  description:
    'Nền tảng quản lý tuyển dụng và thực tập phân quyền theo vai trò dành cho sinh viên và quản trị viên trường đại học.',
  keywords: 'đại học, thực tập, tuyển dụng, dashboard, sinh viên, quản trị viên',
  openGraph: {
    title: 'UniIntern Hub',
    description: 'Hệ thống Quản lý Tuyển dụng & Thực tập Đại học',
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
