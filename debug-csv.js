
const { getFuneralHomesFromCSV } = require('./utils/csvLoader');

// Mocking Next.js environment for path.join(process.cwd()) if needed, 
// usually running `node debug-csv.js` from project root works fine if process.cwd() is correct.

async function test() {
    console.log("Testing CSV Loader...");
    try {
        const data = await getFuneralHomesFromCSV();
        console.log(`Loaded ${data.length} items.`);
        if (data.length > 0) {
            console.log("First item:", JSON.stringify(data[0], null, 2));
        }
    } catch (e) {
        console.error("Error:", e);
    }
}

test();
