const fs = require('fs');
const path = require('path');
const ExcelJS = require('exceljs');

async function run() {
    const downloadsDir = 'C:/Users/HP/Downloads';
    const files = fs.readdirSync(downloadsDir);
    const excelFile = files.find(f => f.includes('(1-37).xlsx') && f.includes('KHOA'));

    if (!excelFile) throw new Error('Not found');

    const filePath = path.join(downloadsDir, excelFile);
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(filePath);
    
    const worksheet = workbook.worksheets[0];
    const results = [];
    worksheet.eachRow((row, rowNumber) => {
        // Col B is index 2 in ExcelJS (1-based), Col R is 18
        const name = row.getCell(2).text || '';
        const colR = row.getCell(18).text || '';
        if (name.trim()) {
            results.push({ name: name.trim(), onlineTaiTro: colR.trim() });
        }
    });

    console.log(JSON.stringify(results.slice(0, 10), null, 2));
    
    // Save to a json to patch data later
    fs.writeFileSync('online_taitro_raw.json', JSON.stringify(results, null, 2));
    console.log(`Saved ${results.length} rows to online_taitro_raw.json`);
}

run().catch(console.error);
