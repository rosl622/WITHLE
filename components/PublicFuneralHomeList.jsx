"use client";

import { useState, useMemo } from "react";
import FuneralCard from "@/components/FuneralCard";
import FilterBar from "@/components/FilterBar";
import Hero from "@/components/Hero";
import FloatingCTA from "@/components/FloatingCTA";

export default function PublicFuneralHomeList({ initialHomes = [] }) {
    const [activeFilter, setActiveFilter] = useState("전체");
    const [activeSort, setActiveSort] = useState("distance");

    // Filtering & Sorting Logic (similar to useFuneralHomes)
    const filteredHomes = useMemo(() => {
        if (!initialHomes) return [];
        let result = [...initialHomes];


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
    }, [initialHomes, activeFilter, activeSort]);

    return (
        <div className="flex flex-col min-h-screen pb-20">
            {/* Hero Section */}
            <Hero />

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
                            전국 등록 장묘업체 <span className="text-green-mid ml-1">{filteredHomes.length}</span>
                        </h2>
                        <div className="text-xs text-text-muted">
                            농림축산식품부 데이터 기준
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-6">
                        {filteredHomes.map((home, index) => (
                            <div key={home.id} className="animate-fade-in" style={{ animationDelay: `${index * 0.05}s` }}>
                                <FuneralCard home={home} />
                            </div>
                        ))}
                    </div>

                    {filteredHomes.length === 0 && (
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
