
const fs = require('fs');
const path = require('path');

const filePath = path.join(process.cwd(), 'data', '동물_동물장묘업.csv');

try {
    const fileBuffer = fs.readFileSync(filePath);
    const decoder = new TextDecoder('euc-kr');
    const fileContent = decoder.decode(fileBuffer);

    const lines = fileContent.split('\n');
    console.log(`Total lines: ${lines.length}`);
    console.log("First 3 lines:");
    lines.slice(0, 3).forEach(line => console.log(line));

} catch (e) {
    console.error("Error:", e);
}
