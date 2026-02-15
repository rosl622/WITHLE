"use client";

import { use, useState, useEffect } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MapPin, Phone, Star, Calendar, ShieldCheck, ArrowLeft } from "lucide-react";
import BookingModal from "@/components/BookingModal";


export default function FuneralHomeDetail({ params }) {
    const { id } = use(params);
    // id can be string 'csv-0' or number '1'

    const [home, setHome] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isBookingOpen, setIsBookingOpen] = useState(false);

    useEffect(() => {
        async function fetchHome() {
            try {
                // Determine if ID is from CSV (starts with 'csv-') or DB (number)
                // Actually, existing DB IDs were numbers. New ones are 'csv-X'.
                // Ideally, we just fetch ALL from API and find the one matching ID.
                // Since the API now returns CSV data, we should look there.
                // If we still want to support legacy DB data... we removed it from useFuneralHomes, 
                // so we should probably stick to one source for consistency.
                // Let's assume we are moving fully to CSV for now as per "make all of them".

                const response = await fetch('/api/funeral-homes');
                const data = await response.json();

                if (Array.isArray(data)) {
                    const found = data.find(h => h.id.toString() === id.toString());
                    if (found) {
                        setHome(found);
                    } else {
                        // Fallback: If not in CSV, maybe check Supabase?
                        // For now, let's just log not found.
                        console.warn("Home not found in CSV data");
                    }
                }
            } catch (error) {
                console.error("Error fetching home:", error);
            } finally {
                setIsLoading(false);
            }
        }
        fetchHome();
    }, [id]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-bg-base">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-main"></div>
            </div>
        );
    }

    if (!home) {
        notFound();
    }

    // Helper for price formatting
    const formatPrice = (price) => (price / 10000).toLocaleString();

    return (
        <div className="min-h-screen bg-bg-base pb-20">
            {/* Sticky Header for Mobile */}
            <div className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-border-main md:hidden px-4 py-3 flex items-center gap-3">
                <Link href="/" className="text-text-secondary">
                    <ArrowLeft className="w-6 h-6" />
                </Link>
                <span className="font-bold text-lg truncate">{home.name}</span>
            </div>

            <div className="container mx-auto px-4 py-6 md:py-10 max-w-5xl">
                {/* Back Button (Desktop) */}
                <Link href="/" className="hidden md:flex items-center text-text-muted hover:text-green-dark mb-6 transition-colors">
                    <ArrowLeft className="w-4 h-4 mr-1" />
                    목록으로 돌아가기
                </Link>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="md:col-span-2 space-y-8">
                        {/* Image Gallery */}
                        <div className="rounded-2xl overflow-hidden shadow-sm aspect-video bg-gray-100 relative group">
                            <img
                                src={home.image}
                                alt={home.name}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute bottom-4 right-4 bg-black/60 text-white text-xs px-3 py-1 rounded-full backdrop-blur-sm">
                                사진 더보기 +
                            </div>
                        </div>

                        {/* Title & Badge */}
                        <div>
                            <div className="flex flex-wrap items-center gap-2 mb-2">
                                {home.certified && (
                                    <span className="bg-green-main text-white text-xs px-2 py-0.5 rounded-full font-bold flex items-center">
                                        <ShieldCheck className="w-3 h-3 mr-1" />
                                        허가업체 {home.permitNo}
                                    </span>
                                )}
                                {home.open24h && (
                                    <span className="bg-terra-main text-white text-xs px-2 py-0.5 rounded-full font-bold">
                                        24시간 운영
                                    </span>
                                )}
                            </div>
                            <h1 className="text-3xl font-bold font-serif text-text-primary mb-2">{home.name}</h1>
                            <div className="flex items-center text-text-secondary text-sm mb-4">
                                <MapPin className="w-4 h-4 mr-1 text-text-muted" />
                                {home.address}
                            </div>
                            <div className="flex items-center gap-4 text-sm border-y border-border-main py-4">
                                <div className="flex items-center">
                                    <Star className="w-4 h-4 text-terra-main fill-current mr-1" />
                                    <span className="font-bold text-text-primary mr-1">{home.rating}</span>
                                    <span className="text-text-muted">({home.review_count}개 후기)</span>
                                </div>
                                <div className="h-4 w-px bg-border-main"></div>
                                <div className="text-text-secondary">
                                    {home.director}
                                </div>
                            </div>
                        </div>

                        {/* Description */}
                        <section>
                            <h2 className="text-xl font-bold mb-3 text-text-primary">업체 소개</h2>
                            <p className="text-text-secondary leading-relaxed whitespace-pre-line">
                                {home.description || "반려동물과의 소중한 이별, 저희가 함께하겠습니다. 따뜻하고 편안한 분위기에서 아이를 배웅할 수 있도록 최선을 다하겠습니다."}
                                {home.reviewHighlight && (
                                    <span className="block mt-4 p-4 bg-bg-muted rounded-xl text-text-secondary italic border-l-4 border-green-main">
                                        "{home.reviewHighlight}"
                                    </span>
                                )}
                            </p>
                        </section>

                        {/* Facilities */}
                        <section>
                            <h2 className="text-xl font-bold mb-3 text-text-primary">보유 시설</h2>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                {home.facilities?.map((facility, index) => (
                                    <div key={index} className="bg-white border border-border-main rounded-lg p-3 text-center text-sm text-text-secondary hover:border-green-main transition-colors">
                                        {facility}
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Pricing */}
                        <section>
                            <h2 className="text-xl font-bold mb-3 text-text-primary">장례 비용</h2>
                            <div className="bg-white rounded-xl border border-border-main overflow-hidden">
                                <div className="grid grid-cols-3 divide-x divide-border-main bg-bg-muted text-center py-2 text-sm font-bold text-text-secondary">
                                    <div>소형 (5kg 미만)</div>
                                    <div>중형 (5~15kg)</div>
                                    <div>대형 (15kg 이상)</div>
                                </div>
                                <div className="grid grid-cols-3 divide-x divide-border-main text-center py-4 text-text-primary">
                                    <div>{formatPrice(home.price.small)}만원</div>
                                    <div>{formatPrice(home.price.medium)}만원</div>
                                    <div>{formatPrice(home.price.large)}만원</div>
                                </div>
                            </div>
                            <p className="text-xs text-text-muted mt-2 text-right">* 기본 장례(염습+추모+화장) 기준이며, 수의/관 등 선택사항은 별도입니다.</p>
                        </section>
                    </div>

                    {/* Sidebar (Booking CTA) */}
                    <div className="hidden md:block">
                        <div className="sticky top-24 bg-white rounded-2xl shadow-lg border border-border-main p-6">
                            <div className="text-center mb-6">
                                <p className="text-text-secondary text-sm mb-1">예상 기본 비용</p>
                                <div className="text-3xl font-bold text-green-dark">
                                    {formatPrice(home.price.small)}만원~
                                </div>
                            </div>

                            <button
                                onClick={() => setIsBookingOpen(true)}
                                className="w-full bg-green-main hover:bg-green-mid text-white font-bold py-3.5 rounded-xl mb-3 shadow-md transition-all hover:shadow-lg flex items-center justify-center gap-2 btn-pulse"
                            >
                                <Calendar className="w-5 h-5" />
                                예약하기
                            </button>

                            <button className="w-full bg-white border border-green-main text-green-main hover:bg-green-bg font-bold py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2">
                                <Phone className="w-5 h-5" />
                                전화 상담
                            </button>

                            <div className="mt-4 text-xs text-text-muted text-center">
                                <p>📞 24시간 연중무휴 상담 가능</p>
                                <p>⭐️ 예약금 없이 무료로 예약하세요</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Bottom CTA */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-border-main p-4 md:hidden flex gap-3 z-50 safe-area-bottom">
                <a href={`tel:${home.phone}`} className="flex-1 bg-white border border-green-main text-green-main font-bold py-3 rounded-xl flex items-center justify-center">
                    <Phone className="w-5 h-5 mr-1" /> 상담
                </a>
                <button
                    onClick={() => setIsBookingOpen(true)}
                    className="flex-[2] bg-green-main text-white font-bold py-3 rounded-xl shadow-lg flex items-center justify-center btn-pulse"
                >
                    <Calendar className="w-5 h-5 mr-1" /> 예약하기
                </button>
            </div>

            <BookingModal isOpen={isBookingOpen} onClose={() => setIsBookingOpen(false)} home={home} />
        </div>
    );
}
