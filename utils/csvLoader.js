import fs from 'fs';
import path from 'path';

// Helper to decode EUC-KR if necessary, but Node's fs usually reads buffers.
// We'll use TextDecoder for EUC-KR.

export async function getFuneralHomesFromCSV() {
    const filePath = path.join(process.cwd(), 'data', '동물_동물장묘업.csv');

    try {
        const fileBuffer = fs.readFileSync(filePath);
        const decoder = new TextDecoder('euc-kr');
        const fileContent = decoder.decode(fileBuffer);

        // Split lines and remove empty lines
        const rows = fileContent.split('\n').filter(row => row.trim() !== '');

        // Header parsing (assuming first row is header)
        // The CSV structure from preview seemed to verify columns by position or name.
        // Based on standard government data, let's look for known columns.
        const headers = rows[0].split(',').map(h => h.trim().replace(/"/g, ''));

        // Find indices
        const nameIdx = headers.findIndex(h => h.includes('업체명') || h.includes('사업장명'));
        const addrIdx = headers.findIndex(h => h.includes('소재지') || h.includes('주소')); // checking for '도로명전체주소' or '소재지전체주소'
        const phoneIdx = headers.findIndex(h => h.includes('전화번호'));
        const statusIdx = headers.findIndex(h => h.includes('영업상태'));

        // Image pool for random assignment
        const images = [
            "https://images.unsplash.com/photo-1596272875729-ed2c21d50c46?auto=format&fit=crop&q=80&w=600",
            "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=600",
            "https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&q=80&w=600",
            "https://images.unsplash.com/photo-1535905557558-afc4877a26fc?auto=format&fit=crop&q=80&w=600",
            "https://images.unsplash.com/photo-1516455590571-18256e5bb9ff?auto=format&fit=crop&q=80&w=600",
            "https://images.unsplash.com/photo-1445116572660-236099ec97a0?auto=format&fit=crop&q=80&w=600",
            "https://images.unsplash.com/photo-1519052537078-e6302a77da00?auto=format&fit=crop&q=80&w=600"
        ];

        const facilityPool = ["개인추모실", "납골당", "수목장", "픽업서비스", "화장장", "스톤제작", "야외장례", "대기실"];
        const tagPool = ["24시간", "프리미엄", "단독추모", "주차편리", "친절한", "깨끗한", "최신시설", "합리적가격", "정식허가", "따뜻한분위기"];

        const data = rows.slice(1).map((row, index) => {
            // Simple CSV split (handling quotes crudely for now as data seems simple)
            const cols = row.split(',').map(c => c.trim().replace(/"/g, ''));

            // Skip if critical data missing
            if (!cols[nameIdx]) return null;

            // Filter: Only active businesses if status column exists
            if (statusIdx !== -1 && cols[statusIdx] && !cols[statusIdx].includes('영업') && !cols[statusIdx].includes('정상')) {
                // Check if it says "폐업" or similar
                if (cols[statusIdx].includes('폐업') || cols[statusIdx].includes('취소')) return null;
            }

            const name = cols[nameIdx];
            const address = cols[addrIdx] || cols[headers.findIndex(h => h.includes('주소'))] || "주소 미표기";
            const phone = cols[phoneIdx] || "전화번호 미표기";

            // Random enhancers
            const randomImage = images[index % images.length];
            const randomRating = (4.5 + Math.random() * 0.5).toFixed(1); // 4.5 ~ 5.0
            const randomReviewCount = Math.floor(Math.random() * 500) + 10;
            const isOpen24h = Math.random() > 0.7;

            // Pick 3-4 random facilities
            const shuffledFacilities = [...facilityPool].sort(() => 0.5 - Math.random());
            const facilities = shuffledFacilities.slice(0, Math.floor(Math.random() * 2) + 3);

            // Pick 2-3 random tags
            const shuffledTags = [...tagPool].sort(() => 0.5 - Math.random());
            const tags = shuffledTags.slice(0, Math.floor(Math.random() * 2) + 2);
            if (isOpen24h) tags.unshift("24시간");

            return {
                id: `gov-${index}`,
                name: name,
                address: address,
                distance: (Math.random() * 50).toFixed(1), // Mock distance
                rating: randomRating,
                reviewCount: randomReviewCount,
                open24h: isOpen24h,
                phone: phone,
                price: { small: 200000, medium: 350000, large: 500000 }, // Standardized mock price
                facilities: facilities,
                certified: true, // It's from gov list
                permitNo: "정식허가업체",
                director: "장례지도사 상주",
                tags: tags,
                reviewHighlight: "정식 허가된 업체라 믿고 맡길 수 있었습니다.",
                image: randomImage
            };
        }).filter(item => item !== null);

        return data;

    } catch (error) {
        console.error("Failed to load CSV:", error);
        return [];
    }
}
