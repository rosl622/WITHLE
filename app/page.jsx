"use client";

import FuneralCard from "@/components/FuneralCard";
import FilterBar from "@/components/FilterBar";
import FloatingCTA from "@/components/FloatingCTA";
import Hero from "@/components/Hero";
import { useFuneralHomes } from "@/hooks/useFuneralHomes";

export default function Home() {
    const {
        homes: filteredHomes,
        isLoading,
        activeFilter,
        setActiveFilter,
        activeSort,
        setActiveSort
    } = useFuneralHomes();

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
