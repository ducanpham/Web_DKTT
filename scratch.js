const XLSX = require('xlsx');
const fs = require('fs');

const downloadsPath = process.env.USERPROFILE + '\\Downloads';
const files = fs.readdirSync(downloadsPath);
const targets = files.filter(f => f.includes('1-37') && f.toLowerCase().includes('xlsx') && !f.startsWith('~$'));
const filePath = downloadsPath + '\\' + targets[0];

const wb = XLSX.readFile(filePath);
const ws = wb.Sheets[wb.SheetNames[0]];
const aoa = XLSX.utils.sheet_to_json(ws, { header: 1, defval: '' });

// Col indexes (0-based):
// 0=STT, 1=Tên CTY, 2=Địa chỉ, 3=HR Name, 4=Title, 5=Phone, 6=Email, 7=Slots
// 16(Q)=Sự kiện tham dự, 17(R)=Online phỏng vấn tháng 7

const galaList = [];       // Q contains "Lễ tốt nghiệp"
const onlineSponsors = []; // R contains "Tham gia và tài trợ"
const onlineOnly = [];     // R contains "Chỉ tham gia"
const notOnline = [];      // R = không tham dự

for (let i = 1; i < aoa.length; i++) {
  const row = aoa[i];
  const stt = row[0];
  const name = String(row[1] || '').trim();
  const q = String(row[16] || '').trim();
  const r = String(row[17] || '').trim();
  if (!name || !stt) continue;

  const isGala = q.toLowerCase().includes('lễ tốt nghiệp') || q.toLowerCase().includes('tốt nghiệp');
  const isOnlineSponsor = r.toLowerCase().includes('tài trợ');
  const isOnlineOnly = r.toLowerCase().includes('chỉ tham gia');

  if (isGala) galaList.push({ stt, name, q: q.substring(0, 120), r });
  if (isOnlineSponsor) onlineSponsors.push({ stt, name, r });
  if (isOnlineOnly) onlineOnly.push({ stt, name, r });
  if (!isOnlineSponsor && !isOnlineOnly) notOnline.push({ stt, name, r });
}

console.log(`\n=== 1. THAM DỰ LỄ TỐT NGHIỆP (cột Q) — ${galaList.length} công ty ===`);
galaList.forEach(c => console.log(`  ${c.stt}. ${c.name}`));

console.log(`\n=== 2. THAM GIA + TÀI TRỢ Online tháng 7 (cột R) — ${onlineSponsors.length} công ty ===`);
onlineSponsors.forEach(c => console.log(`  ${c.stt}. ${c.name} | R: ${c.r}`));

console.log(`\n=== 3. CHỈ THAM GIA Online tháng 7 (cột R) — ${onlineOnly.length} công ty ===`);
onlineOnly.forEach(c => console.log(`  ${c.stt}. ${c.name} | R: ${c.r}`));

console.log(`\n=== 4. KHÔNG tham gia Online (cột R) — ${notOnline.length} công ty ===`);
notOnline.forEach(c => console.log(`  ${c.stt}. ${c.name} | R: "${c.r}"`));

console.log(`\n=== TỔNG KẾT ===`);
console.log(`Tổng: ${aoa.length - 1} công ty`);
console.log(`Tham dự Lễ TN (Gala): ${galaList.length}`);
console.log(`Online + Tài trợ: ${onlineSponsors.length}`);
console.log(`Online chỉ tham gia: ${onlineOnly.length}`);
console.log(`Không tham gia / Khác: ${notOnline.length}`);
