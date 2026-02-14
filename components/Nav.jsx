import Link from "next/link";
import { Menu } from "lucide-react";

export default function Nav() {
    return (
        <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-border-main">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2">
                    <span className="text-2xl pt-1">🌿</span>
                    <span className="text-xl font-bold text-green-dark font-serif tracking-tight">Withle</span>
                </Link>

                {/* Desktop Menu */}
                <div className="hidden md:flex gap-8 text-text-secondary font-medium">
                    <Link href="/" className="hover:text-green-mid transition-colors">장례식장 찾기</Link>
                    <Link href="/memorial/intro.html" className="hover:text-green-mid transition-colors">추모 공간</Link>
                    <Link href="#" className="hover:text-green-mid transition-colors">장례 가이드</Link>
                </div>

                {/* CTA Button */}
                <div className="hidden md:block">
                    <Link href="/memorial/intro.html"
                        className="bg-green-main hover:bg-green-mid text-white px-5 py-2 rounded-full font-semibold transition-all hover:shadow-lg text-sm start-memorial-btn">
                        추모 공간 만들기
                    </Link>
                </div>

                {/* Mobile Menu Button */}
                <button className="md:hidden p-2 text-text-primary">
                    <Menu className="w-6 h-6" />
                </button>
            </div>
        </nav>
    );
}
