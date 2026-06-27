const fs = require('fs');
const data = fs.readFileSync('lib/data.ts', 'utf8');
const regex = /name:\s*['"]([^'"]+)['"]/g;
let match;
let count = 0;
while ((match = regex.exec(data)) && count < 15) {
    console.log(match[1]);
    count++;
}
