// api/chat.js
// Vercel Serverless Function (Node.js)

export default async function handler(req, res) {
    // 1. 보안: POST 요청만 허용
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    // 2. 입력값 검증
    const { message, systemPrompt } = req.body;
    if (!message) {
        return res.status(400).json({ error: 'Message is required' });
    }

    // 3. 환경변수 확인 (여러 가지 이름 시도)
    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || process.env.API_KEY;

    // 디버깅용 로그 (키 자체는 숨김)
    console.log("Environment Check:", {
        hasGemini: !!process.env.GEMINI_API_KEY,
        hasGoogle: !!process.env.GOOGLE_API_KEY,
        hasGeneric: !!process.env.API_KEY,
        nodeEnv: process.env.NODE_ENV
    });

    if (!apiKey) {
        return res.status(500).json({ error: 'Server Configuration Error: API Key missing (Check Vercel Environment Variables)' });
    }

    try {
        // 3. Google Gemini API 호출
        // 3. Google Gemini API 호출 (최신 Gemini 2.5 Flash 사용 - 2026 표준)
        // 1.5, 2.0 구버전은 Free Tier 제한이 있을 수 있음
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: message }]
                }],
                // 클라이언트에서 보낸 시스템 프롬프트가 있으면 사용, 없으면 기본값
                systemInstruction: systemPrompt ? {
                    parts: [{ text: systemPrompt }]
                } : undefined,
                generationConfig: {
                    temperature: 0.7,
                    maxOutputTokens: 300
                }
            })
        });

        const data = await response.json();

        if (data.error) {
            console.error("Gemini API Error:", data.error);
            return res.status(500).json({ error: data.error.message });
        }

        const reply = data.candidates[0].content.parts[0].text;
        return res.status(200).json({ reply });

    } catch (error) {
        console.error("Server Error:", error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}
