const fs = require('fs');
let data = fs.readFileSync('lib/data.ts', 'utf8');
data = data.replace(/(\s+)(website:.*?,)/g, '$1$2$1address: "Chưa cập nhật",');
fs.writeFileSync('lib/data.ts', data);
console.log('Done');
