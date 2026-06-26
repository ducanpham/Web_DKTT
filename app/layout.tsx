import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Khoa Cơ Điện Tử — Đăng Ký Thực Tập & Hướng Nghiệp | ĐHBK Hà Nội',
  description:
    'Hệ thống đăng ký thực tập và hướng nghiệp dành cho sinh viên Khoa Cơ Điện Tử, Đại học Bách Khoa Hà Nội.',
  keywords: 'cơ điện tử, thực tập, hướng nghiệp, ĐHBK, Bách Khoa, sinh viên, đăng ký',
  openGraph: {
    title: 'Khoa Cơ Điện Tử — Đăng Ký Thực Tập & Hướng Nghiệp',
    description: 'Hệ thống đăng ký thực tập và hướng nghiệp Khoa Cơ Điện Tử ĐHBK Hà Nội',
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
