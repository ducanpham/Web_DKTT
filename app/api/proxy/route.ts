import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { url, payload } = body;

    if (!url) {
      return NextResponse.json({ status: 'error', message: 'Thiếu URL Apps Script.' }, { status: 400 });
    }

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      return NextResponse.json({ 
        status: 'error', 
        message: `HTTP Error ${response.status}: ${response.statusText}` 
      }, { status: 502 });
    }

    const text = await response.text();
    try {
      const data = JSON.parse(text);
      return NextResponse.json(data);
    } catch (e) {
      // Nếu server trả về HTML (ví dụ trang đăng nhập hoặc lỗi của Google) thay vì JSON
      console.error("Proxy received non-JSON:", text.substring(0, 500));
      return NextResponse.json({ 
        status: 'error', 
        message: 'Apps Script trả về dữ liệu không hợp lệ (có thể do lỗi cấu hình phân quyền hoặc URL sai).',
        rawText: text.substring(0, 500) 
      }, { status: 502 });
    }
  } catch (error: any) {
    console.error("Proxy internal error:", error);
    return NextResponse.json({ status: 'error', message: error.message }, { status: 500 });
  }
}
