"use client";

import { createClient } from "@/utils/supabase/client";
import { useState } from "react";
import { MessageCircle } from "lucide-react"; // Using MessageCircle as generic icon, or import specific logos if available

export default function LoginPage() {
    const supabase = createClient();
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async (provider) => {
        setIsLoading(true);
        const { error } = await supabase.auth.signInWithOAuth({
            provider: provider, // 'kakao' or 'naver'
            options: {
                redirectTo: `${location.origin}/auth/callback`,
                // Kakao: limit scopes to avoid KOE205 if email permission is not granted
                ...(provider === 'kakao' && { scopes: 'profile_nickname profile_image' }),
            },
        });

        if (error) {
            console.error("Login Error:", error);
            alert("로그인 중 오류가 발생했습니다.");
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-bg-base px-4">
            <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full text-center">
                <h1 className="text-2xl font-bold font-serif mb-2">로그인</h1>
                <p className="text-text-muted mb-8">SNS 계정으로 간편하게 시작하세요</p>

                <div className="space-y-3">
                    {/* Kakao Login */}
                    <button
                        onClick={() => handleLogin('kakao')}
                        disabled={isLoading}
                        className="w-full flex items-center justify-center gap-3 bg-[#FAE100] text-[#371D1E] py-3.5 rounded-lg font-bold hover:bg-[#F0D700] transition-colors"
                    >
                        <MessageCircle className="w-5 h-5 fill-current" /> {/* Using generic icon for now */}
                        카카오로 3초 만에 시작하기
                    </button>

                    {/* Naver Login */}
                    <button
                        onClick={() => handleLogin('naver')} // Note: Supabase provider name for Naver is usually 'naver' but check dashboard strictly
                        disabled={isLoading}
                        className="w-full flex items-center justify-center gap-3 bg-[#03C75A] text-white py-3.5 rounded-lg font-bold hover:bg-[#02B351] transition-colors"
                    >
                        <span className="font-black text-lg">N</span>
                        네이버로 시작하기
                    </button>
                </div>

                <div className="mt-8 text-xs text-text-muted">
                    로그인 시 이용약관 및 개인정보처리방침에 동의하게 됩니다.
                </div>
            </div>
        </div>
    );
}
