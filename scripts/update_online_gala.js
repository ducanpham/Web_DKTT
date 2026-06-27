const fs = require('fs');

const colRData = require('../col_r_data.json');
const slotsData = require('../slots_result.json');

let dataTsContent = fs.readFileSync('lib/data.ts', 'utf8');

colRData.forEach((row, index) => {
  const compId = 'real_' + slotsData[index].id;
  const status = row.status || '';
  
  const isOnlineRecruitment = status.includes('Tham gia') && !status.includes('Không tham gia') ? 'true' : 'false';
  const isGalaSponsor = status.includes('tài trợ') ? 'true' : 'false';

  const idRegex = new RegExp(`id:\\s*['"]${compId}['"]`);
  const match = idRegex.exec(dataTsContent);
  
  if (match) {
    const startIndex = match.index;
    const nextCompIndex = dataTsContent.indexOf('id: "real_', startIndex + 10);
    const endBoundary = nextCompIndex !== -1 ? nextCompIndex : dataTsContent.length;
    
    let block = dataTsContent.substring(startIndex, endBoundary);
    
    // Replace isOnlineRecruitment and isGalaSponsor
    block = block.replace(/isOnlineRecruitment:\s*(true|false),/, `isOnlineRecruitment: ${isOnlineRecruitment},`);
    block = block.replace(/isGalaSponsor:\s*(true|false),/, `isGalaSponsor: ${isGalaSponsor},`);
    
    dataTsContent = dataTsContent.substring(0, startIndex) + block + dataTsContent.substring(endBoundary);
  }
});

fs.writeFileSync('lib/data.ts', dataTsContent, 'utf8');
console.log('Updated lib/data.ts with new isOnlineRecruitment and isGalaSponsor flags based on col R.');
