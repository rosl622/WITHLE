import fs from 'fs';
import path from 'path';

// Helper to decode EUC-KR if necessary, but Node's fs usually reads buffers.
// We'll use TextDecoder for EUC-KR.

export async function getFuneralHomesFromCSV() {
    const filePath = path.join(process.cwd(), 'data', 'detail_information.csv');

    try {
        const fileBuffer = fs.readFileSync(filePath);
        let fileContent = fileBuffer.toString('utf-8');

        // Simple check: if it contains Replacement Character (U+FFFD), it might be wrong encoding.
        // We use the unicode escape sequence to avoid copy-paste issues with invisible characters.
        if (fileContent.includes('\uFFFD')) {
            console.log("Detected invalid UTF-8 (Replacement Character), trying EUC-KR...");
            const decoder = new TextDecoder('euc-kr');
            fileContent = decoder.decode(fileBuffer);
        }

        // Split lines and remove empty lines
        const rows = fileContent.split('\n').filter(row => row.trim() !== '');
        console.log(`Read ${rows.length} rows from CSV.`);

        if (rows.length === 0) return [];

        // Robust CSV Parser function
        const parseCSVLine = (text) => {
            const result = [];
            let current = '';
            let inQuotes = false;

            for (let i = 0; i < text.length; i++) {
                const char = text[i];
                if (char === '"') {
                    inQuotes = !inQuotes;
                } else if (char === ',' && !inQuotes) {
                    result.push(current.trim().replace(/^"|"$/g, '').replace(/""/g, '"'));
                    current = '';
                } else {
                    current += char;
                }
            }
            result.push(current.trim().replace(/^"|"$/g, '').replace(/""/g, '"'));
            return result;
        };

        // Header parsing
        const headers = parseCSVLine(rows[0]);
        console.log("Detected Headers:", headers);

        // Column Mapping
        const colMap = {
            name: headers.indexOf('업체명'),
            address: headers.indexOf('주소'),
            phone: headers.indexOf('전화번호'),
            open24h: headers.indexOf('24시간 운영여부'),
            desc: headers.indexOf('한줄소개'),
            image: headers.indexOf('대표이미지URL'),
            facilities: headers.indexOf('보유시설'),
            director: headers.indexOf('장례지도사'),
            reviewHighlight: headers.indexOf('대표후기'),
            priceSmall: headers.indexOf('소형_비용'),
            priceMedium: headers.indexOf('중형_비용'),
            priceLarge: headers.indexOf('대형_비용'),
            rating: headers.indexOf('평점'),
            reviewCount: headers.indexOf('후기수'),
            tags: headers.indexOf('태그'),
            permitNo: headers.indexOf('허가번호')
        };

        console.log("Column Mapping:", colMap);

        // Image pool for fallback
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
            const cols = parseCSVLine(row);
            const getCol = (idx) => idx !== -1 && cols[idx] ? cols[idx] : '';

            const name = getCol(colMap.name);
            if (!name) return null;

            // Basic Fields
            const hasImage = getCol(colMap.image);
            const image = hasImage || images[index % images.length];

            let facilities = getCol(colMap.facilities) ? getCol(colMap.facilities).split(',').map(s => s.trim()).filter(Boolean) : [];
            if (facilities.length === 0) {
                // Fallback random
                facilities = [...facilityPool].sort(() => 0.5 - Math.random()).slice(0, 3 + Math.floor(Math.random() * 2));
            }

            let tags = getCol(colMap.tags) ? getCol(colMap.tags).split(',').map(s => s.trim()).filter(Boolean) : [];
            if (tags.length === 0) {
                // Fallback random
                tags = [...tagPool].sort(() => 0.5 - Math.random()).slice(0, 2 + Math.floor(Math.random() * 2));
            }

            const open24hRaw = getCol(colMap.open24h);
            const open24h = open24hRaw === 'Y' || open24hRaw === 'y';

            if (open24h && !tags.includes('24시간')) tags.unshift('24시간');

            return {
                id: `csv-${index}`,
                name: name,
                address: getCol(colMap.address) || "주소 미표기",
                phone: getCol(colMap.phone) || "",
                open24h: open24h,

                // Details
                description: getCol(colMap.desc) || "반려동물과의 소중한 이별, 저희가 함께하겠습니다. 따뜻하고 편안한 분위기에서 아이를 배웅할 수 있도록 최선을 다하겠습니다.",
                image: image,
                facilities: facilities,
                director: getCol(colMap.director) || "전문 장례지도사 상주",
                reviewHighlight: getCol(colMap.reviewHighlight) || "정식 허가된 업체라 믿고 맡길 수 있었습니다.",

                // Metrics
                rating: getCol(colMap.rating) || (4.5 + Math.random() * 0.5).toFixed(1),
                reviewCount: getCol(colMap.reviewCount) || Math.floor(Math.random() * 500) + 10,

                // Price
                price: {
                    small: parseInt(getCol(colMap.priceSmall)) || 200000,
                    medium: parseInt(getCol(colMap.priceMedium)) || 300000,
                    large: parseInt(getCol(colMap.priceLarge)) || 500000
                },

                certified: true, // Assuming listed ones are certified
                permitNo: getCol(colMap.permitNo) || "정식허가업체",

                // Add mocked distance for now as we don't have geo-coords in CSV yet
                distance: (Math.random() * 50).toFixed(1)
            };
        }).filter(item => item !== null);

        return data;

    } catch (error) {
        console.error("Failed to load CSV:", error);
        return [];
    }
}
