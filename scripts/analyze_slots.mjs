import fs from 'fs';
import XLSX from 'xlsx';

const wb = XLSX.readFile('temp_data.xlsx');
const ws = wb.Sheets[wb.SheetNames[0]];
const json = XLSX.utils.sheet_to_json(ws, { defval: '' });

const COL_SLOTS = 'Số lượng sinh viên Cơ điện tử Quý công ty mong muốn tiếp nhận thực tập trong kỳ tới? (Định dạng trên Forms: Văn bản / Điền số)';
const COL_NAME  = 'Tên doanh nghiệp của Quý công ty là gì? (Định dạng trên Forms: Văn bản - Bắt buộc)';

/** Trích tất cả số trong chuỗi, trả về số LỚN NHẤT */
function extractMaxNumber(raw) {
  const nums = String(raw).match(/\d+/g);
  if (!nums || nums.length === 0) return 0;
  return Math.max(...nums.map(Number));
}

console.log('=== KẾT QUẢ CHỈ TIÊU (LẤY SỐ LỚN NHẤT) ===\n');
console.log('STT | Chỉ tiêu | Giá trị gốc | Tên công ty');
console.log('----+----------+-------------+------------');

let total = 0;
const result = json.map((row, i) => {
  const name = String(row[COL_NAME]).replace(/\r\n|\r|\n/g, ' ').trim();
  const raw  = String(row[COL_SLOTS]).trim();
  const slots = extractMaxNumber(raw);
  total += slots;
  console.log(`${String(i+1).padStart(3)} | ${String(slots).padStart(8)} | ${raw.substring(0,30).padEnd(30)} | ${name.substring(0,50)}`);
  return { id: i + 1, name, rawSlots: raw, slots };
});

console.log('\n====================================');
console.log(`TỔNG CHỈ TIÊU: ${total} sinh viên`);

// Ghi ra file để dùng cho bước tiếp theo
fs.writeFileSync('slots_result.json', JSON.stringify(result, null, 2), 'utf8');
console.log('\nĐã lưu kết quả vào slots_result.json');
