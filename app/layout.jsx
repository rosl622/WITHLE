import { Noto_Sans_KR, Noto_Serif_KR } from "next/font/google";
import "./globals.css";
import Nav from "@/components/Nav";

const notoSans = Noto_Sans_KR({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700"],
    variable: "--font-noto-sans",
    preload: false,
});

const notoSerif = Noto_Serif_KR({
    subsets: ["latin"],
    weight: ["400", "600", "700"],
    variable: "--font-noto-serif",
    preload: false,
});

export const metadata = {
    title: "Withle - 반려동물 장례식장 비교 플랫폼",
    description: "내 아이를 위한 마지막 선물, 가장 따뜻한 이별을 준비하세요.",
    openGraph: {
        title: "Withle - 반려동물 장례식장 비교 플랫폼",
        description: "내 아이를 위한 마지막 선물, 가장 따뜻한 이별을 준비하세요.",
        type: "website",
    },
};

export default function RootLayout({ children }) {
    return (
        <html lang="ko" className={`${notoSans.variable} ${notoSerif.variable}`}>
            <body className="antialiased min-h-screen flex flex-col bg-bg-base text-text-primary font-sans">
                <Nav />
                <main className="flex-grow">
                    {children}
                </main>
                <footer className="bg-white border-t border-border-main py-8 text-center text-text-muted text-sm">
                    <div className="flex justify-center gap-6 mb-4">
                        <a href="/memorial/intro.html" className="hover:text-green-mid transition-colors">추모 공간 만들기</a>
                        <a href="/memorial/terms.html" className="hover:text-green-mid transition-colors">이용약관</a>
                        <a href="/memorial/privacy.html" className="hover:text-green-mid transition-colors">개인정보처리방침</a>
                    </div>
                    <p>&copy; 2026 Withle. All rights reserved.</p>
                </footer>
            </body>
        </html>
    );
}
