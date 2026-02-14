"use client";

import { useState, useMemo, useEffect } from "react";
import { Search, MapPin } from "lucide-react";
import FuneralCard from "@/components/FuneralCard";
import FilterBar from "@/components/FilterBar";
import FloatingCTA from "@/components/FloatingCTA";
import { createClient } from "@/utils/supabase/client";

export default function Home() {
    const [homes, setHomes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeFilter, setActiveFilter] = useState("전체");
    const [activeSort, setActiveSort] = useState("distance");

    const supabase = createClient();

    // Fetch from Supabase
    useEffect(() => {
        async function fetchHomes() {
            const { data, error } = await supabase.from('funeral_homes').select('*');

            if (error) {
                console.error("Error fetching homes:", error);
            } else if (data) {
                // Map DB fields to Component expected structure
                const mappedData = data.map(h => ({
                    ...h,
                    distance: (Math.random() * 20).toFixed(1), // Mock distance for now (not in DB)
                    price: {
                        small: h.price_small,
                        medium: h.price_medium,
                        large: h.price_large
                    }
                }));
                setHomes(mappedData);
            }
            setIsLoading(false);
        }

        fetchHomes();
    }, []);

    // Filtering & Sorting Logic
    const filteredHomes = useMemo(() => {
        let result = [...homes];

        // Filter
        if (activeFilter !== "전체") {
            result = result.filter(home => {
                if (activeFilter === "24시간") return home.open24h;
                return home.tags?.includes(activeFilter) || home.facilities?.includes(activeFilter);
            });
        }

        // Sort
        result.sort((a, b) => {
            if (activeSort === "distance") return a.distance - b.distance;
            if (activeSort === "rating") return b.rating - a.rating;
            if (activeSort === "price") return a.price.small - b.price.small;
            return 0;
        });

        return result;
    }, [homes, activeFilter, activeSort]);

    return (
        <div className="flex flex-col min-h-screen pb-20">
            {/* Hero Section */}
            <section className="relative h-[480px] flex items-center justify-center bg-gradient-to-br from-green-dark via-green-main to-green-light text-white overflow-hidden">
                {/* Abstract Background Shapes */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-20 left-10 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute bottom-20 right-10 w-80 h-80 bg-green-dark/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
                </div>

                <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
                    <span className="inline-block px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-sm text-white text-sm font-semibold mb-6 border border-white/30 animate-fade-in">
                        우리 아이와 이별하는 가장 현명한 방법
                    </span>
                    <h1 className="text-4xl md:text-5xl font-bold mb-6 font-serif leading-tight text-shadow-sm animate-fade-in" style={{ animationDelay: '0.1s' }}>
                        반려동물 장례식장,<br />
                        투명하게 비교하고 예약하세요
                    </h1>
                    <p className="text-lg md:text-xl text-white/90 mb-10 animate-fade-in" style={{ animationDelay: '0.2s' }}>
                        전국 73개 허가받은 장례식장의 가격, 시설, 후기를 한눈에 확인하세요.
                    </p>

                    {/* Search Bar */}
                    <div className="bg-white p-2 rounded-full shadow-lg flex items-center max-w-2xl mx-auto animate-fade-in transform hover:scale-[1.01] transition-transform" style={{ animationDelay: '0.3s' }}>
                        <div className="flex items-center pl-4 text-gray-400">
                            <MapPin className="w-5 h-5" />
                        </div>
                        <input
                            type="text"
                            placeholder="지역을 입력하세요 (예: 강남구, 분당)"
                            className="flex-grow px-4 py-3 bg-transparent outline-none text-gray-800 placeholder-gray-400"
                        />
                        <button className="bg-green-dark hover:bg-green-mid text-white px-8 py-3 rounded-full font-bold transition-all shadow-md">
                            검색
                        </button>
                    </div>
                </div>
            </section>

            {/* Filter Bar */}
            <FilterBar
                activeFilter={activeFilter}
                onFilterChange={setActiveFilter}
                activeSort={activeSort}
                onSortChange={setActiveSort}
            />

            {/* Main Content Area */}
            <section className="py-12 bg-bg-base flex-grow">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="flex justify-between items-end mb-6">
                        <h2 className="text-xl font-bold text-text-primary">
                            추천 장례식장 <span className="text-green-mid ml-1">{filteredHomes.length}</span>
                        </h2>
                        <div className="text-xs text-text-muted">
                            광주시 오포읍 기준
                        </div>
                    </div>

                    {isLoading ? (
                        <div className="flex justify-center py-20">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-main"></div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-6">
                            {filteredHomes.map((home, index) => (
                                <div key={home.id} className="animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                                    <FuneralCard home={home} />
                                </div>
                            ))}
                        </div>
                    )}

                    {!isLoading && filteredHomes.length === 0 && (
                        <div className="text-center py-20 text-gray-400">
                            조건에 맞는 장례식장이 없습니다.
                        </div>
                    )}
                </div>
            </section>

            <FloatingCTA />
        </div>
    );
}
