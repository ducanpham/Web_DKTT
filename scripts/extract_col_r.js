const fs = require('fs');
const path = require('path');
const xlsx = require('xlsx');

const downloadsDir = 'C:/Users/HP/Downloads';
const files = fs.readdirSync(downloadsDir);
const excelFile = files.find(f => f.includes('(1-37).xlsx') && f.includes('KHOA'));

if (!excelFile) throw new Error('Not found');

const filePath = path.join(downloadsDir, excelFile);
const workbook = xlsx.readFile(filePath);
const sheet = workbook.Sheets[workbook.SheetNames[0]];

const data = xlsx.utils.sheet_to_json(sheet, { header: 1 });

for (let i = 0; i < 50; i++) {
    if (data[i]) {
        console.log(`Row ${i+1}, Col B (name): ${data[i][1]}, Col R (Online+Tai tro): ${data[i][17]}`);
    }
}
