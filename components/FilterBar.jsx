import { SlidersHorizontal, ChevronDown } from "lucide-react";

export default function FilterBar({ filters, activeFilter, onFilterChange, activeSort, onSortChange }) {
    const categories = ["전체", "24시간", "납골당", "수목장", "스톤제작", "픽업서비스"];

    return (
        <div className="sticky top-16 z-40 bg-white/95 backdrop-blur-sm border-b border-border-main py-3 shadow-sm">
            <div className="container mx-auto px-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">

                {/* Category Filters */}
                <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto scrollbar-hide">
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => onFilterChange(cat)}
                            className={`whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-medium transition-all ${activeFilter === cat
                                    ? "bg-green-dark text-white shadow-md"
                                    : "bg-bg-muted text-text-secondary hover:bg-green-bg hover:text-green-dark"
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Sort & More Filters */}
                <div className="flex items-center gap-3 w-full md:w-auto justify-end">
                    <div className="relative group">
                        <button className="flex items-center gap-1 text-sm font-medium text-text-secondary hover:text-green-dark">
                            {activeSort === 'distance' ? '거리순' : activeSort === 'rating' ? '평점순' : '가격순'}
                            <ChevronDown className="w-4 h-4" />
                        </button>
                        {/* Dropdown Menu (Simple Implementation) */}
                        <div className="absolute right-0 top-full mt-2 w-32 bg-white rounded-xl shadow-lg border border-border-main py-2 hidden group-hover:block animate-fade-in">
                            <button onClick={() => onSortChange('distance')} className="block w-full text-left px-4 py-2 text-sm hover:bg-bg-muted">거리순</button>
                            <button onClick={() => onSortChange('rating')} className="block w-full text-left px-4 py-2 text-sm hover:bg-bg-muted">평점순</button>
                            <button onClick={() => onSortChange('price')} className="block w-full text-left px-4 py-2 text-sm hover:bg-bg-muted">가격순</button>
                        </div>
                    </div>

                    <button className="flex items-center gap-1.5 px-3 py-1.5 border border-border-main rounded-lg text-sm font-medium text-text-secondary hover:border-green-dark hover:text-green-dark transition-colors">
                        <SlidersHorizontal className="w-4 h-4" />
                        필터
                    </button>
                </div>
            </div>
        </div>
    );
}
