"use client";

import Link from "next/link";
import { Menu, User, LogOut } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Nav() {
    const [user, setUser] = useState(null);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const supabase = createClient();
    const router = useRouter();

    useEffect(() => {
        // Check active session
        const checkUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);
        };
        checkUser();

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
        });

        return () => subscription.unsubscribe();
    }, []);

    const handleLogout = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) {
            console.error("Logout error:", error);
        }
        setIsMobileMenuOpen(false); // Close menu on logout
        router.refresh();
        router.push('/');
    };

    return (
        <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-border-main">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2" onClick={() => setIsMobileMenuOpen(false)}>
                    <span className="text-2xl pt-1">🌿</span>
                    <span className="text-xl font-bold text-green-dark font-serif tracking-tight">Withle</span>
                </Link>

                {/* Desktop Menu */}
                <div className="hidden md:flex gap-8 text-text-secondary font-medium items-center">
                    <Link href="/" className="hover:text-green-mid transition-colors">장례식장 찾기</Link>
                    <Link href="/memorial/intro.html" className="hover:text-green-mid transition-colors">추모 공간</Link>
                    {user ? (
                        <div className="flex items-center gap-4">
                            <span className="text-sm text-text-muted flex items-center gap-1">
                                <User className="w-4 h-4" />
                                {user.email?.split('@')[0]}님
                            </span>
                            <button
                                onClick={handleLogout}
                                className="text-sm text-text-secondary hover:text-red-500 transition-colors flex items-center gap-1"
                            >
                                <LogOut className="w-4 h-4" />
                                로그아웃
                            </button>
                        </div>
                    ) : (
                        <Link href="/login" className="px-5 py-2 rounded-full border border-green-main text-green-main hover:bg-green-main hover:text-white transition-all font-semibold text-sm">
                            로그인
                        </Link>
                    )}
                </div>

                {/* CTA Button and Mobile Menu Toggle */}
                <div className="flex items-center gap-4">
                    <div className="hidden md:block">
                        <Link href="/memorial/intro.html"
                            className="bg-green-main hover:bg-green-mid text-white px-5 py-2 rounded-full font-semibold transition-all hover:shadow-lg text-sm start-memorial-btn">
                            추모 공간 만들기
                        </Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden p-2 text-text-primary z-50 relative"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? <LogOut className="w-6 h-6 rotate-45" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            {isMobileMenuOpen && (
                <div className="fixed inset-0 bg-white z-40 flex flex-col pt-24 px-6 md:hidden animate-in fade-in duration-200">
                    <div className="flex flex-col gap-6 text-lg font-medium text-text-primary">
                        <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="py-2 border-b border-gray-100">
                            장례식장 찾기
                        </Link>
                        <Link href="/memorial/intro.html" onClick={() => setIsMobileMenuOpen(false)} className="py-2 border-b border-gray-100">
                            추모 공간
                        </Link>

                        {user ? (
                            <div className="flex flex-col gap-4 mt-4">
                                <div className="flex items-center gap-2 text-sm text-text-muted">
                                    <User className="w-5 h-5" />
                                    {user.email}
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center gap-2 text-red-500 py-2"
                                >
                                    <LogOut className="w-5 h-5" />
                                    로그아웃
                                </button>
                            </div>
                        ) : (
                            <Link href="/login" onClick={() => setIsMobileMenuOpen(false)} className="py-2 mt-2 font-bold text-green-dark">
                                로그인
                            </Link>
                        )}

                        <div className="mt-8">
                            <Link href="/memorial/intro.html" onClick={() => setIsMobileMenuOpen(false)}
                                className="w-full block text-center bg-green-main text-white py-3.5 rounded-xl font-bold">
                                추모 공간 만들기
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
}
