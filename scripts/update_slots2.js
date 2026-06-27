const fs = require('fs');

const slotsData = JSON.parse(fs.readFileSync('slots_result.json', 'utf8'));
let dataTsContent = fs.readFileSync('lib/data.ts', 'utf8');

slotsData.forEach((comp, index) => {
  const compId = 'real_' + comp.id;
  const slots = comp.slots;
  
  const idRegex = new RegExp(`id:\\s*['"]${compId}['"]`);
  const match = idRegex.exec(dataTsContent);
  
  if (match) {
    const startIndex = match.index;
    const nextCompIndex = dataTsContent.indexOf('id: "real_', startIndex + 10);
    const endBoundary = nextCompIndex !== -1 ? nextCompIndex : dataTsContent.length;
    
    let block = dataTsContent.substring(startIndex, endBoundary);
    
    block = block.replace(/totalSlots:\s*\d+,/, `totalSlots: ${slots},`);
    block = block.replace(/availableSlots:\s*\d+,/, `availableSlots: ${slots},`);
    
    dataTsContent = dataTsContent.substring(0, startIndex) + block + dataTsContent.substring(endBoundary);
  }
});

fs.writeFileSync('lib/data.ts', dataTsContent, 'utf8');
console.log('Updated lib/data.ts successfully with correct slots ' + slotsData.reduce((acc, c) => acc + c.slots, 0));
