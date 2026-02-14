"use client";

import Link from "next/link";
import { Menu, User, LogOut } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Nav() {
    const [user, setUser] = useState(null);
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
        await supabase.auth.signOut();
        router.refresh(); // Refresh server components
        router.push('/');
    };

    return (
        <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-border-main">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2">
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
                        <Link href="/login" className="hover:text-green-mid transition-colors font-bold">로그인</Link>
                    )}
                </div>

                {/* CTA Button or Mobile Menu */}
                <div className="flex items-center gap-4">
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
            </div>
        </nav>
    );
}
