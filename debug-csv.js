const { getFuneralHomesFromCSV } = require('./utils/csvLoader');

async function test() {
    console.log("Testing CSV Loader...");
    try {
        // We'll modify csvLoader momentarily to export headers for debugging if needed, 
        // but for now let's just inspect the output.
        // Actually, since csvLoader returns [] on failure, we can't see why.
        // But we can rely on console.logs if we added them in csvLoader.
        // Let's rely on the fix in csvLoader first.

        const data = await getFuneralHomesFromCSV();
        console.log(`Loaded ${data.length} items.`);
        if (data.length > 0) {
            console.log("First item sample:", JSON.stringify(data[0], null, 2));
        } else {
            console.log("No items loaded. Please check CSV encoding or headers.");
        }
    } catch (e) {
        console.error("Error executing test:", e);
    }
}

test();
