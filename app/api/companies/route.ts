import { NextResponse } from 'next/server';
import { INITIAL_COMPANIES } from '@/lib/data';

export async function GET() {
  // Chỉ trả về các thông tin cần thiết để đếm slot (tên và tổng slot) để tối ưu dung lượng
  const simplifiedCompanies = INITIAL_COMPANIES.map(c => ({
    name: c.name,
    totalSlots: c.totalSlots
  }));
  
  return NextResponse.json({
    status: 'success',
    data: simplifiedCompanies
  });
}
