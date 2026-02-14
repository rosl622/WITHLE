import { NextResponse } from 'next/server';

const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;

export async function POST(request) {
    try {
        const { message, systemPrompt } = await request.json();

        // 1. If API Key exists, use Real AI (Gemini)
        if (apiKey) {
            try {
                const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

                const response = await fetch(url, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        contents: [{ parts: [{ text: message }] }],
                        systemInstruction: systemPrompt ? { parts: [{ text: systemPrompt }] } : undefined,
                        generationConfig: {
                            temperature: 0.7,
                            maxOutputTokens: 300
                        }
                    })
                });

                const data = await response.json();

                if (data.error) {
                    console.error("Gemini API Error:", data.error);
                    throw new Error(data.error.message);
                }

                const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "멍... (말을 이해하지 못했어요)";
                return NextResponse.json({ reply });

            } catch (error) {
                console.error("AI Service Error:", error);
                // Fallback to mock if API fails
            }
        }

        // 2. Mock Fallback (Local Dev or No Key)
        console.log("Using Mock AI Response (No API Key or Error)");
        let reply = "멍! 무슨 말인지 잘 모르겠지만 사랑해! 💕 (데모 모드)";

        if (message.includes("안녕")) {
            reply = "안녕! 나 여기서 잘 지내고 있어! 꼬리 흔들흔들~ 🐕";
        } else if (message.includes("사랑해")) {
            reply = "나도 정말 많이 사랑해! 꿈에서 만나자! 💖";
        } else if (message.includes("보고싶어")) {
            reply = "울지마! 난 항상 네 곁에 있어. 눈 감으면 내가 보일 거야! ✨";
        } else if (message.includes("간식")) {
            reply = "여기 간식 진짜 많아! 친구들이랑 나눠 먹고 있어! 🍖";
        }

        // Simulate network delay for realism
        await new Promise(resolve => setTimeout(resolve, 800));

        return NextResponse.json({ reply });

    } catch (error) {
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
